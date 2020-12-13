import 'reflect-metadata';
import { mock, mockReset, MockProxy } from 'jest-mock-extended';

import { IFilesService } from '../files/files.service';
import { InjectorService } from '../injector/injector.service';
import { IDictionaryService } from './dictionary.service';
import { IDictionaryServiceKkey, IFilesServiceKey } from '../injector/type-keys';

describe('DictionaryService', () => {
	let sut: IDictionaryService;
	let filesServiceMock: MockProxy<IFilesService>;

	const filePath = 'file/path.txt';
	const lines = ['Abc', 'aBc', 'abC'];

	const container = InjectorService.getContainer();

	beforeEach(() => {
		filesServiceMock = mock<IFilesService>();

		container.rebind<IFilesService>(IFilesServiceKey).toConstantValue(filesServiceMock);

		sut = container.get<IDictionaryService>(IDictionaryServiceKkey);
	});

	afterEach(() => {
		mockReset(filesServiceMock);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	describe('read', () => {
		it('should throw expected error when file does not exists', () => {
			filesServiceMock.exists.calledWith(filePath).mockResolvedValue(false);
			const existsResult = async () => await sut.read(filePath);

			expect(existsResult).rejects.toThrow('File does not exist');
		});

		it('should throw expected error when path does not point to a file', () => {
			filesServiceMock.exists.calledWith(filePath).mockResolvedValue(true);
			filesServiceMock.isFile.calledWith(filePath).mockResolvedValue(false);
			const existsResult = async () => await sut.read(filePath);

			expect(existsResult).rejects.toThrow('Invalid operation');
		});

		it('should map correctly the received array items to the dictionary', async () => {
			const receivedArray: string[] = ['$', '$$', '%'];
			const expectedDictionary = new Map<string, string>();
			receivedArray.map((item: string) => expectedDictionary.set(item, item));
			filesServiceMock.exists.calledWith(filePath).mockResolvedValue(true);
			filesServiceMock.isFile.calledWith(filePath).mockResolvedValue(true);
			filesServiceMock.readAllLines.calledWith(filePath).mockResolvedValue(receivedArray);

			await sut.read(filePath);

			expect(sut.dictionary).toEqual(expectedDictionary);
		});
	});

	describe('search', () => {
		beforeEach(async () => {
			filesServiceMock.readAllLines.mockResolvedValue(lines);
			filesServiceMock.exists.mockResolvedValue(true);
			filesServiceMock.isFile.mockResolvedValue(true);

			await sut.read(filePath);
		});

		it('should return an empty array when no match is found', async () => {
			const term = 'def';

			const results = await sut.search(term);

			expect(results).toEqual([]);
		});

		it('should match all words with same chars ignoring case when called with caseSensitive false', async () => {
			const options = { caseSensitive: false, exactMath: true };
			const term = 'aBc';

			const results = await sut.search(term, options);

			expect(results).toEqual(lines);
		});

		it('should match only exact case word when called with caseSensitive true', async () => {
			const options = { caseSensitive: true, exactMath: true };
			const term = 'aBc';

			const results = await sut.search(term, options);

			expect(results).toEqual([term]);
		});

		it('should also match words partially ignoring case when called with caseSensitive false and exactMath false', async () => {
			const options = { caseSensitive: false, exactMath: false };
			const term = 'ac';

			const results = await sut.search(term, options);

			expect(results).toEqual(lines);
		});

		it('should not match words partially but consider case when called with caseSensitive true exactMath false', async () => {
			const options = { caseSensitive: true, exactMath: false };
			const term = 'aB';

			const results = await sut.search(term, options);

			expect(results).toEqual(['aBc']);
		});
	});
});

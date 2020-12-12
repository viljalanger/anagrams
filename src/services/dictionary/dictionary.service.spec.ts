import 'reflect-metadata';
import { mock, mockReset, MockProxy } from 'jest-mock-extended';

import { IFilesService } from '../files/files.service';
import { InjectorService } from '../injector/injector.service';
import { IDictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
	let sut: IDictionaryService;
	let filesServiceMock: MockProxy<IFilesService>;

	const filePath = 'file/path.txt';
	const lines = ['Abc', 'aBc', 'abC'];

	const container = InjectorService.getContainer();

	beforeEach(() => {
		filesServiceMock = mock<IFilesService>();
		container.rebind<IFilesService>('FilesService').toConstantValue(filesServiceMock);

		sut = container.get<IDictionaryService>('DictionaryService');
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

		it('should trim and map correctly the received array items to the dictionary', async () => {
			const receivedArray: string[] = ['   $   ', '   $$   ', '   %   '];
			const expectedDictionary = new Map<string, string>();
			receivedArray.forEach((item: string) => {
				item = item.trim();
				expectedDictionary.set(item, item);
			});
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
			const options = { caseSensitive: false };
			const term = 'aBc';

			const results = await sut.search(term, options);

			expect(results).toEqual(lines);
		});

		it('should match only exact case word when called with caseSensitive true', async () => {
			const options = { caseSensitive: true };
			const term = 'aBc';

			const results = await sut.search(term, options);

			expect(results).toEqual([term]);
		});
	});

	afterEach(() => {
		mockReset(filesServiceMock);
	});
});

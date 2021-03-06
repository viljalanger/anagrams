import 'reflect-metadata';
import { mock, mockReset, MockProxy } from 'jest-mock-extended';

import { IDictionaryServiceKey, IFilesServiceKey, Injector } from '@anagrams/injector';

import { IDictionaryService } from '../interfaces/dictionary.interface';
import { IFilesService } from '../interfaces/files.interface';

describe('DictionaryService', () => {
	let sut: IDictionaryService;
	let filesServiceMock: MockProxy<IFilesService>;

	const filePath = 'file/path.txt';
	const lines = ['Abc', 'aBc', 'abC', 'acB'];

	const container = Injector.getContainer();

	beforeEach(() => {
		filesServiceMock = mock<IFilesService>();

		container.rebind<IFilesService>(IFilesServiceKey).toConstantValue(filesServiceMock);

		sut = container.get<IDictionaryService>(IDictionaryServiceKey);
	});

	afterEach(() => {
		mockReset(filesServiceMock);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	describe('read', () => {
		it('should throw expected error when file does not exists', () => {
			const existsResult = async () => await sut.read(filePath);

			filesServiceMock.exists.calledWith(filePath).mockResolvedValue(false);

			expect(existsResult).rejects.toThrow('File does not exist');
		});

		it('should throw expected error when path does not point to a file', () => {
			const existsResult = async () => await sut.read(filePath);

			filesServiceMock.exists.calledWith(filePath).mockResolvedValue(true);
			filesServiceMock.isFile.calledWith(filePath).mockResolvedValue(false);

			expect(existsResult).rejects.toThrow('Cannot read something different from a file');
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
			const options = { caseSensitive: false, matchAllChars: true };
			const term = 'aBc';

			const results = await sut.search(term, options);

			expect(results).toEqual(lines);
		});

		it('should also match words partially ignoring case when called with caseSensitive false and matchAllChars false', async () => {
			const options = { caseSensitive: false, matchAllChars: false };
			const term = 'ac';

			const results = await sut.search(term, options);

			expect(results).toEqual(lines);
		});

		it('should not match words partially but consider case when called with caseSensitive true and matchAllChars false', async () => {
			const options = { caseSensitive: true, matchAllChars: false };
			const term = 'aB';
			const expectedAnagrams = ['aBc', 'acB'];

			const results = await sut.search(term, options);

			expect(results).toEqual(expectedAnagrams);
		});

		it('should find anagram with same case and match all chars when called with caseSensitive true and matchAllChars true', async () => {
			const options = { caseSensitive: true, matchAllChars: true };
			const term = 'baC';
			const expectedAnagrams = ['abC'];

			const results = await sut.search(term, options);

			expect(results).toEqual(expectedAnagrams);
		});
	});
});

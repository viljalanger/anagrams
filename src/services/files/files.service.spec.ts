/* eslint-disable security/detect-non-literal-fs-filename */

import { join } from 'path';
import fs from 'fs';
import { F_OK } from 'constants';

import { IFilesServiceKey, Injector } from '@anagrams/injector';

import { IFilesService } from '../interfaces/files.interface';

describe('FilesService', () => {
	let sut: IFilesService;
	const accessSpy = jest.spyOn(fs.promises, 'access');
	const lstatSpy = jest.spyOn(fs.promises, 'lstat');

	const testFilePath = join(process.cwd(), 'test-assets/file.txt');
	const fakeFilePath = 'fake/file/path.txt';

	const container = Injector.getContainer();

	beforeEach(() => {
		sut = container.get<IFilesService>(IFilesServiceKey);
	});

	afterEach(() => {
		accessSpy.mockReset();
		lstatSpy.mockReset();
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	describe('exists', () => {
		it('should call promises.access with expected parameters', async () => {
			await sut.exists(fakeFilePath);

			expect(fs.promises.access).toHaveBeenCalledWith(fakeFilePath, F_OK);
		});

		it('should return true when promises.access does not throw exception', async () => {
			accessSpy.mockResolvedValue();

			const exists = await sut.exists(fakeFilePath);

			expect(exists).toEqual(true);
		});

		it('should return false when promises.access throws an error', async () => {
			accessSpy.mockRejectedValue(new Error());

			const exists = await sut.exists(fakeFilePath);

			expect(exists).toEqual(false);
		});
	});

	describe('isFile', () => {
		it('should call promises.lstat with expected parameter', async () => {
			lstatSpy.mockResolvedValue(new fs.Stats());

			await sut.isFile(fakeFilePath);

			expect(fs.promises.lstat).toHaveBeenCalledWith(fakeFilePath);
		});
	});

	describe('readAllLines', () => {
		it('should return expected array', async () => {
			const expectedArray: string[] = ['$', '$$', '%'];

			const lines = await sut.readAllLines(testFilePath);

			expect(lines).toEqual(expectedArray);
		});
	});
});

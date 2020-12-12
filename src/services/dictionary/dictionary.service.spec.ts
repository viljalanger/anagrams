import 'reflect-metadata';
import { mock, mockReset, MockProxy } from 'jest-mock-extended';

import { IFilesService } from '../files/files.service';
import { InjectorService } from '../injector/injector.service';
import { IDictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
	let filesServiceMock: MockProxy<IFilesService>;
	const container = InjectorService.getContainer();
	let sut: IDictionaryService;

	beforeEach(() => {
		filesServiceMock = mock<IFilesService>();
		container.rebind<IFilesService>('FilesService').toConstantValue(filesServiceMock);

		sut = container.get<IDictionaryService>('DictionaryService');
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	afterEach(() => {
		mockReset(filesServiceMock);
	});
});

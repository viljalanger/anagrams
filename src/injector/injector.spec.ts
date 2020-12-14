import { Container } from 'inversify';
import { Logger } from 'tslog';

import {
	AnagramsProgramService,
	ConfigService,
	DictionaryService,
	FilesService,
	IAnagramsProgramService,
	IConfigService,
	IDictionaryService,
	IFilesService,
	IInteractionService,
	ILoggerService,
	InteractionService,
	IPerformanceService,
	LoggerService,
	PerformanceService,
} from '@anagrams/services';

import {
	IAnagramsProgramServiceKey,
	IConfigServiceKey,
	IDictionaryServiceKey,
	IFilesServiceKey,
	IInteractionServiceKey,
	ILoggerServiceKey,
	IPerformanceServiceKey,
	LoggerKey,
} from './type-keys';

import { Injector } from './injector';

describe('Injector container', () => {
	let sut: Container;

	beforeEach(() => {
		sut = Injector.getContainer();
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should return always the same instance of the container', () => {
		const anotherContainer = Injector.getContainer();

		expect(sut).toEqual(anotherContainer);
	});

	it('should return always the same instance of a class', () => {
		const firstInstance = sut.get<IAnagramsProgramService>(IAnagramsProgramServiceKey);
		const secondInstance = sut.get<IAnagramsProgramService>(IAnagramsProgramServiceKey);

		expect(firstInstance).toEqual(secondInstance);
	});

	it('should return correct dependencies', () => {
		const anagramsService = sut.get<IAnagramsProgramService>(IAnagramsProgramServiceKey);
		const configService = sut.get<IConfigService>(IConfigServiceKey);
		const dictionaryService = sut.get<IDictionaryService>(IDictionaryServiceKey);
		const filesService = sut.get<IFilesService>(IFilesServiceKey);
		const interactionService = sut.get<IInteractionService>(IInteractionServiceKey);
		const loggerService = sut.get<ILoggerService>(ILoggerServiceKey);
		const performanceService = sut.get<IPerformanceService>(IPerformanceServiceKey);
		const logger = sut.get<Logger>(LoggerKey);

		expect(anagramsService instanceof AnagramsProgramService).toBe(true);
		expect(configService instanceof ConfigService).toBe(true);
		expect(dictionaryService instanceof DictionaryService).toBe(true);
		expect(filesService instanceof FilesService).toBe(true);
		expect(interactionService instanceof InteractionService).toBe(true);
		expect(loggerService instanceof LoggerService).toBe(true);
		expect(performanceService instanceof PerformanceService).toBe(true);
		expect(logger instanceof Logger).toBe(true);
	});
});

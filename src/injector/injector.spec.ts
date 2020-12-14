/* eslint-disable @typescript-eslint/no-explicit-any */

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
		const instances: Map<string, any[]> = new Map();
		instances.set(IAnagramsProgramServiceKey, [
			sut.get<IAnagramsProgramService>(IAnagramsProgramServiceKey),
			sut.get<IAnagramsProgramService>(IAnagramsProgramServiceKey),
		]);
		instances.set(IConfigServiceKey, [
			sut.get<IConfigService>(IConfigServiceKey),
			sut.get<IConfigService>(IConfigServiceKey),
		]);
		instances.set(IDictionaryServiceKey, [
			sut.get<IDictionaryService>(IDictionaryServiceKey),
			sut.get<IDictionaryService>(IDictionaryServiceKey),
		]);
		instances.set(IFilesServiceKey, [
			sut.get<IFilesService>(IFilesServiceKey),
			sut.get<IFilesService>(IFilesServiceKey),
		]);
		instances.set(IInteractionServiceKey, [
			sut.get<IInteractionService>(IInteractionServiceKey),
			sut.get<IInteractionService>(IInteractionServiceKey),
		]);
		instances.set(ILoggerServiceKey, [
			sut.get<ILoggerService>(ILoggerServiceKey),
			sut.get<ILoggerService>(ILoggerServiceKey),
		]);
		instances.set(IPerformanceServiceKey, [
			sut.get<IPerformanceService>(IPerformanceServiceKey),
			sut.get<IPerformanceService>(IPerformanceServiceKey),
		]);
		instances.set(LoggerKey, [sut.get<Logger>(LoggerKey), sut.get<Logger>(LoggerKey)]);

		const instanceKeys: string[] = Array.from(instances.keys());

		instanceKeys.map((key: string) => {
			const pair = instances.get(key) as any[];

			expect(pair[0]).toEqual(pair[1]);
		});
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

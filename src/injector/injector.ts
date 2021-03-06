import { createInterface as createReadLineInterface } from 'readline';
import { promises, createReadStream } from 'fs';
import { performance, Performance } from 'perf_hooks';
import { Container, ContainerModule } from 'inversify';
import { Logger } from 'tslog';

import {
	IConfigService,
	IFilesService,
	FilesService,
	IDictionaryService,
	DictionaryService,
	IInteractionService,
	IAnagramsProgramService,
	AnagramsProgramService,
	ILoggerService,
	LoggerService,
	IPerformanceService,
	ConfigService,
	InteractionService,
	PerformanceService,
} from '@anagrams/services';

import { LoggerFactory } from '@anagrams/factories';

import {
	createReadLineInterfaceKey,
	createReadStreamKey,
	IAnagramsProgramServiceKey,
	IConfigServiceKey,
	IDictionaryServiceKey,
	IFilesServiceKey,
	IInteractionServiceKey,
	ILoggerServiceKey,
	IPerformanceServiceKey,
	LoggerKey,
	performanceKey,
	promisesKey,
} from './type-keys';

export class Injector {
	private static container: Container;

	static getContainer(): Container {
		if (!this.container) {
			this.container = new Container();

			this.configure();
		}

		return this.container;
	}

	private static configure(): void {
		const applicationDependencies = this.getApplicationDependencies();
		this.container.load(applicationDependencies);

		const configService = this.container.get<IConfigService>(IConfigServiceKey);
		const thirdPartyDependencies = this.getThirdPartyDependencies(configService);
		this.container.load(thirdPartyDependencies);
	}

	private static getApplicationDependencies(): ContainerModule {
		return new ContainerModule((bind) => {
			bind<IFilesService>(IFilesServiceKey).to(FilesService);
			bind<IDictionaryService>(IDictionaryServiceKey).to(DictionaryService);
			bind<IInteractionService>(IInteractionServiceKey).to(InteractionService);
			bind<IAnagramsProgramService>(IAnagramsProgramServiceKey).to(AnagramsProgramService);
			bind<ILoggerService>(ILoggerServiceKey).to(LoggerService);
			bind<IPerformanceService>(IPerformanceServiceKey).to(PerformanceService);
			bind<IConfigService>(IConfigServiceKey).to(ConfigService);
		});
	}

	private static getThirdPartyDependencies(configService: IConfigService): ContainerModule {
		const logger = LoggerFactory.createLogger(configService);

		return new ContainerModule((bind) => {
			bind<Logger>(LoggerKey).toConstantValue(logger);
			bind<Performance>(performanceKey).toConstantValue(performance);
			bind(promisesKey).toConstantValue(promises);
			bind(createReadStreamKey).toConstantValue(createReadStream);
			bind(createReadLineInterfaceKey).toConstantValue(createReadLineInterface);
		});
	}
}

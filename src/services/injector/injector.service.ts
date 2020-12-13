import { performance, Performance } from 'perf_hooks';
import { Container, ContainerModule } from 'inversify';
import { Logger } from 'tslog';

import {
	IAnagramsProgramServiceKey,
	IConfigServiceKey,
	IDictionaryServiceKkey,
	IFilesServiceKey,
	IInteractionServiceKey,
	ILoggerServiceKey,
	IPerformanceServiceKey,
	LoggerKey,
	performanceKey,
} from './type-keys';

import { AnagramsProgramService } from '../anagrams-program/anagrams-program.service';
import { DictionaryService } from '../dictionary/dictionary.service';
import { FilesService } from '../files/files.service';
import { InteractionService } from '../interaction/interaction.service';
import { LoggerService } from '../logger/logger.service';
import { PerformanceService } from '../performance/performance.service';
import { ConfigService } from '../config/config.service';
import { IAnagramsProgramService } from '../interfaces/anagrams-program.interface';
import { IConfigService } from '../interfaces/config.interface';
import { IDictionaryService } from '../interfaces/dictionary.interface';
import { IFilesService } from '../interfaces/files.interface';
import { IInteractionService } from '../interfaces/interaction.interface';
import { ILoggerService } from '../interfaces/logger.interface';
import { IPerformanceService } from '../interfaces/performance.interface';

export class InjectorService {
	private static _container: Container;

	static get container(): Container {
		return this._container;
	}

	static set container(value: Container) {
		this._container = value;
	}

	static getContainer(): Container {
		if (!this._container) {
			this._container = new Container();

			this.configure();
		}

		return this._container;
	}

	private static configure(): void {
		const applicationDependencies = this.getApplicationDependencies();
		this._container.load(applicationDependencies);

		const configService = this._container.get<IConfigService>(IConfigServiceKey);
		const thirdPartyDependencies = this.getThirdPartyDependencies(configService);
		this._container.load(thirdPartyDependencies);
	}

	private static getApplicationDependencies(): ContainerModule {
		return new ContainerModule((bind) => {
			bind<IFilesService>(IFilesServiceKey).to(FilesService);
			bind<IDictionaryService>(IDictionaryServiceKkey).to(DictionaryService);
			bind<IInteractionService>(IInteractionServiceKey).to(InteractionService);
			bind<IAnagramsProgramService>(IAnagramsProgramServiceKey).to(AnagramsProgramService);
			bind<ILoggerService>(ILoggerServiceKey).to(LoggerService);
			bind<IPerformanceService>(IPerformanceServiceKey).to(PerformanceService);
			bind<IConfigService>(IConfigServiceKey).to(ConfigService);
		});
	}

	private static getThirdPartyDependencies(configService: IConfigService): ContainerModule {
		const logger = new Logger({
			displayFilePath: 'hidden',
			minLevel: configService.isProduction() ? 'info' : 'silly',
			...configService.getTSLogSettings(),
		});

		return new ContainerModule((bind) => {
			bind<Logger>(LoggerKey).toConstantValue(logger);
			bind<Performance>(performanceKey).toConstantValue(performance);
		});
	}
}

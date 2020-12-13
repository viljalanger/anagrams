import { performance, Performance } from 'perf_hooks';
import { Container, ContainerModule } from 'inversify';
import { Logger } from 'tslog';

import { environment } from '@anagrams/environment';

import {
	AnagramsProgramService,
	IAnagramsProgramService,
} from '../anagrams-program/anagrams-program.service';
import { DictionaryService, IDictionaryService } from '../dictionary/dictionary.service';
import { FilesService, IFilesService } from '../files/files.service';
import { IInteractionService, InteractionService } from '../interaction/interaction.service';
import { ILoggerService, LoggerService } from '../logger/logger.service';
import { IPerformanceService, PerformanceService } from '../performance/performance.service';
import {
	IAnagramsProgramServiceKey,
	IDictionaryServiceKkey,
	IFilesServiceKey,
	IInteractionServiceKey,
	ILoggerServiceKey,
	IPerformanceServiceKey,
	LoggerKey,
	performanceKey,
} from './type-keys';

export class InjectorService {
	container: Container;

	constructor() {
		this.container = new Container();

		this.configure();
	}

	static getContainer(): Container {
		return new InjectorService().container;
	}

	private configure(): void {
		const thirdPartyDependencies = this.getThirdPartyDependencies();
		const applicationDependencies = this.getApplicationDependencies();

		this.container.load(thirdPartyDependencies, applicationDependencies);
	}

	private getApplicationDependencies(): ContainerModule {
		return new ContainerModule((bind) => {
			bind<IFilesService>(IFilesServiceKey).to(FilesService);
			bind<IDictionaryService>(IDictionaryServiceKkey).to(DictionaryService);
			bind<IInteractionService>(IInteractionServiceKey).to(InteractionService);
			bind<IAnagramsProgramService>(IAnagramsProgramServiceKey).to(AnagramsProgramService);
			bind<ILoggerService>(ILoggerServiceKey).to(LoggerService);
			bind<IPerformanceService>(IPerformanceServiceKey).to(PerformanceService);
		});
	}

	private getThirdPartyDependencies(): ContainerModule {
		const logger = new Logger({ displayFilePath: 'hidden', ...environment.logger.tslogSettings });

		return new ContainerModule((bind) => {
			bind<Logger>(LoggerKey).toConstantValue(logger);
			bind<Performance>(performanceKey).toConstantValue(performance);
		});
	}
}

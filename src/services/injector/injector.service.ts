import { Container, ContainerModule } from 'inversify';
import { Logger } from 'tslog';
import {
	AnagramsProgramService,
	IAnagramsProgramService,
} from '../anagrams-program/anagrams-program.service';

import { environment } from '@anagrams/environment';

import { DictionaryService, IDictionaryService } from '../dictionary/dictionary.service';
import { FilesService, IFilesService } from '../files/files.service';
import { IInteractionService, InteractionService } from '../interaction/interaction.service';
import { ILoggerService, LoggerService } from '../logger/logger.service';

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
			bind<IFilesService>('FilesService').to(FilesService);
			bind<IDictionaryService>('DictionaryService').to(DictionaryService);
			bind<IInteractionService>('InteractionService').to(InteractionService);
			bind<IAnagramsProgramService>('AnagramsProgramService').to(AnagramsProgramService);
			bind<ILoggerService>('LoggerService').to(LoggerService);
		});
	}

	private getThirdPartyDependencies(): ContainerModule {
		const logger = new Logger({ displayFilePath: 'hidden', ...environment.logger.tslogSettings });

		return new ContainerModule((bind) => {
			bind<Logger>('Logger').toConstantValue(logger);
		});
	}
}

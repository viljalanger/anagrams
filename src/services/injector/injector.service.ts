import { Container } from 'inversify';
import {
	AnagramsProgramService,
	IAnagramsProgramService,
} from '../anagrams-program/anagrams-program.service';

import { DictionaryService, IDictionaryService } from '../dictionary/dictionary.service';
import { FilesService, IFilesService } from '../files/files.service';
import { IInteractionService, InteractionService } from '../interaction/interaction.service';

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
		this.container.bind<IFilesService>('FilesService').to(FilesService);
		this.container.bind<IDictionaryService>('DictionaryService').to(DictionaryService);
		this.container.bind<IInteractionService>('InteractionService').to(InteractionService);

		this.container
			.bind<IAnagramsProgramService>('AnagramsProgramService')
			.to(AnagramsProgramService);
	}
}

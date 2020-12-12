import { Container } from 'inversify';

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
	}
}

import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { SearchOptions } from '@anagrams/models';
import { formatResults } from '@anagrams/utils';

import { IDictionaryService } from '../dictionary/dictionary.service';
import { IInteractionService } from '../interaction/interaction.service';
import { askForTermQuestion, initQuestions, newSearchQuestion } from './program-questions';
import { closingCommand, matchNotFoundCommand } from './program-commands';
import { IDictionaryServiceKkey, IInteractionServiceKey } from '../injector/type-keys';

export interface IAnagramsProgramService {
	searchOptions: SearchOptions;
	continue: boolean;

	init(dictionaryPath: string): Promise<void>;
	run(): Promise<void>;
}

@injectable()
export class AnagramsProgramService implements IAnagramsProgramService {
	@inject(IInteractionServiceKey) private readonly interactionService!: IInteractionService;
	@inject(IDictionaryServiceKkey) private readonly disctionaryService!: IDictionaryService;

	private readonly askForTermQuestion = askForTermQuestion;
	private readonly initQuestions = initQuestions;
	private readonly newSearchQuestion = newSearchQuestion;

	private readonly closingCommand = closingCommand;
	private readonly matchNotFoundCommand = matchNotFoundCommand;

	private _searchOptions!: SearchOptions;
	private _continue = true;

	get searchOptions(): SearchOptions {
		return this._searchOptions;
	}

	get continue(): boolean {
		return this._continue;
	}

	async init(dictionaryPath: string): Promise<void> {
		this.interactionService.say('Welcome to the anagrams program!');
		this.interactionService.say('Reading dictionary...');

		await this.disctionaryService.read(dictionaryPath);

		this.interactionService.say('Done!');
		this.interactionService.say(`Imported ${this.disctionaryService.dictionary.size} entries`);
		this.interactionService.say('Before starting, let me ask you a couple of questions');
		const { caseSensitive, exactMatch } = await this.interactionService.ask(this.initQuestions);

		this._searchOptions = { caseSensitive, exactMatch };
	}

	async run(): Promise<void> {
		while (this._continue) {
			const { term } = await this.interactionService.ask(this.askForTermQuestion);

			const searchResults: string[] = await this.disctionaryService.search(term, this.searchOptions);

			if (searchResults && searchResults.length > 0) {
				await this.interactionService.say(formatResults(searchResults));
			} else {
				await this.interactionService.say(this.matchNotFoundCommand);
			}

			const { doNewSearch } = await this.interactionService.ask(this.newSearchQuestion);
			this._continue = doNewSearch;
		}

		await this.interactionService.say(this.closingCommand);
	}
}

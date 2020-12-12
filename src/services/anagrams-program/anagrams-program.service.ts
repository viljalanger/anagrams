import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { SearchOptions } from '@anagrams/models';
import { sortText } from '@anagrams/utils';

import { IDictionaryService } from '../dictionary/dictionary.service';
import { IInteractionService } from '../interaction/interaction.service';
import { formatResults } from '@anagrams/utils';
import { askForTermQuestion, initQuestions, newSearchQuestion } from './program-questions';
import { closingCommand, matchNotFoundCommand } from './program-commands';

export interface IAnagramsProgramService {
	searchOptions: SearchOptions;
	continue: boolean;

	init(dictionaryPath: string): Promise<void>;
	run(): Promise<void>;
}

@injectable()
export class AnagramsProgramService implements IAnagramsProgramService {
	@inject('InteractionService') private readonly interactionService!: IInteractionService;
	@inject('DictionaryService') private readonly disctionaryService!: IDictionaryService;

	private readonly askForTermQuestion = askForTermQuestion;
	private readonly initQuestions = initQuestions;
	private readonly newSearchQuestion = newSearchQuestion;

	private readonly closingCommand = closingCommand;
	private readonly matchNotFoundCommand = matchNotFoundCommand;

	private _searchOptions!: SearchOptions;
	private _continue: boolean = true;

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
		const { caseSensitive, matchAllChars } = await this.interactionService.ask(this.initQuestions);

		this._searchOptions = { caseSensitive, matchAllChars };
	}

	async run(): Promise<void> {
		while (this._continue) {
			const { term } = await this.interactionService.ask(this.askForTermQuestion);

			const searchResults: string[] = await this.disctionaryService.search(
				term,
				this.searchOptions,
			);

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

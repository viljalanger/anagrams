import { inject, injectable } from 'inversify';

import { SearchOptions } from '@anagrams/models';
import { sortText } from '@anagrams/utils';

import { IDictionaryService } from '../dictionary/dictionary.service';
import { IInteractionService } from '../interaction/interaction.service';
import { askForTermQuestion, initQuestions, newSearchQuestion } from './program-questions';

export interface IAnagramsProgramService {
	searchOptions: SearchOptions;
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

	private _searchOptions!: SearchOptions;
	private continue: boolean = true;

	public get searchOptions(): SearchOptions {
		return this._searchOptions;
	}

	async init(dictionaryPath: string): Promise<void> {
		this.interactionService.say('Welcome to the anagrams program!');
		this.interactionService.say('Reading dictionary...');

		await this.disctionaryService.read(dictionaryPath);

		this.interactionService.say('Done!');
		this.interactionService.say('Before starting, let me ask you a couple of questions');
		const { caseSensitive, matchAllChars } = await this.interactionService.ask(this.initQuestions);

		this._searchOptions = { caseSensitive, matchAllChars };
	}

	async run(): Promise<void> {
		while (this.continue) {
			const { term } = await this.interactionService.ask(this.askForTermQuestion);
			const sortedTerm: string = sortText(term).trim();

			const searchResults: string[] = await this.disctionaryService.search(
				sortedTerm,
				this.searchOptions,
			);

			if (searchResults && searchResults.length > 0) {
				await this.interactionService.say(`This is what I found: ${searchResults.join(', ')}`);
			} else {
				await this.interactionService.say(
					'Sorry, I did not find any result for the term you were looking for',
				);
			}

			const { doNewSearch } = await this.interactionService.ask(this.newSearchQuestion);
			this.continue = doNewSearch;

			if (this.continue) {
				await this.interactionService.say('Goodbye!');
			}
		}
	}
}

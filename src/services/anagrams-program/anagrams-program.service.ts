import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { SearchOptions } from '@anagrams/models';
import { formatResults } from '@anagrams/utils';

import { IDictionaryService } from '../dictionary/dictionary.service';
import { IInteractionService } from '../interaction/interaction.service';
import { askForTermQuestion, initQuestions, newSearchQuestion } from './program-questions';
import { closingCommand, invalidTermCommand, matchNotFoundCommand } from './program-commands';
import {
	IDictionaryServiceKkey,
	IInteractionServiceKey,
	IPerformanceServiceKey,
} from '../injector/type-keys';
import { IPerformanceService } from '../performance/performance.service';

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
	@inject(IPerformanceServiceKey) private readonly performanceService!: IPerformanceService;

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

		const readDictionary = async () => await this.disctionaryService.read(dictionaryPath);
		await this.performanceService.measure(readDictionary, 'Read dictionary');

		this.interactionService.say('Done!');
		this.interactionService.say(`Imported ${this.disctionaryService.dictionary.size} entries`);
		this.interactionService.say('Before starting, let me ask you a couple of questions');
		const { caseSensitive, matchAllChars } = await this.interactionService.ask(initQuestions);

		this._searchOptions = { caseSensitive, matchAllChars };
	}

	async run(): Promise<void> {
		while (this._continue) {
			const { term } = await this.interactionService.ask(askForTermQuestion);

			if (!term) {
				await this.interactionService.say(invalidTermCommand);

				continue;
			}

			const searchFunction = async (): Promise<string[]> => {
				return await this.disctionaryService.search(term, this.searchOptions);
			};
			const searchResults: string[] = await this.performanceService.measure(searchFunction, 'Search term');

			if (searchResults && searchResults.length > 0) {
				await this.interactionService.say(formatResults(searchResults));
			} else {
				await this.interactionService.say(matchNotFoundCommand);
			}

			const { doNewSearch } = await this.interactionService.ask(newSearchQuestion);
			this._continue = doNewSearch;
		}

		await this.interactionService.say(closingCommand);
	}
}

import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { InvalidInputException, SearchOptions } from '@anagrams/models';
import { formatResults } from '@anagrams/utils';
import {
	IConfigServiceKey,
	IDictionaryServiceKey,
	IInteractionServiceKey,
	IPerformanceServiceKey,
} from '@anagrams/injector';

import {
	askForTermQuestion,
	initQuestions,
	newSearchQuestion,
	closingCommand,
	invalidTermCommand,
	matchNotFoundCommand,
} from './program-prompts';

import { IAnagramsProgramService } from '../interfaces/anagrams-program.interface';
import { IDictionaryService } from '../interfaces/dictionary.interface';
import { IInteractionService } from '../interfaces/interaction.interface';
import { IPerformanceService } from '../interfaces/performance.interface';
import { IConfigService } from '../interfaces/config.interface';

@injectable()
export class AnagramsProgramService implements IAnagramsProgramService {
	@inject(IInteractionServiceKey) private readonly interactionService!: IInteractionService;
	@inject(IDictionaryServiceKey) private readonly disctionaryService!: IDictionaryService;
	@inject(IPerformanceServiceKey) private readonly performanceService!: IPerformanceService;
	@inject(IConfigServiceKey) private readonly configService!: IConfigService;

	private _searchOptions!: SearchOptions;
	private _continue = true;

	private cache: Map<string, string[]> = new Map();

	get searchOptions(): SearchOptions {
		return this._searchOptions;
	}

	get continue(): boolean {
		return this._continue;
	}

	async init(): Promise<void> {
		this.interactionService.say('Welcome to the anagrams program!');
		this.interactionService.say('Reading dictionary, please wait...');

		const dictionaryPath = this.configService.getDictionaryPath();
		const readDictionary = async () => await this.disctionaryService.read(dictionaryPath);
		await this.performanceService.measure(readDictionary, 'Read dictionary');

		this.interactionService.say('Done!');
		this.interactionService.say(`Imported ${this.disctionaryService.dictionary.size} entries`);
		this.interactionService.say('Before starting, let me ask you a couple of questions');

		const { caseSensitive, matchAllChars } = await this.interactionService.ask(...initQuestions);
		this._searchOptions = { caseSensitive, matchAllChars };
	}

	async run(): Promise<void> {
		while (this._continue) {
			const { term } = await this.interactionService.ask(askForTermQuestion);

			if (!term) {
				await this.interactionService.say(invalidTermCommand);

				throw new InvalidInputException(`Entered input is invalid: [${term}]`);
			}

			const termCopy = term.valueOf();
			const cached = this.cache.has(term);
			const searchResults: string[] = await this.search(cached, termCopy, term);

			this.cache.set(termCopy, searchResults);

			await this.printResults(searchResults, cached);

			const { doNewSearch } = await this.interactionService.ask(newSearchQuestion);
			this._continue = doNewSearch;
		}

		await this.interactionService.say(closingCommand);
	}

	private async search(cached: boolean, termCopy: string, term: string) {
		const searchFunction = async (): Promise<string[]> => {
			this.interactionService.say('Searching for matching words, please wait...');

			if (cached) {
				return this.cache.get(termCopy) as string[];
			}

			return await this.disctionaryService.search(term, this.searchOptions);
		};
		const searchResults: string[] = await this.performanceService.measure<string[]>(
			searchFunction,
			`Search term${cached ? ' cached' : ''}`,
		);
		return searchResults;
	}

	private async printResults(searchResults: string[], cached: boolean) {
		if (searchResults && searchResults.length > 0) {
			await this.interactionService.say(formatResults(searchResults));
			await this.interactionService.say(
				`Number of found entries: ${searchResults.length}${cached ? ', cached results' : ''}`,
			);

			return;
		}

		await this.interactionService.say(matchNotFoundCommand);
	}
}

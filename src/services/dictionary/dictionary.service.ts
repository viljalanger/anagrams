import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { sortText } from '@anagrams/utils';
import { SearchOptions } from '@anagrams/models';

import { IFilesService } from '../files/files.service';

export interface IDictionaryService {
	dictionary: Map<string, string>;
	read(dictionaryPath: string): Promise<void>;
	search(term: string, options?: SearchOptions): Promise<string[]>;
}

@injectable()
export class DictionaryService implements IDictionaryService {
	@inject('FilesService') private readonly filesService!: IFilesService;

	dictionary: Map<string, string> = new Map();

	async read(dictionaryPath: string, caseSesitive?: boolean): Promise<void> {
		const existsPath = await this.filesService.exists(dictionaryPath);
		if (!existsPath) {
			throw new Error('File does not exist');
		}

		const isFile = await this.filesService.isFile(dictionaryPath);
		if (!isFile) {
			throw new Error('Invalid operations');
		}

		const lines = await this.filesService.readAllLines(dictionaryPath);
		lines.map((line: string) => this.dictionary.set(line, line));
	}

	async search(term: string, options?: SearchOptions): Promise<string[]> {
		const { caseSensitive, matchAllChars } = options ?? {};
		term = caseSensitive ? term : term.toLowerCase();
		term = sortText(term);

		const matchingKeys = this.findMatchingKeys(term, caseSensitive);
		const results = matchingKeys.map((key: string) => this.dictionary.get(key)) as string[];

		return results;
	}

	private findMatchingKeys(term: string, caseSensitive?: boolean): string[] {
		const matchingKeys: string[] = [];

		let keys = Array.from(this.dictionary.keys());
		keys.forEach((key: string) => {
			let compareKey: string = caseSensitive ? key.valueOf() : key.valueOf().toLowerCase();
			compareKey = sortText(compareKey);

			if (compareKey === term) {
				matchingKeys.push(key);
			}
		});

		return matchingKeys;
	}
}

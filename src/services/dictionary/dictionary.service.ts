import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { sortText } from '@anagrams/utils';
import { SearchOptions, FileNotFoundException, InvalidOperationException } from '@anagrams/models';
import { IFilesServiceKey } from '@anagrams/injector';

import { IDictionaryService } from '../interfaces/dictionary.interface';
import { IFilesService } from '../interfaces/files.interface';

@injectable()
export class DictionaryService implements IDictionaryService {
	@inject(IFilesServiceKey) private readonly filesService!: IFilesService;

	dictionary: Map<string, string> = new Map();

	async read(dictionaryPath: string): Promise<void> {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const existsPath = await this.filesService.exists(dictionaryPath);
		if (!existsPath) {
			throw new FileNotFoundException('File does not exist');
		}

		const isFile = await this.filesService.isFile(dictionaryPath);
		if (!isFile) {
			throw new InvalidOperationException('Cannot read something different from a file');
		}

		const lines = await this.filesService.readAllLines(dictionaryPath);
		lines.map((line: string) => this.dictionary.set(line, line));
	}

	async search(term: string, options?: SearchOptions): Promise<string[]> {
		const { caseSensitive, matchAllChars } = options ?? {};
		term = caseSensitive ? term : term.toLowerCase();

		const matchingKeys = this.findMatchingKeys(term, caseSensitive, matchAllChars);
		const results = matchingKeys.map((key: string) => this.dictionary.get(key)) as string[];

		return results;
	}

	private findMatchingKeys(term: string, caseSensitive?: boolean, matchAllChars?: boolean): string[] {
		const keys = Array.from(this.dictionary.keys());
		return keys.filter((key: string) => {
			let compareKey: string = caseSensitive ? key.valueOf() : key.valueOf().toLowerCase();

			let partialMatch = false;
			if (!matchAllChars) {
				const termChars: string[] = term.split('');
				partialMatch = termChars.every((char: string) => compareKey.split('').includes(char));
			}

			compareKey = sortText(compareKey);
			term = sortText(term);

			return compareKey === term || partialMatch;
		});
	}
}

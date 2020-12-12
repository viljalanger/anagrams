import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { IFilesService } from '../files/files.service';

export interface IDictionaryService {
	read(dictionaryPath: string): Promise<void>;
}

@injectable()
export class DictionaryService implements IDictionaryService {
	@inject('FilesService') private readonly files!: IFilesService;

	private dictionary: Map<string, string> = new Map();

	async read(dictionaryPath: string, caseSesitive?: boolean): Promise<void> {
		const existsPath = await this.files.exists(dictionaryPath);
		if (!existsPath) {
			throw new Error('Path does not exist');
		}

		const isFile = await this.files.isFile(dictionaryPath);
		if (!isFile) {
			throw new Error('Invalid operation');
		}

		const lines = await this.files.readAllLines(dictionaryPath);
		this.mapLines(lines);
	}

	private mapLines(lines: string[]): void {
		lines.map((line: string) => {
			line = line.trim();

			this.dictionary.set(line, line);
		});
	}
}

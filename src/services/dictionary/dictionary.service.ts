import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { IFilesService } from '../files/files.service';

export interface IDictionaryService {
	dictionary: Map<string, string>;
	read(dictionaryPath: string): Promise<void>;
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
		this.mapLines(lines);
	}

	private mapLines(lines: string[]): void {
		lines.map((line: string) => {
			line = line.trim();

			this.dictionary.set(line, line);
		});
	}
}

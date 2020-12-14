import { promises, createReadStream } from 'fs';
import { createInterface as createReadLineInterface } from 'readline';
import { F_OK } from 'constants';
import { inject, injectable } from 'inversify';

import { Exception } from '@anagrams/models';
import { ILoggerServiceKey } from '@anagrams/injector';

import { IFilesService } from '../interfaces/files.interface';
import { ILoggerService } from '../interfaces/logger.interface';

@injectable()
export class FilesService implements IFilesService {
	@inject(ILoggerServiceKey) private readonly loggerService!: ILoggerService;

	async exists(filePath: string): Promise<boolean> {
		try {
			await promises.access(filePath, F_OK);

			return true;
		} catch (error) {
			return false;
		}
	}

	async isFile(filePath: string): Promise<boolean> {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const stats = await promises.lstat(filePath);

		return stats.isFile();
	}

	async readAllLines(filePath: string): Promise<string[]> {
		const fileStream = createReadStream(filePath);
		const readLine = createReadLineInterface({ input: fileStream });
		const lines: string[] = [];

		try {
			for await (const line of readLine) {
				lines.push(line);
			}
		} catch (exeception) {
			this.loggerService.logStackTrace(exeception);

			throw new Exception('An error occured while reading dictionary lines');
		} finally {
			readLine.close();
			fileStream.close();
		}

		return lines;
	}
}

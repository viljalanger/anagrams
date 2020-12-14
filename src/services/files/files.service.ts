/* eslint-disable @typescript-eslint/no-explicit-any */
// import { promises, createReadStream } from 'fs';
// import { createInterface as createReadLineInterface } from 'readline';
import { F_OK } from 'constants';
import { inject, injectable } from 'inversify';

import { Exception } from '@anagrams/models';
import {
	createReadLineInterfaceKey,
	createReadStreamKey,
	ILoggerServiceKey,
	promisesKey,
} from '@anagrams/injector';

import { IFilesService } from '../interfaces/files.interface';
import { ILoggerService } from '../interfaces/logger.interface';

@injectable()
export class FilesService implements IFilesService {
	@inject(ILoggerServiceKey) private readonly loggerService!: ILoggerService;
	@inject(promisesKey) private readonly promises!: any;
	@inject(createReadStreamKey) private readonly createReadStream!: any;
	@inject(createReadLineInterfaceKey) private readonly createReadLineInterface!: any;

	async exists(filePath: string): Promise<boolean> {
		try {
			await this.promises.access(filePath, F_OK);

			return true;
		} catch (error) {
			return false;
		}
	}

	async isFile(filePath: string): Promise<boolean> {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const stats = await this.promises.lstat(filePath);

		return stats.isFile();
	}

	async readAllLines(filePath: string): Promise<string[]> {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const fileStream = this.createReadStream(filePath);
		const readLine = this.createReadLineInterface({ input: fileStream });
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

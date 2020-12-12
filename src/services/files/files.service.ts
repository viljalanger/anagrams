import { promises, createReadStream } from 'fs';
import { createInterface as createReadLineInterface } from 'readline';
import { F_OK } from 'constants';

import { injectable } from 'inversify';

export interface IFilesService {
	exists(filePath: string): Promise<boolean>;
	isFile(filePath: string): Promise<boolean>;
	readAllLines(filePath: string): Promise<string[]>;
}

@injectable()
export class FilesService implements IFilesService {
	async exists(filePath: string): Promise<boolean> {
		return new Promise(async (resolve) => {
			try {
				await promises.access(filePath, F_OK);

				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	async isFile(filePath: string): Promise<boolean> {
		const stats = await promises.lstat(filePath);

		return stats.isFile();
	}

	async readAllLines(filePath: string): Promise<string[]> {
		const fileStream = createReadStream(filePath);
		const readLine = createReadLineInterface({ input: fileStream });

		const lines: string[] = [];
		for await (const line of readLine) {
			lines.push(line);
		}

		readLine.close();
		fileStream.close();

		return lines;
	}
}

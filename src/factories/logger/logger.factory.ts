import path from 'path';

import { appendFileSync, closeSync, existsSync, lstatSync, mkdirSync, openSync, readdirSync } from 'fs';

import moment from 'moment';

import { IConfigService } from 'src';
import { ILogObject, Logger } from 'tslog';

export class LoggerFactory {
	private static logger: Logger;

	private static rootPath: string;

	static createLogger(configService: IConfigService): Logger {
		if (!this.logger) {
			const env = configService.getEnv();
			const isDev = env === 'dev';
			const isStaging = env === 'staging';
			this.rootPath = isDev ? process.cwd() : __dirname;

			this.logger = new Logger({
				displayFilePath: 'hidden',
				minLevel: isDev ? 'silly' : isStaging ? 'debug' : 'info',
				...configService.getTSLogSettings(),
			});

			const fileTransport = this.getFileTransport(configService);
			this.bindTransport(this.logger, fileTransport);
		}

		return this.logger;
	}

	private static getMostRecentFile(logsDirectoryPath: string) {
		const files = this.orderByRecentFile(logsDirectoryPath);
		const filename = files.length ? files[0].file : undefined;

		return filename ? path.resolve(this.rootPath, filename) : undefined;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static orderByRecentFile(directory: string): any[] {
		return readdirSync(directory)
			.map((file) => {
				const filePath = path.resolve(directory, file);

				return { file: filePath, mtime: lstatSync(filePath).mtime };
			})
			.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
	}

	private static getFileTransport(configService: IConfigService): (logObject: ILogObject) => void {
		return (logObject: ILogObject) => {
			let currentLogFilePath: string | undefined;
			const logsDirectoryPath = path.resolve(this.rootPath, configService.getLogsPath());

			if (!existsSync(logsDirectoryPath)) {
				mkdirSync(logsDirectoryPath, { recursive: true });
			}

			currentLogFilePath = this.getMostRecentFile(logsDirectoryPath);
			if (currentLogFilePath) {
				const { tooBig, tooOld } = LoggerFactory.checkLogFileStatus(currentLogFilePath, configService);

				if (tooBig || tooOld) {
					currentLogFilePath = this.createNewLogFile(currentLogFilePath, logsDirectoryPath);
				}
			} else {
				currentLogFilePath = this.createNewLogFile(currentLogFilePath, logsDirectoryPath);
			}

			const message = `${JSON.stringify(logObject)}\n`;
			appendFileSync(currentLogFilePath, message);
		};
	}

	private static checkLogFileStatus(currentLogFilePath: string, configService: IConfigService) {
		const { ctime, size } = lstatSync(currentLogFilePath);
		const { maxDaysLogFileAge, maxMBLogFileSize } = configService.getFileTransportSettings();

		const tooBig = size >= maxMBLogFileSize * 1024 * 1024;
		const tooOld = this.getFileAgeInDays(ctime) >= maxDaysLogFileAge;
		return { tooBig, tooOld };
	}

	private static getFileAgeInDays(creationDate: Date): number {
		const timestamp = Date.now() - creationDate.getTime();

		return timestamp / (1000 * 60 * 60 * 24);
	}

	private static createNewLogFile(currentLogFilePath: string | undefined, logsDirectoryPath: string) {
		const timestamp = moment().format('YYYYMMDD_HH-mm-ss');
		currentLogFilePath = path.resolve(logsDirectoryPath, `${timestamp}_Anagrams.log`);

		closeSync(openSync(currentLogFilePath, 'w'));

		return currentLogFilePath;
	}

	private static bindTransport(logger: Logger, transport: (logObject: ILogObject) => void): void {
		logger.attachTransport({
			silly: transport,
			debug: transport,
			trace: transport,
			info: transport,
			warn: transport,
			error: transport,
			fatal: transport,
		});
	}
}

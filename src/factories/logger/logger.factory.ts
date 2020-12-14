import path from 'path';

import { appendFileSync, closeSync, existsSync, lstatSync, mkdirSync, openSync, readdirSync } from 'fs';

import moment from 'moment';

import { IConfigService } from 'src';
import { ILogObject, Logger } from 'tslog';

export class LoggerFactory {
	static createLogger(configService: IConfigService): Logger {
		const env = configService.getEnv();
		const isDev = env === 'dev';
		const isStaging = env === 'staging';

		const logger = new Logger({
			displayFilePath: 'hidden',
			minLevel: isDev ? 'silly' : isStaging ? 'debug' : 'info',
			...configService.getTSLogSettings(),
		});

		const fileTransport = this.getFileTransport(configService);
		this.bindTransport(logger, fileTransport);

		return logger;
	}

	private static orderByRecentFile(directory: string): any[] {
		return readdirSync(directory)
			.map((file) => {
				const filePath = path.resolve(directory, file);

				return { file: filePath, mtime: lstatSync(filePath).mtime };
			})
			.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
	}

	private static getMostRecentFile(logsDirectoryPath: string) {
		const files = this.orderByRecentFile(logsDirectoryPath);
		const filename = files.length ? files[0].file : undefined;

		return filename ? path.resolve(__dirname, filename) : undefined;
	}

	private static getFileTransport(configService: IConfigService): (logObject: ILogObject) => void {
		return (logObject: ILogObject) => {
			let currentLogFilePath: string | undefined;
			const logsDirectoryPath = path.resolve(__dirname, configService.getLogsPath());

			if (!existsSync(logsDirectoryPath)) {
				mkdirSync(logsDirectoryPath, { recursive: true });
			}

			currentLogFilePath = this.getMostRecentFile(logsDirectoryPath);
			if (!currentLogFilePath) {
				const timestamp = moment().format('YYYYMMDD_HH-mm-ss');
				currentLogFilePath = path.resolve(logsDirectoryPath, `${timestamp}_Anagrams.log`);

				closeSync(openSync(currentLogFilePath, 'w'));
			}

			const message = `${JSON.stringify(logObject)}\n`;
			appendFileSync(currentLogFilePath, message);
		};
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

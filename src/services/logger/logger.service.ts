import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';

import { LoggerKey } from '@anagrams/injector';
import { Exception } from '@anagrams/models';

import { ILoggerService } from '../interfaces/logger.interface';

@injectable()
export class LoggerService implements ILoggerService {
	@inject(LoggerKey) private readonly logger!: Logger;

	silly(...args: unknown[]): void {
		this.logger.silly(...args);
	}

	trace(...args: unknown[]): void {
		this.logger.trace(...args);
	}

	debug(...args: unknown[]): void {
		this.logger.debug(...args);
	}

	info(...args: unknown[]): void {
		this.logger.info(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}

	error(message: string, exeception?: Exception): void {
		this.logger.error(message, exeception?.message ?? '');

		if (exeception) {
			this.logStackTrace(exeception);
		}
	}

	logStackTrace(exeception: Exception): void {
		this.logger.debug(exeception);
	}
}

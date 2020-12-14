import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';

import { LoggerKey } from '@anagrams/injector';
import { Exception } from '@anagrams/models';

import { ILoggerService } from '../interfaces/logger.interface';

@injectable()
export class LoggerService implements ILoggerService {
	@inject(LoggerKey) private readonly logger!: Logger;

	silly(message: string): void {
		this.logger.silly(message);
	}

	trace(message: string): void {
		this.logger.trace(message);
	}

	debug(message: string, ...args: unknown[]): void {
		this.logger.debug(message, args);
	}

	info(message: string): void {
		this.logger.info(message);
	}

	warn(message: string): void {
		this.logger.warn(message);
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

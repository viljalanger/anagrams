import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';

import { LoggerKey } from '@anagrams/injector';
import { Exception } from '@anagrams/models';

import { ILoggerService } from '../interfaces/logger.interface';
import { objectContainsKey } from 'jest-mock-extended';

@injectable()
export class LoggerService implements ILoggerService {
	@inject(LoggerKey) private readonly logger!: Logger;

	silly(message: string, ...args: unknown[]): void {
		this.logger.silly(message, this.handleArgs(args));
	}

	trace(message: string, ...args: unknown[]): void {
		this.logger.trace(message, this.handleArgs(args));
	}

	debug(message: string, ...args: unknown[]): void {
		this.logger.debug(message, this.handleArgs(args));
	}

	info(message: string, ...args: unknown[]): void {
		this.logger.info(message, this.handleArgs(args));
	}

	warn(message: string, ...args: unknown[]): void {
		this.logger.warn(message, this.handleArgs(args));
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

	private handleArgs(args: unknown[]): unknown[] | undefined {
		const isUndefined = args.length === 1 && Object.keys(args).length === 0;

		return isUndefined ? undefined : args;
	}
}

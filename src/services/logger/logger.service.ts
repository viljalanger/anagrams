import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';

import { IConfigServiceKey, LoggerKey } from '@anagrams/injector';

import { IConfigService } from '../interfaces/config.interface';
import { ILoggerService } from '../interfaces/logger.interface';

@injectable()
export class LoggerService implements ILoggerService {
	@inject(LoggerKey) private readonly logger!: Logger;
	@inject(IConfigServiceKey) private readonly configService!: IConfigService;

	silly(message: string): void {
		this.logger.silly(message);
	}

	trace(message: string): void {
		this.logger.trace(message);
	}

	debug(message: string): void {
		this.logger.debug(message);
	}

	info(message: string): void {
		this.logger.info(message);
	}

	warn(message: string): void {
		this.logger.warn(message);
	}

	error(message: string, errorObj?: Error): void {
		this.logger.error(message, errorObj?.message ?? '');

		if (errorObj) {
			this.fatal(errorObj);
		}
	}

	fatal(errorObj: Error): void {
		if (!this.configService.isProduction()) {
			this.logger.fatal(errorObj);
		}
	}
}

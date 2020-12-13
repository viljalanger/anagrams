import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';
import { IConfigService } from '../config/config.service';
import { IConfigServiceKey, LoggerKey } from '../injector/type-keys';

export interface ILoggerService {
	silly(message: string): void;
	trace(message: string): void;
	debug(message: string): void;
	info(message: string): void;
	warn(message: string): void;
	error(message: string, errorObj?: Error): void;
	fatal(errorObj: Error): void;
}

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

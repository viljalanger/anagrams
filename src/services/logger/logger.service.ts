import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';

export interface ILoggerService {
	silly(message: string): void;
	trace(message: string): void;
	debug(message: string): void;
	info(message: string): void;
	warn(message: string): void;
	error(message: string): void;
	fatal(message: string): void;
}

@injectable()
export class LoggerService implements ILoggerService {
	@inject('Logger') private readonly logger!: Logger;

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

	error(message: string): void {
		this.logger.error(message);
	}

	fatal(message: string): void {
		this.logger.fatal(message);
	}
}

export interface ILoggerService {
	silly(message: string): void;
	trace(message: string): void;
	debug(message: string): void;
	info(message: string): void;
	warn(message: string): void;
	error(message: string, errorObj?: Error): void;
	fatal(errorObj: Error): void;
}

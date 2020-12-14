import { Exception } from '@anagrams/models';

export interface ILoggerService {
	silly(message: string, ...args: unknown[]): void;
	trace(message: string, ...args: unknown[]): void;
	debug(message: string, ...args: unknown[]): void;
	info(message: string, ...args: unknown[]): void;
	warn(message: string, ...args: unknown[]): void;
	error(message: string, exeception?: Exception): void;
	logStackTrace(exeception: Exception): void;
}

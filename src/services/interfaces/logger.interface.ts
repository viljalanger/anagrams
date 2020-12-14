import { Exception } from '@anagrams/models';

export interface ILoggerService {
	silly(message: string): void;
	trace(message: string): void;
	debug(message: string, ...args: unknown[]): void;
	info(message: string): void;
	warn(message: string): void;
	error(message: string, exeception?: Exception): void;
	logStackTrace(exeception: Exception): void;
}

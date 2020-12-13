/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, injectable } from 'inversify';
import prompts, { Answers } from 'prompts';

import { ILoggerService } from '../logger/logger.service';

export interface IInteractionService {
	say(message: string): void;
	ask(questions: any): Promise<Answers<any>>;
	ask(questions: any[]): Promise<Answers<any>>;
}

@injectable()
export class InteractionService implements IInteractionService {
	@inject('LoggerService') private readonly loggerService!: ILoggerService;

	say(message: string): void {
		this.loggerService.info(message);
	}

	async ask(questions: any): Promise<Answers<any>>;
	async ask(questions: any[]): Promise<Answers<any>> {
		return await prompts(questions);
	}
}

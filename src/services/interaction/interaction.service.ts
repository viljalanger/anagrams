/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, injectable } from 'inversify';
import prompts, { Answers } from 'prompts';

import { Exception } from '@anagrams/models';

import { ILoggerServiceKey } from '../injector/type-keys';
import { IInteractionService } from '../interfaces/interaction.interface';
import { ILoggerService } from '../interfaces/logger.interface';

@injectable()
export class InteractionService implements IInteractionService {
	@inject(ILoggerServiceKey) private readonly loggerService!: ILoggerService;

	say(message: string): void {
		this.loggerService.info(message);
	}

	async ask(questions: any): Promise<Answers<any>>;
	async ask(questions: any[]): Promise<Answers<any>> {
		try {
			return await prompts(questions);
		} catch (errorObj) {
			this.loggerService.fatal(errorObj);

			throw new Exception('An error occured while reading user answers');
		}
	}
}

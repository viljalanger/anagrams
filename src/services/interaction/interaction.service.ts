import { inject, injectable } from 'inversify';
import prompts, { Answers } from 'prompts';

import { Exception, Question } from '@anagrams/models';
import { ILoggerServiceKey } from '@anagrams/injector';

import { IInteractionService } from '../interfaces/interaction.interface';
import { ILoggerService } from '../interfaces/logger.interface';

@injectable()
export class InteractionService implements IInteractionService {
	@inject(ILoggerServiceKey) private readonly loggerService!: ILoggerService;

	say(message: string): void {
		this.loggerService.info(message);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async ask(...args: Question[]): Promise<Answers<any>> {
		try {
			return await prompts(args);
		} catch (exeception) {
			this.loggerService.fatal(exeception);

			throw new Exception('An error occured while reading user answers');
		}
	}
}

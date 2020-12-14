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
			this.loggerService.debug('About to ask questions', args);
			const answers = await prompts(args);
			this.loggerService.debug('User answers', answers);

			return answers;
		} catch (exeception) {
			this.loggerService.logStackTrace(exeception);

			throw new Exception('An error occured while reading user answers');
		}
	}
}

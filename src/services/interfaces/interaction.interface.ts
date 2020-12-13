import { Answers } from 'prompts';

import { Question } from '@anagrams/models';

export interface IInteractionService {
	say(message: string): void;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ask(...args: Question[]): Promise<Answers<any>>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Answers } from 'prompts';

export interface IInteractionService {
    say(message: string): void;
    
	ask(questions: any): Promise<Answers<any>>;
	ask(questions: any[]): Promise<Answers<any>>;
}

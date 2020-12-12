import { injectable } from 'inversify';
import prompts, { Answers } from 'prompts';

export interface IInteractionService {
	say(message: string): void;
	ask(questions: any): Promise<Answers<any>>;
	ask(questions: any[]): Promise<Answers<any>>;
}

@injectable()
export class InteractionService implements IInteractionService {
	say(message: string): void {
		console.log(message);
	}

	async ask(questions: any): Promise<Answers<any>>;
	async ask(questions: any[]): Promise<Answers<any>> {
		return await prompts(questions);
	}
}

import prompts from 'prompts';

import { InjectorService } from '../injector/injector.service';
import { IInteractionService } from './interaction.service';

jest.mock('prompts');

describe('InteractionService', () => {
	let sut: IInteractionService;
	const wrapper = { prompts };
	const logSpy = jest.spyOn(console, 'log');

	const container = InjectorService.getContainer();

	beforeEach(() => {
		sut = container.get<IInteractionService>('InteractionService');
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	describe('say', () => {
		it('should call console.log with expected parameter', async () => {
			const message = 'I am the message';

			await sut.say(message);

			expect(console.log).toHaveBeenCalledWith(message);
		});
	});

	describe('ask', () => {
		it('should call prompts with expected question object', async () => {
			const question = { type: 'text', name: 'name', message: 'What is your name?' };

			await sut.ask(question);

			expect(prompts).toBeCalledWith(question);
		});

		it('should call prompts with expected questions array', async () => {
			const questions = [
				{ type: 'text', name: 'name', message: 'What is your name?' },
				{ type: 'text', name: 'surname', message: 'What is your surname?' },
			];

			await sut.ask(questions);

			expect(prompts).toBeCalledWith(questions);
		});
	});

	afterEach(() => {
		logSpy.mockReset();
	});
});

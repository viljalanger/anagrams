jest.mock('prompts');

import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import prompts from 'prompts';

import { Question } from '@anagrams/models';
import { IInteractionServiceKey, ILoggerServiceKey, Injector } from '@anagrams/injector';

import { IInteractionService } from '../interfaces/interaction.interface';
import { ILoggerService } from '../interfaces/logger.interface';

describe('InteractionService', () => {
	let sut: IInteractionService;
	let loggerServiceMock: MockProxy<ILoggerService>;

	const container = Injector.getContainer();

	beforeEach(() => {
		loggerServiceMock = mock<ILoggerService>();

		container.rebind<ILoggerService>(ILoggerServiceKey).toConstantValue(loggerServiceMock);

		sut = container.get<IInteractionService>(IInteractionServiceKey);
	});

	afterEach(() => {
		mockReset(loggerServiceMock);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	describe('say', () => {
		it('should call logger with expected parameter', async () => {
			const message = 'I am the message';

			await sut.say(message);

			expect(loggerServiceMock.info).toHaveBeenCalledWith(message);
		});
	});

	describe('ask', () => {
		it('should log question call prompts with expected question object', async () => {
			const question: Question = { type: 'text', name: 'name', message: 'What is your name?' };

			await sut.ask(question);

			expect(loggerServiceMock.silly).toHaveBeenCalledWith('About to ask questions', [question]);
			expect(prompts).toHaveBeenCalledWith([question]);
		});

		it('should log questions call prompts with expected questions array', async () => {
			const questions: Question[] = [
				{ type: 'text', name: 'name', message: 'What is your name?' },
				{ type: 'text', name: 'surname', message: 'What is your surname?' },
			];

			await sut.ask(...questions);

			expect(loggerServiceMock.silly).toHaveBeenCalledWith('About to ask questions', [...questions]);
			expect(prompts).toHaveBeenCalledWith(questions);
		});
	});
});

import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import prompts from 'prompts';

import { InjectorService } from '../injector/injector.service';
import { ILoggerService } from '../logger/logger.service';
import { IInteractionService } from './interaction.service';

jest.mock('prompts');

describe('InteractionService', () => {
	let sut: IInteractionService;
	let loggerServiceMock: MockProxy<ILoggerService>;

	const container = InjectorService.getContainer();

	beforeEach(() => {
		loggerServiceMock = mock<ILoggerService>();

		container.rebind<ILoggerService>('LoggerService').toConstantValue(loggerServiceMock);

		sut = container.get<IInteractionService>('InteractionService');
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
});

import 'reflect-metadata';
import { mock, mockReset, MockProxy } from 'jest-mock-extended';

import { IAnagramsProgramService } from './anagrams-program.service';
import { IInteractionService } from '../interaction/interaction.service';
import { IDictionaryService } from '../dictionary/dictionary.service';
import { InjectorService } from '../injector/injector.service';
import { initQuestions } from './program-questions';

describe('AnagramsProgramService', () => {
	let sut: IAnagramsProgramService;
	let interactionServiceMock: MockProxy<IInteractionService>;
	let dictionaryServiceMock: MockProxy<IDictionaryService>;

	const container = InjectorService.getContainer();

	beforeEach(() => {
		interactionServiceMock = mock<IInteractionService>();
		dictionaryServiceMock = mock<IDictionaryService>();

		container
			.rebind<IInteractionService>('InteractionService')
			.toConstantValue(interactionServiceMock);
		container
			.rebind<IDictionaryService>('DictionaryService')
			.toConstantValue(dictionaryServiceMock);

		sut = container.get<IAnagramsProgramService>('AnagramsProgramService');
	});

	describe('init', () => {
		it('should call dictionary.read with expected parameter', async () => {
			const filePath = 'file/path.txt';
			const initAnswers = { caseSensitive: true, matchAllChars: true };
			interactionServiceMock.ask.calledWith(initQuestions).mockResolvedValue(initAnswers);

			await sut.init(filePath);

			expect(dictionaryServiceMock.read).toHaveBeenCalledWith(filePath);
		});

		it('should set searchOptions from init answers as expected', async () => {
			const filePath = 'file/path.txt';
			const initAnswers = { caseSensitive: false, matchAllChars: true };
			interactionServiceMock.ask.calledWith(initQuestions).mockResolvedValue(initAnswers);

			await sut.init(filePath);

			expect(sut.searchOptions).toEqual(initAnswers);
		});
	});

	afterEach(() => {
		mockReset(interactionServiceMock);
		mockReset(dictionaryServiceMock);
	});
});

import 'reflect-metadata';
import { mock, mockReset, MockProxy } from 'jest-mock-extended';

import { formatResults } from '@anagrams/utils';
import { InvalidInputException, Question } from '@anagrams/models';

import {
	IAnagramsProgramServiceKey,
	IDictionaryServiceKey,
	IInteractionServiceKey,
	Injector,
} from '@anagrams/injector';

import {
	askForTermQuestion,
	initQuestions,
	newSearchQuestion,
	closingCommand,
	invalidTermCommand,
	matchNotFoundCommand,
} from './program-prompts';

import { IAnagramsProgramService } from '../interfaces/anagrams-program.interface';
import { IDictionaryService } from '../interfaces/dictionary.interface';
import { IInteractionService } from '../interfaces/interaction.interface';

describe('AnagramsProgramService', () => {
	let sut: IAnagramsProgramService;
	let interactionServiceMock: MockProxy<IInteractionService>;
	let dictionaryServiceMock: MockProxy<IDictionaryService>;

	const container = Injector.getContainer();

	beforeEach(() => {
		interactionServiceMock = mock<IInteractionService>();
		dictionaryServiceMock = mock<IDictionaryService>();

		container.rebind<IInteractionService>(IInteractionServiceKey).toConstantValue(interactionServiceMock);
		container.rebind<IDictionaryService>(IDictionaryServiceKey).toConstantValue(dictionaryServiceMock);

		sut = container.get<IAnagramsProgramService>(IAnagramsProgramServiceKey);
	});

	afterEach(() => {
		mockReset(interactionServiceMock);
		mockReset(dictionaryServiceMock);
	});

	describe('init', () => {
		it('should call dictionary.read with expected parameter', async () => {
			const filePath = 'file/path.txt';
			const initAnswers = { caseSensitive: true, matchAllChars: true };
			interactionServiceMock.ask.calledWith(...initQuestions).mockResolvedValue(initAnswers);

			await sut.init(filePath);

			expect(dictionaryServiceMock.read).toHaveBeenCalledWith(filePath);
		});

		it('should set searchOptions from init answers as expected', async () => {
			const filePath = 'file/path.txt';
			const initAnswers = { caseSensitive: false, matchAllChars: true };
			interactionServiceMock.ask.calledWith(...initQuestions).mockResolvedValue(initAnswers);

			await sut.init(filePath);

			expect(sut.searchOptions).toEqual(initAnswers);
		});
	});

	describe('run', () => {
		it('should print invalid term command and throw invalid input exception when input term is invalid', async () => {
			const invalidTermAnswer = {};
			const expectedException = new InvalidInputException('Entered input is invalid: [undefined]');

			interactionServiceMock.ask.calledWith(askForTermQuestion).mockResolvedValue(invalidTermAnswer);

			await expect(sut.run()).rejects.toThrowError(expectedException);
			expect(interactionServiceMock.say).toHaveBeenCalledWith(invalidTermCommand);
		});

		it('should not print invalid term command when inout term is defined', async () => {
			const termAnswer = { term: 'Exit' };
			const newSearchAnswer = { doNewSearch: false };

			interactionServiceMock.ask.calledWith(askForTermQuestion as Question).mockResolvedValue(termAnswer);
			interactionServiceMock.ask.calledWith(newSearchQuestion as Question).mockResolvedValue(newSearchAnswer);

			await sut.run();

			expect(interactionServiceMock.say).not.toHaveBeenCalledWith(invalidTermCommand);
		});

		it('should read search term and pass it to dictionary.search as expected ', async () => {
			const termAnswer = { term: 'abc' };
			const newSearchAnswer = { doNewSearch: false };

			interactionServiceMock.ask.calledWith(askForTermQuestion as Question).mockResolvedValue(termAnswer);
			interactionServiceMock.ask.calledWith(newSearchQuestion as Question).mockResolvedValue(newSearchAnswer);

			await sut.run();

			expect(dictionaryServiceMock.search).toHaveBeenCalledWith(termAnswer.term, sut.searchOptions);
		});

		it('should print results as expected when matches are found', async () => {
			const searchResults = ['abc', 'abc'];
			const termAnswer = { term: 'abc' };
			const newSearchAnswer = { doNewSearch: false };
			const searchOptions = sut.searchOptions;
			const expectedResultsCommand = formatResults(searchResults);

			interactionServiceMock.ask.calledWith(askForTermQuestion).mockResolvedValue(termAnswer);
			interactionServiceMock.ask.calledWith(newSearchQuestion).mockResolvedValue(newSearchAnswer);

			dictionaryServiceMock.search
				.calledWith(termAnswer.term, searchOptions)
				.mockResolvedValue(searchResults);

			await sut.run();

			expect(interactionServiceMock.say).toHaveBeenCalledWith(expectedResultsCommand);
		});

		it('should display match not found message when dictionary.search does not return items', async () => {
			const searchResults: string[] = [];
			const termAnswer = { term: 'abc' };
			const newSearchAnswer = { doNewSearch: false };
			const searchOptions = sut.searchOptions;

			interactionServiceMock.ask.calledWith(askForTermQuestion as Question).mockResolvedValue(termAnswer);
			interactionServiceMock.ask.calledWith(newSearchQuestion as Question).mockResolvedValue(newSearchAnswer);

			dictionaryServiceMock.search
				.calledWith(termAnswer.term, searchOptions)
				.mockResolvedValue(searchResults);

			await sut.run();

			expect(interactionServiceMock.say).toHaveBeenCalledWith(matchNotFoundCommand);
		});

		it('should handle quit command correctly and display closing command as expected', async () => {
			const searchResults: string[] = [];
			const termAnswer = { term: 'abc' };
			const newSearchAnswer = { doNewSearch: false };

			interactionServiceMock.ask.calledWith(askForTermQuestion as Question).mockResolvedValue(termAnswer);
			interactionServiceMock.ask.calledWith(newSearchQuestion as Question).mockResolvedValue(newSearchAnswer);

			dictionaryServiceMock.search
				.calledWith(termAnswer.term, sut.searchOptions)
				.mockResolvedValue(searchResults);

			await sut.run();

			expect(sut.continue).toEqual(newSearchAnswer.doNewSearch);
			expect(interactionServiceMock.say).lastCalledWith(closingCommand);
		});

		it('should use the cache instead of searching for the term when it has been already searched ', async () => {
			const searchResults = ['Cab', 'aBc', 'CbA'];
			const termAnswer = { term: 'a' };
			const newSearchAnswerYes = { doNewSearch: true };
			const newSearchAnswerNo = { doNewSearch: false };
			const searchOptions = sut.searchOptions;

			interactionServiceMock.ask.calledWith(askForTermQuestion).mockResolvedValue(termAnswer);
			interactionServiceMock.ask
				.calledWith(newSearchQuestion)
				.mockResolvedValue(newSearchAnswerNo)
				.mockResolvedValueOnce(newSearchAnswerYes);

			dictionaryServiceMock.search
				.calledWith(termAnswer.term, searchOptions)
				.mockResolvedValue(searchResults);

			await sut.run();

			expect(dictionaryServiceMock.search).toHaveReturnedTimes(1);
			expect(interactionServiceMock.say).toHaveBeenCalledWith(
				`Number of found entries: ${searchResults.length}, cached results`,
			);
		});
	});
});

import { Question } from '@anagrams/models';

const askForTermQuestion: Question = {
	type: 'text',
	name: 'term',
	message: 'What are you looking for?',
};

const initQuestions: Question[] = [
	{
		type: 'select',
		name: 'caseSensitive',
		message: 'Do you want to have case sensitive results?',
		choices: [
			{ title: 'Yes', description: 'Results will be case sensitive.', value: true },
			{ title: 'No', description: 'Results will not be case sensitive.', value: false },
		],
	},
	{
		type: 'select',
		name: 'matchAllChars',
		message: 'Do you only want results that match all chars?',
		choices: [
			{ title: 'Yes', description: 'Results will match with all chars.', value: true },
			{ title: 'No', description: 'Results could be partial matches.', value: false },
		],
	},
];

const newSearchQuestion: Question = {
	type: 'select',
	name: 'doNewSearch',
	message: 'Do you want to do another search?',
	choices: [
		{ title: 'Yes', description: 'Do another search.', value: true },
		{ title: 'No', description: 'Close the program.', value: false },
	],
};

export { askForTermQuestion, initQuestions, newSearchQuestion };

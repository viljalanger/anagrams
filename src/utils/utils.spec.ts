import { formatResults, sortText } from './utils';

describe('utils', () => {
	describe('sortText', () => {
		it('should sort string as expecteed', () => {
			const text = 'fedcba';
			const expectedText = 'abcdef';

			const sortedText = sortText(text);

			expect(sortedText).toEqual(expectedText);
		});
	});

	describe('formatResults', () => {
		it('should formar results as expected', () => {
			const matches = ['abc', 'def'];
			const expectedText = `This is what I found: ${matches.join(', ')}`;

			const resultText = formatResults(matches);

			expect(resultText).toEqual(expectedText);
		});
	});
});

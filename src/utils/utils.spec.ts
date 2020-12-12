import { sortText } from './utils';

describe('utils', () => {
	describe('sortText', () => {
		it('should sort string as expecteed', () => {
			const text = 'fedcba';
			const expectedText = 'abcdef';

			const sortedText = sortText(text);

			expect(sortedText).toEqual(expectedText);
		});
	});
});

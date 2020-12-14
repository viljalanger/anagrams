import { formatPerformanceResult, formatResults, sortText } from './utils';

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
		it('should format results as expected', () => {
			const matches = ['abc', 'def'];
			const expectedText = `This is what I found: ${matches.join(', ')}`;

			const resultText = formatResults(matches);

			expect(resultText).toEqual(expectedText);
		});
	});

	describe('formatPerformanceResult', () => {
		it('should format result as expected', () => {
			const executionTime = 5;
			const executionTimeText = (executionTime / 1000).toFixed(3);
			const functionName = 'Unit Test';
			const expectedText = `PerformanceService | measure | Operation name: [${functionName}] - Execution Time: ${executionTimeText} s`;

			const resultText = formatPerformanceResult(executionTime, functionName);

			expect(resultText).toEqual(expectedText);
		});
	});
});

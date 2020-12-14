const sortText = (text: string) => {
	return text
		.split('')
		.sort((a, b) => a.localeCompare(b))
		.join('');
};

const formatResults = (matches: string[]): string => {
	return `This is what I found: ${matches.join(', ')}`;
};

const formatPerformanceResult = (executionTime: number, functionName: string): string => {
	const executionTimeText = (executionTime / 1000).toFixed(3);
	return `PerformanceService | measure | Operation name: [${functionName}] - Execution Time: ${executionTimeText} s`;
};

export { sortText, formatResults, formatPerformanceResult };

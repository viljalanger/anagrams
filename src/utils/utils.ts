const sortText = (text: string) => {
	return text
		.split('')
		.sort((a, b) => a.localeCompare(b))
		.join('');
};

const formatResults = (matches: string[]): string => {
	return `This is what I found: ${matches.join(', ')}`;
};

const formatPerformanceResult = (executionTime: number, functionName?: string): string => {
	return `Function name: [${functionName}] - Execution Time: ${executionTime}`;
};

export { sortText, formatResults, formatPerformanceResult };

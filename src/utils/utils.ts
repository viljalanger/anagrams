const sortText = (text: string) => {
	return text
		.split('')
		.sort((a, b) => a.localeCompare(b))
		.join('');
};

const formatResults = (matches: string[]): string => {
	return `This is what I found: ${matches.join(', ')}`;
};

export { sortText, formatResults };

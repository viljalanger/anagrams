const sortText = (text: string) => {
	return text
		.split('')
		.sort((a, b) => a.localeCompare(b))
		.join('');
};

export { sortText };

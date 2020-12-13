export interface Question {
	type: 'text' | 'select';
	name: string;
	message: string;
	choices?: Choice[];
}

export interface Choice {
	title: string;
	description: string;
	value: boolean;
}

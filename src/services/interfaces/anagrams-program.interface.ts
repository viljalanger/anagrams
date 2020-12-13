import { SearchOptions } from '@anagrams/models';

export interface IAnagramsProgramService {
	searchOptions: SearchOptions;
	continue: boolean;

	init(dictionaryPath: string): Promise<void>;
	run(): Promise<void>;
}

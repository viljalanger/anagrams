import { SearchOptions } from "@anagrams/models";

export interface IDictionaryService {
	dictionary: Map<string, string>;

	read(dictionaryPath: string): Promise<void>;
	search(term: string, options?: SearchOptions): Promise<string[]>;
}
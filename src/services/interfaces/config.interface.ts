import { TSLogSettings } from '@anagrams/models';

export interface IConfigService {
	isProduction(): boolean;
	getDictionaryPath(): string;
	getTSLogSettings(): TSLogSettings;
}

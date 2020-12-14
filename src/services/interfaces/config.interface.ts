import { env, TSLogSettings } from '@anagrams/models';

export interface IConfigService {
	isProduction(): boolean;
	getEnv(): env;
	getDictionaryPath(): string;
	getLogsPath(): string;
	getTSLogSettings(): TSLogSettings;
}

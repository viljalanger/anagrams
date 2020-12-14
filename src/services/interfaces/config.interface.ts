import { env, TSLogSettings, FileTransportSettings } from '@anagrams/models';

export interface IConfigService {
	isProduction(): boolean;
	getEnv(): env;
	getDictionaryPath(): string;
	getLogsPath(): string;
	getTSLogSettings(): TSLogSettings;
	getFileTransportSettings(): FileTransportSettings;
}

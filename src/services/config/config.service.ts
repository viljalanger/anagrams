import { injectable } from 'inversify';

import { environment } from '@anagrams/environment';
import { env, FileTransportSettings, TSLogSettings } from '@anagrams/models';

import { IConfigService } from '../interfaces/config.interface';

@injectable()
export class ConfigService implements IConfigService {
	private readonly environment;

	constructor() {
		this.environment = environment;
	}

	isProduction(): boolean {
		return this.environment.env === 'prod';
	}

	getEnv(): env {
		return this.environment.env as env;
	}

	getDictionaryPath(): string {
		return this.environment.dictionaryPath;
	}

	getLogsPath(): string {
		return this.environment.logger.fileTransportSettings.logsPath;
	}

	getTSLogSettings(): TSLogSettings {
		return this.environment.logger.tsLogSettings;
	}

	getFileTransportSettings(): FileTransportSettings {
		return this.environment.logger.fileTransportSettings;
	}
}

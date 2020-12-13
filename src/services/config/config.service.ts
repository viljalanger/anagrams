import { injectable } from 'inversify';

import { environment } from '@anagrams/environment';
import { TSLogSettings } from '@anagrams/models';

export interface IConfigService {
	isProduction(): boolean;
	getDictionaryPath(): string;
	getTSLogSettings(): TSLogSettings;
}

@injectable()
export class ConfigService implements IConfigService {
	private readonly environment;

	constructor() {
		this.environment = environment;
	}

	isProduction(): boolean {
		return this.environment.production;
	}

	getDictionaryPath(): string {
		return this.environment.dictionaryPath;
	}

	getTSLogSettings(): TSLogSettings {
		return this.environment.logger.tsLogSettings;
	}
}

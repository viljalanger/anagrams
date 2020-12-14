import { environment } from '@anagrams/environment';

import { Injector, IConfigServiceKey } from '@anagrams/injector';

import { IConfigService } from '../interfaces/config.interface';

describe('ConfigService', () => {
	let sut: IConfigService;

	const container = Injector.getContainer();

	beforeEach(() => {
		sut = container.get<IConfigService>(IConfigServiceKey);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should return correct environment properties', () => {
		const { env, dictionaryPath, logger } = environment;
		const { tsLogSettings, fileTransportSettings } = logger;

		expect(sut.isProduction()).toEqual(env === 'prod');
		expect(sut.getDictionaryPath()).toEqual(dictionaryPath);
		expect(sut.getTSLogSettings()).toEqual(tsLogSettings);
		expect(sut.getLogsPath()).toEqual(fileTransportSettings.logsPath);
	});
});

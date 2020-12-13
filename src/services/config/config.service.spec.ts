import { environment } from '@anagrams/environment';

import { InjectorService } from '../injector/injector.service';
import { IConfigServiceKey } from '../injector/type-keys';
import { IConfigService } from './config.service';

describe('ConfigService', () => {
	let sut: IConfigService;

	const container = InjectorService.getContainer();

	beforeEach(() => {
		sut = container.get<IConfigService>(IConfigServiceKey);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should return correct environment properties', () => {
		const { production, dictionaryPath, logger } = environment;

		expect(sut.isProduction()).toEqual(production);
		expect(sut.getDictionaryPath()).toEqual(dictionaryPath);
		expect(sut.getTSLogSettings()).toEqual(logger.tsLogSettings);
	});
});

import { Logger } from 'tslog';

import { IConfigServiceKey, Injector } from '@anagrams/injector';
import { IConfigService } from '@anagrams/services';

import { LoggerFactory } from './logger.factory';

describe('LoggerFactory', () => {
	let sut: Logger;

	const container = Injector.getContainer();
	const configService = container.get<IConfigService>(IConfigServiceKey);

	beforeEach(() => {
		sut = LoggerFactory.createLogger(configService);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});
});

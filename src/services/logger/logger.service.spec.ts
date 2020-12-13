import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Logger } from 'tslog';

import { InjectorService } from '../injector/injector.service';
import { ILoggerServiceKey } from '../injector/type-keys';
import { ILoggerService } from './logger.service';

describe('LoggerService', () => {
	let sut: ILoggerService;
	let loggerMock: MockProxy<Logger>;

	const container = InjectorService.getContainer();

	beforeEach(() => {
		loggerMock = mock<Logger>();

		container.rebind('Logger').toConstantValue(loggerMock);

		sut = container.get<ILoggerService>(ILoggerServiceKey);
	});

	afterEach(() => {
		mockReset(loggerMock);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});
});

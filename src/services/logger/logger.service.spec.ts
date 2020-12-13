import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Logger } from 'tslog';

import { Exception } from '@anagrams/models';

import { InjectorService } from '../injector/injector.service';
import { IConfigServiceKey, ILoggerServiceKey, LoggerKey } from '../injector/type-keys';
import { ILoggerService } from '../interfaces/logger.interface';
import { IConfigService } from '../interfaces/config.interface';

describe('LoggerService', () => {
	let sut: ILoggerService;
	let loggerMock: MockProxy<Logger>;
	let configServiceMock: MockProxy<IConfigService>;

	const container = InjectorService.getContainer();

	beforeEach(() => {
		loggerMock = mock<Logger>();
		configServiceMock = mock<IConfigService>();

		container.rebind(LoggerKey).toConstantValue(loggerMock);
		container.rebind(IConfigServiceKey).toConstantValue(configServiceMock);

		sut = container.get<ILoggerService>(ILoggerServiceKey);
	});

	afterEach(() => {
		mockReset(loggerMock);
		mockReset(configServiceMock);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	describe('silly, trace, debug, info, warn, error', () => {
		it('should respective logger function with expected parameters', () => {
			const sillyMessage = 'I am the silly log message';
			const traceMessage = 'I am the trace log message';
			const debugMessage = 'I am the debug log message';
			const infoMessage = 'I am the info log message';
			const warnMessage = 'I am the warn log message';
			const errorMessage = 'I am the error log message';
			const errorException = new Exception('I am the error exception');

			sut.silly(sillyMessage);
			sut.trace(traceMessage);
			sut.debug(debugMessage);
			sut.info(infoMessage);
			sut.warn(warnMessage);
			sut.error(errorMessage, errorException);

			expect(loggerMock.silly).toHaveBeenCalledTimes(1);
			expect(loggerMock.silly).toHaveBeenCalledWith(sillyMessage);

			expect(loggerMock.trace).toHaveBeenCalledTimes(1);
			expect(loggerMock.trace).toHaveBeenCalledWith(traceMessage);

			expect(loggerMock.debug).toHaveBeenCalledTimes(1);
			expect(loggerMock.debug).toHaveBeenCalledWith(debugMessage);

			expect(loggerMock.info).toHaveBeenCalledTimes(1);
			expect(loggerMock.info).toHaveBeenCalledWith(infoMessage);

			expect(loggerMock.warn).toHaveBeenCalledTimes(1);
			expect(loggerMock.warn).toHaveBeenCalledWith(warnMessage);

			expect(loggerMock.error).toHaveBeenCalledTimes(1);
			expect(loggerMock.error).toHaveBeenCalledWith(errorMessage, errorException.message);
		});
	});

	describe('fatal', () => {
		it('should call logger.fatal with expected object when environment is not production', () => {
			const fatalException = new Exception('I am the fatal message');
			configServiceMock.isProduction.mockReturnValue(false);

			sut.fatal(fatalException);

			expect(loggerMock.fatal).toHaveBeenCalledWith(fatalException);
		});

		it('should not call logger.fatal when environment is production', () => {
			const fatalException = new Exception('I am the fatal exception');
			configServiceMock.isProduction.mockReturnValue(true);

			sut.fatal(fatalException);

			expect(loggerMock.fatal).not.toHaveBeenCalled();
		});
	});
});

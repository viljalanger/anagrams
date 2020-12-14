import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Logger } from 'tslog';

import { Exception } from '@anagrams/models';
import { ILoggerServiceKey, LoggerKey, Injector } from '@anagrams/injector';

import { ILoggerService } from '../interfaces/logger.interface';

describe('LoggerService', () => {
	let sut: ILoggerService;
	let loggerMock: MockProxy<Logger>;

	const container = Injector.getContainer();

	beforeEach(() => {
		loggerMock = mock<Logger>();

		container.rebind(LoggerKey).toConstantValue(loggerMock);

		sut = container.get<ILoggerService>(ILoggerServiceKey);
	});

	afterEach(() => {
		mockReset(loggerMock);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	describe('silly, trace, debug, info, warn', () => {
		it('should respective logger function with expected parameters', () => {
			const sillyMessage = 'I am the silly log message';
			const traceMessage = 'I am the trace log message';
			const debugMessage = 'I am the debug log message';
			const infoMessage = 'I am the info log message';
			const warnMessage = 'I am the warn log message';

			const sillyArgs = 'I am the silly args log message';
			const traceArgs = 'I am the trace args log message';
			const debugArgs = 'I am the debug args log message';
			const infoArgs = 'I am the info args log message';
			const warnArgs = 'I am the warn args log message';

			const exception = new Exception('I am the fatal exception');

			sut.silly(sillyMessage, sillyArgs);
			sut.trace(traceMessage, traceArgs);
			sut.debug(debugMessage, debugArgs);
			sut.info(infoMessage, infoArgs);
			sut.warn(warnMessage, warnArgs);
			sut.logStackTrace(exception);

			expect(loggerMock.silly).toHaveBeenCalledTimes(1);
			expect(loggerMock.silly).toHaveBeenCalledWith(sillyMessage, [sillyArgs]);

			expect(loggerMock.trace).toHaveBeenCalledTimes(1);
			expect(loggerMock.trace).toHaveBeenCalledWith(traceMessage, [traceArgs]);

			expect(loggerMock.debug).toHaveBeenCalledTimes(2);
			expect(loggerMock.debug).toHaveBeenNthCalledWith(1, debugMessage, [debugArgs]);

			expect(loggerMock.info).toHaveBeenCalledTimes(1);
			expect(loggerMock.info).toHaveBeenCalledWith(infoMessage, [infoArgs]);

			expect(loggerMock.warn).toHaveBeenCalledTimes(1);
			expect(loggerMock.warn).toHaveBeenCalledWith(warnMessage, [warnArgs]);

			expect(loggerMock.debug).toHaveBeenCalledTimes(2);
			expect(loggerMock.debug).toHaveBeenNthCalledWith(2, exception);
		});
	});

	describe('error', () => {
		it('should call logger.error with expected error and exception message when exception is defined', () => {
			const errorMessage = 'I am the error message';
			const exceptionMessage = 'I am the exception message';
			const exception = new Exception(exceptionMessage);

			sut.error(errorMessage, exception);

			expect(loggerMock.error).toHaveBeenCalledWith(errorMessage, exceptionMessage);
		});

		it('should call logger.error with expected error message and empty string and not call logger.debug when exception is not defined', () => {
			const errorMessage = 'I am the error message';

			sut.error(errorMessage);

			expect(loggerMock.error).toHaveBeenCalledWith(errorMessage, '');
			expect(loggerMock.debug).not.toHaveBeenCalled();
		});
	});
});

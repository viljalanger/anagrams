/* eslint-disable @typescript-eslint/no-explicit-any */

import { performance } from 'perf_hooks';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';

import { InjectorService } from '../injector/injector.service';
import { ILoggerServiceKey, IPerformanceServiceKey } from '../injector/type-keys';
import { ILoggerService } from '../logger/logger.service';
import { IPerformanceService } from './performance.service';
import { formatPerformanceResult } from 'src/utils/utils';

describe('PerformanceService', () => {
	let sut: IPerformanceService;
	let loggerServiceMock: MockProxy<ILoggerService>;
	const nowSpy = jest.spyOn(performance, 'now');

	const container = InjectorService.getContainer();

	beforeEach(() => {
		loggerServiceMock = mock<ILoggerService>();

		container.rebind<ILoggerService>(ILoggerServiceKey).toConstantValue(loggerServiceMock);

		sut = container.get<IPerformanceService>(IPerformanceServiceKey);
	});

	afterEach(() => {
		mockReset(loggerServiceMock);

		nowSpy.mockReset();
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	describe('measure', () => {
		it('should log with debug correct given time', async () => {
			const functionName = 'Unit test';
			const functionToMeasure = async (): Promise<any> => {
				setTimeout(() => console.log('Test'), 3000);
			};
			nowSpy.mockReturnValue(5);
			const expectedText = formatPerformanceResult(0, functionName);

			await sut.measure(functionToMeasure, functionName);

			expect(loggerServiceMock.debug).toBeCalledWith(expectedText);
		});

		it('should return result from function passed as parameter as expected', async () => {
			const expectedResult = 'I am the function result';
			const functionToMeasure = async (): Promise<any> => {
				return new Promise((resolve) => {
					setTimeout(async (): Promise<any> => {
						resolve(expectedResult);
					}, 500);
				});
			};
			nowSpy.mockReturnValue(5);

			const result = await sut.measure(functionToMeasure);

			expect(result).toEqual(expectedResult);
		});
	});
});

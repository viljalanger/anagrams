import { performance } from 'perf_hooks';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';

import { formatPerformanceResult } from '@anagrams/utils';

import { InjectorService } from '../injector/injector.service';
import { ILoggerServiceKey, IPerformanceServiceKey } from '../injector/type-keys';
import { ILoggerService } from '../interfaces/logger.interface';
import { IPerformanceService } from '../interfaces/performance.interface';

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
			const runMe = async (): Promise<void> => {
				setTimeout(() => console.log('Test'), 3000);
			};
			nowSpy.mockReturnValue(5);
			const expectedText = formatPerformanceResult(0, functionName);

			await sut.measure(runMe, functionName);

			expect(loggerServiceMock.debug).toHaveBeenCalledWith(expectedText);
		});

		it('should return result from function passed as parameter as expected', async () => {
			const expectedResult = 'I am the function result';
			const runMe = async (): Promise<string> => {
				return new Promise((resolve) => {
					setTimeout(() => resolve(expectedResult), 500);
				});
			};

			nowSpy.mockReturnValue(5);

			const result = await sut.measure(runMe);

			expect(result).toEqual(expectedResult);
		});
	});
});

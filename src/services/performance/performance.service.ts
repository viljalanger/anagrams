/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { Performance } from 'perf_hooks';
import { inject, injectable } from 'inversify';

import { formatPerformanceResult } from '@anagrams/utils';

import { ILoggerServiceKey, performanceKey } from '../injector/type-keys';
import { IPerformanceService } from '../interfaces/performance.interface';
import { ILoggerService } from '../interfaces/logger.interface';

@injectable()
export class PerformanceService implements IPerformanceService {
	@inject(ILoggerServiceKey) private readonly loggerService!: ILoggerService;
	@inject(performanceKey) private readonly performance!: Performance;

	async measure(functionToMeasure: () => Promise<any>, functionName?: string): Promise<any> {
		const startTime = this.performance.now();
		const result = await functionToMeasure();
		const endTime = this.performance.now();

		const executionTime = endTime - startTime;
		const performanceMessage = formatPerformanceResult(executionTime, functionName ?? functionToMeasure.name);
		this.loggerService.debug(performanceMessage);

		return result;
	}
}

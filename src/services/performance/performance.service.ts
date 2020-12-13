import { Performance } from 'perf_hooks';
import { inject, injectable } from 'inversify';

import { formatPerformanceResult } from '@anagrams/utils';
import { ILoggerServiceKey, performanceKey } from '@anagrams/injector';

import { IPerformanceService } from '../interfaces/performance.interface';
import { ILoggerService } from '../interfaces/logger.interface';

@injectable()
export class PerformanceService implements IPerformanceService {
	@inject(ILoggerServiceKey) private readonly loggerService!: ILoggerService;
	@inject(performanceKey) private readonly performance!: Performance;

	async measure<T>(runMe: () => Promise<T>, functionName?: string): Promise<T> {
		const startTime = this.performance.now();
		const result = await runMe();
		const endTime = this.performance.now();

		const executionTime = endTime - startTime;
		const performanceMessage = formatPerformanceResult(executionTime, functionName ?? runMe.name);
		this.loggerService.debug(performanceMessage);

		return result;
	}
}

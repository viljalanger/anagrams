import { inject, injectable } from 'inversify';

import { formatPerformanceResult } from '@anagrams/utils';

import { ILoggerServiceKey, performanceKey } from '../injector/type-keys';
import { ILoggerService } from '../logger/logger.service';

export interface IPerformanceService {
	measure(functionToMeasure: () => any, functionName?: string): void;
}

@injectable()
export class PerformanceService {
	@inject(ILoggerServiceKey) private readonly loggerService!: ILoggerService;
	@inject(performanceKey) private readonly performance!: Performance;

	measure(functionToMeasure: () => any, functionName?: string): void {
		const startTime = this.performance.now();
		functionToMeasure();
		const endTime = this.performance.now();

		const executionTime = endTime - startTime;
		this.loggerService.debug(formatPerformanceResult(executionTime, functionName));
	}
}

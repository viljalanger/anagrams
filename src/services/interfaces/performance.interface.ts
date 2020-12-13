/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IPerformanceService {
	measure(functionToMeasure: () => Promise<any>, functionName?: string): Promise<any>;
}

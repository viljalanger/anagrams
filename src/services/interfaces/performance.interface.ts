export interface IPerformanceService {
	measure<T>(runMe: () => Promise<T>, functionName?: string): Promise<T>;
}

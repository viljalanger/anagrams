export interface Config {
	production: boolean;
	dictionaryPath: string;
	loggerConfing: LoggerConfig;
}

export interface LoggerConfig {
	logsPath: string;
	maxLogFileSize: number;
	maxLogFileAge: number;
	tsLogSettings: TSLogSettings;
}

export interface TSLogSettings {
	displayDateTime: boolean;
	displayFunctionName: boolean;
	displayInstanceName: boolean;
	displayLoggerName: boolean;
	displayRequestId: boolean;
	displayTypes: boolean;
}

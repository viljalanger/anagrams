export interface Config {
	env: 'dev' | 'staging' | 'prod';
	dictionaryPath: string;
	loggerConfing: LoggerConfig;
}

export interface LoggerConfig {
	fileTransportSettings: FileTransportSettings;
	tsLogSettings: TSLogSettings;
}

export interface FileTransportSettings {
	logsPath: string;
	maxMBLogFileSize: number;
	maxDaysLogFileAge: number;
}

export interface TSLogSettings {
	displayDateTime: boolean;
	displayFunctionName: boolean;
	displayInstanceName: boolean;
	displayLoggerName: boolean;
	displayRequestId: boolean;
	displayTypes: boolean;
}

export type env = 'dev' | 'staging' | 'prod';

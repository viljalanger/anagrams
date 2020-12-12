export const environment = {
	production: true,
	dictionaryPath: 'assets/wordlist.txt',
	logger: {
		logsPath: 'LOGS',
		maxLogFileSize: 5120,
		maxLogFileAge: 3,
		minLog: 0,
		tslogSettings: {
			displayDateTime: false,
			displayFunctionName: false,
			displayInstanceName: false,
			displayLogLevel: false,
			displayLoggerName: false,
			displayRequestId: false,
			displayTypes: false,
		},
	},
};

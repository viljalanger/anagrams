export const environment = {
	production: false,
	dictionaryPath: 'assets/short-wordlist.txt',
	logger: {
		logsPath: 'dev/LOGS',
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

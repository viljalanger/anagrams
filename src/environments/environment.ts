export const environment = {
	env: 'dev',
	dictionaryPath: 'assets/short-wordlist.txt',
	logger: {
		logsPath: 'dev/LOGS',
		maxLogFileSize: 5120,
		maxLogFileAge: 3,
		tsLogSettings: {
			displayDateTime: false,
			displayFunctionName: false,
			displayInstanceName: false,
			displayLoggerName: false,
			displayRequestId: false,
			displayTypes: false,
		},
	},
};

export const environment = {
	env: 'prod',
	dictionaryPath: 'assets/wordlist.txt',
	logger: {
		fileTransportSettings: {
			logsPath: 'LOGS',
			maxMBLogFileSize: 10,
			maxLogFileAge: 3,
		},
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

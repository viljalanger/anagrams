export const environment = {
	env: 'staging',
	dictionaryPath: 'assets/wordlist.txt',
	logger: {
		fileTransportSettings: {
			logsPath: 'LOGS',
			maxLogFileSize: 5120,
			maxLogFileAge: 1,
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

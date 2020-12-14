export const environment = {
	env: 'dev',
	dictionaryPath: 'assets/short-wordlist.txt',
	logger: {
		fileTransportSettings: {
			logsPath: 'dev/LOGS',
			maxMBLogFileSize: 5,
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

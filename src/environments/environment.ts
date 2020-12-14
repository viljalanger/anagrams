export const environment = {
	env: 'dev',
	dictionaryPath: 'assets/short-wordlist.txt',
	logger: {
		fileTransportSettings: {
			logsPath: 'dev/LOGS',
			maxLogFileSize: 512,
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

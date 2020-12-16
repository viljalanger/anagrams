import 'reflect-metadata';

import { Injector, IAnagramsProgramServiceKey, ILoggerServiceKey } from '@anagrams/injector';
import { Exception } from '@anagrams/models';

import { IAnagramsProgramService, ILoggerService } from '@anagrams/services';

const container = Injector.getContainer();
const anagramsProgramService = container.get<IAnagramsProgramService>(IAnagramsProgramServiceKey);
const loggerService = container.get<ILoggerService>(ILoggerServiceKey);

process.on('uncaughtException', (exeception: Exception) => {
	loggerService.error('Ooops... Somthing went wrong...', exeception);

	process.exit(1);
});

(async () => {
	await anagramsProgramService.init();
	await anagramsProgramService.run();
})();

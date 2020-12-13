import 'reflect-metadata';

import {
	Injector,
	IAnagramsProgramServiceKey,
	IConfigServiceKey,
	ILoggerServiceKey,
} from '@anagrams/injector';

import { Exception } from '@anagrams/models';
import { IAnagramsProgramService, IConfigService, ILoggerService } from '@anagrams/services';

const container = Injector.getContainer();
const anagramsProgramService = container.get<IAnagramsProgramService>(IAnagramsProgramServiceKey);
const loggerService = container.get<ILoggerService>(ILoggerServiceKey);
const configService = container.get<IConfigService>(IConfigServiceKey);

const dictionaryPath = configService.getDictionaryPath();

process.on('uncaughtException', (exeception: Exception) => {
	loggerService.error('Ooops... Somthing went wrong...', exeception);

	process.exit(1);
});

(async () => {
	await anagramsProgramService.init(dictionaryPath);
	await anagramsProgramService.run();
})();

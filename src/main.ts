import 'reflect-metadata';

import { IAnagramsProgramServiceKey, InjectorService, IAnagramsProgramService } from '@anagrams/services';
import { environment } from '@anagrams/environment';

const dictionaryPath = environment.dictionaryPath;

const container = InjectorService.getContainer();
const anagramsProgramService = container.get<IAnagramsProgramService>(IAnagramsProgramServiceKey);

(async () => {
	await anagramsProgramService.init(dictionaryPath);
	await anagramsProgramService.run();
})();

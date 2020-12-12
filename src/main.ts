import 'reflect-metadata';

import { InjectorService } from '@anagrams/services';
import { IAnagramsProgramService } from './services/anagrams-program/anagrams-program.service';
import { environment } from './environments';

const dictionaryPath = environment.dictionaryPath;

const container = InjectorService.getContainer();
const anagramsProgramService = container.get<IAnagramsProgramService>('AnagramsProgramService');

(async () => {
	await anagramsProgramService.init(dictionaryPath);
	await anagramsProgramService.run();
})();

import { performance } from 'perf_hooks';

import 'reflect-metadata';

import { InjectorService, TYPES, IDictionaryService } from '@anagrams/services';
const short = 'assets/short-wordlist.txt';
const PATH = 'assets/wordlist.txt';
const loops = 1;

(async () => {
	const container = InjectorService.getContainer();
	const dictionaryService = container.get<IDictionaryService>('DictionaryService');
	const times: number[] = [];
	for (let index = 0; index < loops; index++) {
		const t0 = performance.now();
		const arr = await dictionaryService.read(short);
		const t1 = performance.now();
		const time = t1 - t0;
		times.push(time);
		console.log(`time: ${t1 - t0}`);
	}
	console.log(`average: ${times.reduce((a, v, i) => (a * i + v) / (i + 1))}`);
})();

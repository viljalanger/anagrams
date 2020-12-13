export interface IFilesService {
	exists(filePath: string): Promise<boolean>;
	isFile(filePath: string): Promise<boolean>;
	readAllLines(filePath: string): Promise<string[]>;
}

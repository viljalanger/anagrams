/* eslint-disable @typescript-eslint/no-explicit-any */

export class Exception extends Error {
	constructor(errorMessage: string) {
		super(errorMessage);
	}
}

export class FileNotFoundException extends Exception {
	constructor(errorMessage: any) {
		super(errorMessage);
	}
}

export class InvalidOperationException extends Exception {
	constructor(errorMessage: any) {
		super(errorMessage);
	}
}

export class InvalidInputException extends Exception {
	constructor(errorMessage: any) {
		super(errorMessage);
	}
}

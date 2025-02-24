export class Result<T> {
	public readonly isSuccess: boolean;
	public readonly isFailure: boolean;
	public readonly error?: any;
	public readonly value?: T;

	private constructor(isSuccess: boolean, error?: any, value?: T) {
		this.isSuccess = isSuccess;
		this.isFailure = !isSuccess;
		this.error = error;
		this.value = value;
	}

	public static ok<U>(value?: U): Result<U> {
		return new Result<U>(true, undefined, value);
	}

	public static fail<U>(error: any): Result<U> {
		return new Result<U>(false, error);
	}
}

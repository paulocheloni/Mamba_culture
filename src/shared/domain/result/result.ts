import type { CampaignErrorCodes } from "../errors/campaign-error-codes";

export class Result<T> {
	public readonly isSuccess: boolean;
	public readonly isFailure: boolean;
	public readonly error?: {
		code: CampaignErrorCodes;
		message: string;
	};
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

	public static fail<U = void>(error: any): Result<U> {
		return new Result<U>(false, error);
	}
}

export function isResult<T>(obj: any): obj is Result<T> {
	if (typeof obj !== "object" || obj === null) {
		return false;
	}

	if (!("isSuccess" in obj) || !("isFailure" in obj)) {
		return false;
	}

	if (
		typeof obj.isSuccess !== "boolean" ||
		typeof obj.isFailure !== "boolean"
	) {
		return false;
	}

	if (obj.isSuccess === obj.isFailure) {
		return false;
	}

	if ("error" in obj && obj.error !== undefined) {
		const error = obj.error;
		if (
			typeof error !== "object" ||
			error === null ||
			typeof error.code !== "string" ||
			typeof error.message !== "string"
		) {
			return false;
		}
	}

	return true;
}

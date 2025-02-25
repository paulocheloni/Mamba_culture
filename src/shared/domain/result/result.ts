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

	public static fail<U>(error: any): Result<U> {
		return new Result<U>(false, error);
	}
}

export function isResult<T>(obj: any): obj is Result<T> {
	if (typeof obj !== "object" || obj === null) {
		return false;
	}

	// Check required properties
	if (!("isSuccess" in obj) || !("isFailure" in obj)) {
		return false;
	}

	// Check property types
	if (
		typeof obj.isSuccess !== "boolean" ||
		typeof obj.isFailure !== "boolean"
	) {
		return false;
	}

	// Check that isSuccess and isFailure are opposites
	if (obj.isSuccess === obj.isFailure) {
		return false;
	}

	// Check error property (optional)
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

	// Value is optional and can be any type (T), so no strict check needed
	return true;
}

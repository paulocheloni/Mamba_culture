import { Result } from "./result";

describe("Result", () => {
	describe("ok", () => {
		it("should return a success result with a value", () => {
			const value = 123;
			const result = Result.ok<number>(value);
			expect(result.isSuccess).toBe(true);
			expect(result.isFailure).toBe(false);
			expect(result.value).toBe(value);
			expect(result.error).toBeUndefined();
		});

		it("should return a success result with undefined value when no value is provided", () => {
			const result = Result.ok();
			expect(result.isSuccess).toBe(true);
			expect(result.isFailure).toBe(false);
			expect(result.value).toBeUndefined();
			expect(result.error).toBeUndefined();
		});
	});

	describe("fail", () => {
		it("should return a failure result with an error", () => {
			const error = new Error("Test error");
			const result = Result.fail(error);
			expect(result.isSuccess).toBe(false);
			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(result.value).toBeUndefined();
		});
	});
});

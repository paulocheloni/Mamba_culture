import { envSchema } from "./env.schema";

describe("envSchema", () => {
	it("should validate a valid set of environment variables", () => {
		const validEnv = {
			PORT: "3000",
			NODE_ENV: "development",
			FRONTEND_URL: "http://example.com",
			DB_HOST: "localhost",
			DB_PORT: "5432",
			DB_USER: "user",
			DB_PASS: "pass",
			DB_NAME: "dbname",
			DB_URL: "postgres://user:pass@localhost:5432/dbname",
			HOST: "127.0.0.1",
		};
		const result = envSchema.safeParse(validEnv);
		expect(result.success).toBe(true);
	});

	it("should fail when required fields are missing", () => {
		const invalidEnv = {
			PORT: "3000",
			NODE_ENV: "development",
		};
		const result = envSchema.safeParse(invalidEnv);
		expect(result.success).toBe(false);
	});

	it("should fail when NODE_ENV is not a valid enum", () => {
		const invalidEnv = {
			PORT: "3000",
			NODE_ENV: "invalid",
			DB_HOST: "localhost",
			DB_PORT: "5432",
			DB_USER: "user",
			DB_PASS: "pass",
			DB_NAME: "dbname",
			DB_URL: "postgres://user:pass@localhost:5432/dbname",
			HOST: "127.0.0.1",
		};
		const result = envSchema.safeParse(invalidEnv);
		expect(result.success).toBe(false);
	});

	it("should allow FRONTEND_URL to be optional", () => {
		const validEnv = {
			PORT: "3000",
			NODE_ENV: "development",
			DB_HOST: "localhost",
			DB_PORT: "5432",
			DB_USER: "user",
			DB_PASS: "pass",
			DB_NAME: "dbname",
			DB_URL: "postgres://user:pass@localhost:5432/dbname",
			HOST: "127.0.0.1",
		};
		const result = envSchema.safeParse(validEnv);
		expect(result.success).toBe(true);
	});
});

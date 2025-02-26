import { z } from "zod";

export const envSchema = z.object({
	PORT: z.string(),
	NODE_ENV: z.enum(["development", "production", "test"]),
	FRONTEND_URL: z.string().optional(),
	DB_HOST: z.string(),
	DB_PORT: z.string(),
	DB_USER: z.string(),
	DB_PASS: z.string(),
	DB_NAME: z.string(),
	DATABASE_URL: z.string(),
	HOST: z.string(),
});

export type Env = z.infer<typeof envSchema>;

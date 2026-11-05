const fs = require("node:fs");
const path = require("node:path");

require("reflect-metadata");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
	for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		let value = trimmed.slice(eq + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		if (process.env[key] === undefined) {
			process.env[key] = value;
		}
	}
}

const defaults = {
	PORT: "3000",
	HOST: "127.0.0.1",
	NODE_ENV: "test",
	FRONTEND_URL: "http://localhost:3000",
	DB_HOST: "127.0.0.1",
	DB_PORT: "5432",
	DB_USER: "postgres",
	DB_PASS: "postgres",
	DB_NAME: "postgres",
};

for (const [key, value] of Object.entries(defaults)) {
	if (!process.env[key]) {
		process.env[key] = value;
	}
}

if (!process.env.DATABASE_URL) {
	process.env.DATABASE_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`;
}

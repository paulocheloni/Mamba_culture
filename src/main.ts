import { ConfigService } from "@nestjs/config";
import bootStrap from "./shared/infra/bootstrap";

async function main() {
	const app = await bootStrap();
	const configService = app.get(ConfigService);
	const port = configService.get("PORT");
	const host = configService.get("HOST");
	await app.listen(port, host);
}

main();

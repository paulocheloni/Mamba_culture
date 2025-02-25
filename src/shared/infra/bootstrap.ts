import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

const bootStrap = async () => {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const frontendUrl = configService.get("FRONTEND_URL");
	const nodeEnv = configService.get("NODE_ENV");
	const port = configService.get("PORT");
	const host = configService.get("HOST");
	app.enableShutdownHooks();
	app.enableCors({
		origin: nodeEnv === "production" ? frontendUrl : "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204,
		credentials: true,
	});
	await app.listen(`${port}`, `${host}`, () => {
		console.log(`Server is running on ${port}`);
	});
};

export default bootStrap;

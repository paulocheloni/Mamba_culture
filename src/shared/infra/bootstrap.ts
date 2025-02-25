import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { ResultInterceptor } from "./interceptors/result.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

const bootStrap = async () => {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const frontendUrl = configService.get("FRONTEND_URL");
	const nodeEnv = configService.get("NODE_ENV");

	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new ResultInterceptor());
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);
	app.enableShutdownHooks();
	app.enableCors({
		origin: nodeEnv === "production" ? frontendUrl : "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204,
		credentials: true,
	});
	return app;
};

export default bootStrap;

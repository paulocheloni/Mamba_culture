import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const initSwagger = (app: INestApplication): void => {
	const config = new DocumentBuilder()
		.setTitle("Campaign API")
		.setDescription("Documentation for the Campaign API")
		.setVersion("0.1.0")

		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("api", app, documentFactory);
};

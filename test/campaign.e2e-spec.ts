import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "src/shared/infra/app.module";

describe("AppController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("/campaign (POST)", () => {
		return request(app.getHttpServer()).post("/campaign").expect(200);
	});

	afterEach(async () => {
		await app.close();
	});
});

import { Test, type TestingModule } from "@nestjs/testing";
import {
	ClassSerializerInterceptor,
	ValidationPipe,
	type INestApplication,
} from "@nestjs/common";
import request from "supertest";
import { AppModule } from "src/shared/infra/app.module";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { CampaignRepository } from "src/campaign/infra/repository/campaign.repository";
import type { CreateCampaignBodyDto } from "src/campaign/presentation/REST/dto/request/create-campaign-body.dto";
import type { CampaignCategory } from "src/campaign/domain/campaign/entity/campaign.interface";
import { HttpExceptionFilter } from "src/shared/infra/filters/http-exception.filter";
import { ResultInterceptor } from "src/shared/infra/interceptors/result.interceptor";
import { Reflector } from "@nestjs/core";

describe("AppController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		process.env.NODE_ENV = "test";
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(ICampaignRepository)
			.useClass(CampaignRepository)
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalFilters(new HttpExceptionFilter());
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
			}),
		);
		app.useGlobalInterceptors(new ResultInterceptor());
		app.useGlobalInterceptors(
			new ClassSerializerInterceptor(app.get(Reflector)),
		);
		const campaignRepository =
			app.get<ICampaignRepository>(ICampaignRepository);
		await campaignRepository.reset();

		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	const createCampaign = (data: CreateCampaignBodyDto) => {
		return request(app.getHttpServer()).post("/campaign").send(data);
	};

	describe("POST /campaign", () => {
		it("should create a campaign with valid data", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			const campaignData = {
				name: "Summer Sale",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			};

			const response = await createCampaign(campaignData).expect(201);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value).toBeUndefined();
			expect(response.body.error).toBeUndefined();
		});

		it("should fail if startDate is in the past", async () => {
			const pastDate = new Date("2024-01-01");
			const futureEnd = new Date("2025-04-01");

			const campaignData = {
				name: "Past Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: pastDate,
				endDate: futureEnd,
			};

			const response = await createCampaign(campaignData).expect(400);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.code).toBe("START_DATE_BEFORE_CREATED_AT");
			expect(response.body.error.message).toBe(
				"startDate must be greater than createdAt",
			);
			expect(response.body.value).toBeUndefined();
		});

		it("should fail if endDate is before startDate", async () => {
			const futureStart = new Date("2025-03-01");
			const pastEnd = new Date("2025-02-01");

			const campaignData = {
				name: "Invalid Dates",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: pastEnd,
			};

			const response = await createCampaign(campaignData).expect(400);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.code).toBe("END_DATE_BEFORE_START_DATE");
			expect(response.body.error.message).toBe(
				"endDate must be greater than startDate",
			);
			expect(response.body.value).toBeUndefined();
		});
	});

	describe("GET /campaign", () => {
		it("should return a list of active campaigns", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			await createCampaign({
				name: "Active Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(Array.isArray(response.body.value)).toBe(true);
			expect(response.body.value.length).toBe(1);
			expect(response.body.value[0].name).toBe("Active Campaign");
			expect(response.body.value[0].category).toBe("seasonal");
			expect(response.body.value[0].status).toBe("active");
			expect(response.body.value[0].deletedAt).toBeUndefined();
			expect(response.body.error).toBeUndefined();
		});

		it("should not return deleted campaigns in the list", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			await createCampaign({
				name: "To Delete",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const responseGetAll = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const campaignId = responseGetAll.body.value[0].id;

			await request(app.getHttpServer())
				.delete(`/campaign/${campaignId}`)
				.expect(200);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(Array.isArray(response.body.value)).toBe(true);
			expect(response.body.value.length).toBe(0);
			expect(response.body.error).toBeUndefined();
		});

		it("should return only active campaigns when mixed with deleted ones", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			await createCampaign({
				name: "Active Campaign 1",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			await createCampaign({
				name: "To Delete",
				category: "regular" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const responseGetAll = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const campaignToDeleteId = responseGetAll.body.value.find(
				(c: any) => c.name === "To Delete",
			).id;

			await request(app.getHttpServer())
				.delete(`/campaign/${campaignToDeleteId}`)
				.expect(200);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(Array.isArray(response.body.value)).toBe(true);
			expect(response.body.value.length).toBe(1);
			expect(response.body.value[0].name).toBe("Active Campaign 1");
			expect(response.body.value[0].deletedAt).toBeUndefined();
			expect(response.body.error).toBeUndefined();
		});

		it("should return empty list when all campaigns are deleted", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			await createCampaign({
				name: "Campaign 1",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			await createCampaign({
				name: "Campaign 2",
				category: "regular" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const responseGetAll = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const campaignIds = responseGetAll.body.value.map((c: any) => c.id);

			for (const id of campaignIds) {
				await request(app.getHttpServer())
					.delete(`/campaign/${id}`)
					.expect(200);
			}

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(Array.isArray(response.body.value)).toBe(true);
			expect(response.body.value.length).toBe(0);
			expect(response.body.error).toBeUndefined();
		});
	});

	describe("GET /campaign/:id", () => {
		it("should return a campaign by ID when not deleted", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			await createCampaign({
				name: "Specific Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const responseGetAll = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const campaignId = responseGetAll.body.value[0].id;

			const response = await request(app.getHttpServer())
				.get(`/campaign/${campaignId}`)
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value.id).toBe(campaignId);
			expect(response.body.value.name).toBe("Specific Campaign");
			expect(response.body.value.category).toBe("seasonal");
			expect(response.body.value.status).toBe("active");
			expect(response.body.value.deletedAt).toBeUndefined();
			expect(response.body.error).toBeUndefined();
		});

		it("should return 404 if campaign not found", async () => {
			const response = await request(app.getHttpServer())
				.get("/campaign/nonexistent-id")
				.expect(404);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.code).toBe("CAMPAING_NOT_FOUND");
			expect(response.body.error.message).toBe("Campaign not found");
			expect(response.body.value).toBeUndefined();
		});

		it("should return 404 if campaign is deleted", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			await createCampaign({
				name: "To Delete",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const responseGetAll = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const campaignId = responseGetAll.body.value[0].id;

			await request(app.getHttpServer())
				.delete(`/campaign/${campaignId}`)
				.expect(200);

			const response = await request(app.getHttpServer())
				.get(`/campaign/${campaignId}`)
				.expect(404);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.code).toBe("CAMPAING_NOT_FOUND");
			expect(response.body.error.message).toBe("Campaign not found");
			expect(response.body.value).toBeUndefined();
		});

		it("should return active campaign and ignore deleted ones with same ID pattern", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			await createCampaign({
				name: "Campaign 1",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const responseGetAll1 = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const campaignIdToDelete = responseGetAll1.body.value[0].id;

			await request(app.getHttpServer())
				.delete(`/campaign/${campaignIdToDelete}`)
				.expect(200);

			await createCampaign({
				name: "Campaign 2",
				category: "regular" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const responseGetAll2 = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const newCampaignId = responseGetAll2.body.value[0].id;

			const responseDeleted = await request(app.getHttpServer())
				.get(`/campaign/${campaignIdToDelete}`)
				.expect(404);

			expect(responseDeleted.body.isSuccess).toBe(false);
			expect(responseDeleted.body.isFailure).toBe(true);
			expect(responseDeleted.body.error.code).toBe("CAMPAING_NOT_FOUND");
			expect(responseDeleted.body.value).toBeUndefined();

			const responseActive = await request(app.getHttpServer())
				.get(`/campaign/${newCampaignId}`)
				.expect(200);

			expect(responseActive.body.isSuccess).toBe(true);
			expect(responseActive.body.isFailure).toBe(false);
			expect(responseActive.body.value.id).toBe(newCampaignId);
			expect(responseActive.body.value.name).toBe("Campaign 2");
			expect(responseActive.body.value.category).toBe("regular");
			expect(responseActive.body.value.status).toBe("active");
			expect(responseActive.body.value.deletedAt).toBeUndefined();
		});
	});

	describe("PUT /campaign/:id", () => {
		it("should update a campaign", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			await createCampaign({
				name: "Old Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const responseGetAll = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const campaignId = responseGetAll.body.value[0].id;

			const updatedData = {
				name: "Updated Campaign",
				category: "special",
				startDate: new Date("2025-03-02"),
				endDate: new Date("2025-04-02"),
				status: "active",
			};

			const response = await request(app.getHttpServer())
				.put(`/campaign/${campaignId}`)
				.send(updatedData)
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value).toBeUndefined();
			expect(response.body.error).toBeUndefined();
		});

		it("should fail if endDate is before startDate", async () => {
			await createCampaign({
				name: "To Update",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const responseGetAll = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const campaignId = responseGetAll.body.value[0].id;

			const invalidData = {
				endDate: new Date("2025-02-01"),
				startDate: new Date("2025-03-01"),
				name: "Invalid Dates",
				category: "seasonal" as CampaignCategory,
				status: "active",
			};

			const response = await request(app.getHttpServer())
				.put(`/campaign/${campaignId}`)
				.send(invalidData)
				.expect(400);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.code).toBe("END_DATE_BEFORE_START_DATE");
			expect(response.body.error.message).toBe(
				"endDate must be greater than startDate",
			);
			expect(response.body.value).toBeUndefined();
		});
	});

	describe("DELETE /campaign/:id", () => {
		it("should soft delete a campaign", async () => {
			await createCampaign({
				name: "To Delete",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const responseGetAll = await request(app.getHttpServer())
				.get("/campaign")
				.expect(200);
			const campaignId = responseGetAll.body.value[0].id;

			const deleteResponse = await request(app.getHttpServer())
				.delete(`/campaign/${campaignId}`)
				.expect(200);

			expect(deleteResponse.body.isSuccess).toBe(true);
			expect(deleteResponse.body.isFailure).toBe(false);
			expect(deleteResponse.body.value).toBeUndefined();
			expect(deleteResponse.body.error).toBeUndefined();

			const getResponse = await request(app.getHttpServer())
				.get(`/campaign/${campaignId}`)
				.expect(404);

			expect(getResponse.body.isSuccess).toBe(false);
			expect(getResponse.body.isFailure).toBe(true);
			expect(getResponse.body.error.code).toBe("CAMPAING_NOT_FOUND");
			expect(getResponse.body.error.message).toBe("Campaign not found");
		});
	});
});

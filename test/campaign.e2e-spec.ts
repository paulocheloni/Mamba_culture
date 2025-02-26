import { Test, type TestingModule } from "@nestjs/testing";
import {
	ClassSerializerInterceptor,
	ValidationPipe,
	type INestApplication,
} from "@nestjs/common";
import request from "supertest";
import { AppModule } from "src/shared/infra/app.module";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import type { CreateCampaignBodyDto } from "src/campaign/presentation/REST/dto/request/create-campaign-body.dto";
import type { CampaignCategory } from "src/campaign/domain/campaign/entity/campaign.interface";
import { HttpExceptionFilter } from "src/shared/infra/filters/http-exception.filter";
import { ResultInterceptor } from "src/shared/infra/interceptors/result.interceptor";
import { Reflector } from "@nestjs/core";
import { CampaignPrismaRepository } from "src/campaign/infra/repository/prisma/campaign-prisma.repository";
import { PrismaService } from "src/shared/infra/prisma/prisma-extended.service";
import type { ExtendedPrismaClient } from "src/shared/infra/prisma/prisma.extension";
import type { CustomPrismaService } from "nestjs-prisma";

describe("AppController (e2e) - Prisma", () => {
	let app: INestApplication;
	let prismaService: CustomPrismaService<ExtendedPrismaClient>;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(ICampaignRepository)
			.useClass(CampaignPrismaRepository)
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalFilters(new HttpExceptionFilter());
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: true,
			}),
		);
		app.useGlobalInterceptors(new ResultInterceptor());
		app.useGlobalInterceptors(
			new ClassSerializerInterceptor(app.get(Reflector)),
		);
		prismaService = app.get(PrismaService);
		await app.init();
	});

	beforeEach(async () => {
		await prismaService.client.campaign.deleteMany();
	});

	afterAll(async () => {
		await app.close();
	});

	const createCampaign = (data: CreateCampaignBodyDto) => {
		return request(app.getHttpServer()).post("/campaign").send(data);
	};

	describe("POST /campaign - Input Validation", () => {
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
			expect(response.body.value).toBeDefined();
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

		it("should fail if name is missing", async () => {
			const campaignData = {
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			};

			const response = await createCampaign(campaignData as any).expect(400);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.message).toContain("Bad Request Exception");
		});

		it("should fail if category is invalid", async () => {
			const campaignData = {
				name: "Invalid Category",
				category: "invalid" as any,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			};

			const response = await createCampaign(campaignData).expect(400);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.message).toContain("Bad Request Exception");
		});

		it("should fail if startDate is invalid format", async () => {
			const campaignData = {
				name: "Invalid Start Date",
				category: "seasonal" as CampaignCategory,
				startDate: "invalid-date",
				endDate: new Date("2025-04-01"),
			};

			const response = await createCampaign(campaignData as any).expect(400);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.message).toContain("Bad Request Exception");
		});
	});

	describe("GET /campaign - Output Validation", () => {
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
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(Array.isArray(response.body.value)).toBe(true);
			expect(response.body.value.length).toBe(1);
			expect(response.body.value[0].name).toBe("Active Campaign");
			expect(response.body.value[0].category).toBe("seasonal");
			expect(response.body.value[0].status).toBe("active");
			expect(response.body.value[0].deletedAt).toBeNull();
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
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "",
				})
				.expect(200);
			const campaignId = responseGetAll.body.value[0].id;

			await request(app.getHttpServer())
				.delete(`/campaign/${campaignId}`)
				.expect(200);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "",
				})
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
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "",
				})
				.expect(200);
			const campaignToDeleteId = responseGetAll.body.value.find(
				(c: any) => c.name === "To Delete",
			).id;

			await request(app.getHttpServer())
				.delete(`/campaign/${campaignToDeleteId}`)
				.expect(200);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(Array.isArray(response.body.value)).toBe(true);
			expect(response.body.value.length).toBe(1);
			expect(response.body.value[0].name).toBe("Active Campaign 1");
			expect(response.body.value[0].deletedAt).toBeNull();
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
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "",
				})
				.expect(200);
			const campaignIds = responseGetAll.body.value.map((c: any) => c.id);

			for (const id of campaignIds) {
				await request(app.getHttpServer())
					.delete(`/campaign/${id}`)
					.expect(200);
			}

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(Array.isArray(response.body.value)).toBe(true);
			expect(response.body.value.length).toBe(0);
			expect(response.body.error).toBeUndefined();
		});

		it("should paginate correctly and exclude deleted campaigns", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			await createCampaign({
				name: "Campaign A",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const created = await createCampaign({
				name: "Campaign B",
				category: "regular" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const campaignIdToDelete = created.body.value.id;

			await request(app.getHttpServer())
				.delete(`/campaign/${campaignIdToDelete}`)
				.expect(200);

			const responsePage1 = await request(app.getHttpServer())
				.get("/campaign")
				.query({ page: 1, limit: 1, orderBy: "name", order: "asc", search: "" })
				.expect(200);

			expect(responsePage1.body.isSuccess).toBe(true);
			expect(responsePage1.body.value.length).toBe(1);
			expect(responsePage1.body.value[0].name).toBe("Campaign A");
			expect(responsePage1.body.value[0].deletedAt).toBeNull();

			const responsePage2 = await request(app.getHttpServer())
				.get("/campaign")
				.query({ page: 2, limit: 1, orderBy: "name", order: "asc", search: "" })
				.expect(200);

			expect(responsePage2.body.isSuccess).toBe(true);
			expect(responsePage2.body.value.length).toBe(0);
		});

		it("should search campaigns by name with partial match", async () => {
			await createCampaign({
				name: "Summer Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "sum",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value.length).toBe(1);
			expect(response.body.value[0].name).toBe("Summer Campaign");
		});

		it("should handle case-insensitive search", async () => {
			await createCampaign({
				name: "SUMMER Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "summer",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value.length).toBe(1);
			expect(response.body.value[0].name).toBe("SUMMER Campaign");
		});

		it("should return all campaigns for empty search", async () => {
			await createCampaign({
				name: "Campaign One",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			await createCampaign({
				name: "Campaign Two",
				category: "regular" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value.length).toBe(2);
			expect(response.body.value.map((c) => c.name).sort()).toEqual([
				"Campaign One",
				"Campaign Two",
			]);
		});

		it("should order by createdAt ascending", async () => {
			await createCampaign({
				name: "Older Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			await new Promise((resolve) => setTimeout(resolve, 1000));

			await createCampaign({
				name: "Newer Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: 1,
					limit: 10,
					orderBy: "createdAt",
					order: "asc",
					search: "",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value.length).toBe(2);
			expect(response.body.value[0].name).toBe("Older Campaign");
			expect(response.body.value[1].name).toBe("Newer Campaign");
		});

		it("should order by name descending", async () => {
			await createCampaign({
				name: "Zebra Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			await createCampaign({
				name: "Apple Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: 1,
					limit: 10,
					orderBy: "name",
					order: "desc",
					search: "",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value.length).toBe(2);
			expect(response.body.value[0].name).toBe("Zebra Campaign");
			expect(response.body.value[1].name).toBe("Apple Campaign");
		});

		// Add edge cases for pagination
		it("should handle invalid page number", async () => {
			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: -1,
					limit: 10,
					orderBy: "name",
					order: "asc",
					search: "",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value.length).toBeDefined();
		});

		it("should handle zero limit", async () => {
			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({ page: 1, limit: 0, orderBy: "name", order: "asc", search: "" })
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
		});

		it("should handle page beyond total pages", async () => {
			await createCampaign({
				name: "Campaign One",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const response = await request(app.getHttpServer())
				.get("/campaign")
				.query({
					page: 10,
					limit: 1,
					orderBy: "name",
					order: "asc",
					search: "",
				})
				.expect(200);

			expect(response.body.isSuccess).toBe(true);
			expect(response.body.isFailure).toBe(false);
			expect(response.body.value.length).toBe(0);
		});
	});
	describe("GET /campaign/:id - Output Validation", () => {
		it("should return a campaign by ID when not deleted", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			const created = await createCampaign({
				name: "Specific Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const campaignId = created.body.value.id;

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
			expect(response.body.error.code).toBe("CAMPAIGN_NOT_FOUND");
			expect(response.body.error.message).toBe("Campaign not found");
			expect(response.body.value).toBeUndefined();
		});

		it("should return 404 if campaign is deleted", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			const created = await createCampaign({
				name: "To Delete",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const campaignId = created.body.value.id;

			await request(app.getHttpServer())
				.delete(`/campaign/${campaignId}`)
				.expect(200);

			const response = await request(app.getHttpServer())
				.get(`/campaign/${campaignId}`)
				.expect(404);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.code).toBe("CAMPAIGN_NOT_FOUND");
			expect(response.body.error.message).toBe("Campaign not found");
			expect(response.body.value).toBeUndefined();
		});

		it("should return active campaign and ignore deleted ones with same ID pattern", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			const created = await createCampaign({
				name: "Campaign 1",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const campaignIdToDelete = created.body.value.id;

			await request(app.getHttpServer())
				.delete(`/campaign/${campaignIdToDelete}`)
				.expect(200);

			const created2 = await createCampaign({
				name: "Campaign 2",
				category: "regular" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const newCampaignId = created2.body.value.id as string;

			const responseDeleted = await request(app.getHttpServer())
				.get(`/campaign/${campaignIdToDelete}`)
				.expect(404);

			expect(responseDeleted.body.isSuccess).toBe(false);
			expect(responseDeleted.body.isFailure).toBe(true);
			expect(responseDeleted.body.error.code).toBe("CAMPAIGN_NOT_FOUND");
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

	describe("PUT /campaign/:id - Input Validation", () => {
		it("should update a campaign with valid data", async () => {
			const futureStart = new Date("2025-03-01");
			const futureEnd = new Date("2025-04-01");

			const created = await createCampaign({
				name: "Old Campaign",
				category: "seasonal" as CampaignCategory,
				startDate: futureStart,
				endDate: futureEnd,
			}).expect(201);

			const campaignId = created.body.value.id;

			const updatedData = {
				name: "Updated Campaign",
				category: "special" as CampaignCategory,
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
			const created = await createCampaign({
				name: "To Update",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const campaignId = created.body.value.id;

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

		it("should fail if category is invalid", async () => {
			const created = await createCampaign({
				name: "To Update",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const campaignId = created.body.value.id;
			const invalidData = {
				name: "Updated",
				category: "invalid" as any,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			};

			const response = await request(app.getHttpServer())
				.put(`/campaign/${campaignId}`)
				.send(invalidData)
				.expect(400);

			expect(response.body.isSuccess).toBe(false);
			expect(response.body.isFailure).toBe(true);
			expect(response.body.error.message).toContain("Bad Request Exception");
		});
	});

	describe("DELETE /campaign/:id", () => {
		it("should soft delete a campaign", async () => {
			const created = await createCampaign({
				name: "To Delete",
				category: "seasonal" as CampaignCategory,
				startDate: new Date("2025-03-01"),
				endDate: new Date("2025-04-01"),
			}).expect(201);

			const campaignId = created.body.value.id;

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
			expect(getResponse.body.error.code).toBe("CAMPAIGN_NOT_FOUND");
			expect(getResponse.body.error.message).toBe("Campaign not found");
		});
	});
});

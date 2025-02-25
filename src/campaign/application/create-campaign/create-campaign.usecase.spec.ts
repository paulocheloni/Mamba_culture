import { TestBed } from "@suites/unit";
import { CreateCampaignUseCase } from "./create-campaign.usecase";
import { ICampaignRepository } from "../../domain/campaign/repository/campaign.repository.interface";
import type { CampaignCategory } from "src/campaign/domain/campaign/entity/campaign.interface";
import type { Mocked } from "@suites/doubles.jest";

describe("CreateCampaignUsecase", () => {
	let usecase: CreateCampaignUseCase;
	let repository: Mocked<ICampaignRepository>;

	beforeAll(async () => {
		const { unit, unitRef } = await TestBed.solitary(
			CreateCampaignUseCase,
		).compile();
		usecase = unit;
		repository = unitRef.get(ICampaignRepository);
	});

	it("should be defined", () => {
		expect(true).toBeTruthy();
	});

	it("should create a campaign", async () => {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);

		const data = {
			category: "regular" as keyof typeof CampaignCategory,
			name: "Campaign 1",
			startDate: nexthour,
			endDate: tomorrow,
			createdAt: now,
		};
		await usecase.execute(data);
		expect(repository.create).toHaveBeenCalled();
	});

	it("should throw an error when endDate is less than startDate", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() + 1);
		yesterday.setDate(now.getDate() - 1);

		const data = {
			category: "seasonal",
			name: "Campaign 1",
			startDate: nexthour,
			endDate: yesterday,
			createdAt: now,
		};
		const result = await usecase.execute(data as any);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("endDate must be greater than startDate");
	});

	it("should throw an error when startDate is less than createdAt", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() - 1);
		yesterday.setDate(now.getDate() + 1);

		const data = {
			category: "seasonal",
			name: "Campaign 1",
			startDate: nexthour,
			endDate: yesterday,
			createdAt: now,
		};

		const result = await usecase.execute(data as any);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe(
			"startDate must be greater than createdAt",
		);
	});

	it("should throw an error when startDate is missing", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() - 1);
		yesterday.setDate(now.getDate() + 1);

		const data = {
			category: "Category 1",
			name: "Campaign 1",
			endDate: yesterday,
			createdAt: now,
		};
		const result = await usecase.execute(data as any);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("startDate is required");
	});

	it("should throw an error when endDate is missing", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() - 1);
		yesterday.setDate(now.getDate() + 1);

		const data = {
			category: "Category 1",
			name: "Campaign 1",
			startDate: nexthour,
			createdAt: now,
		};
		const result = await usecase.execute(data as any);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("endDate is required");
	});

	it("should throw an error when createdAt is bigger than startDate", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() - 1);
		yesterday.setDate(now.getDate() + 1);

		const data = {
			category: "seasonal",
			name: "Campaign 1",
			startDate: nexthour,
			endDate: yesterday,
		};
		const result = await usecase.execute(data as any);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe(
			"startDate must be greater than createdAt",
		);
	});

	it("should throw an error when name is missing", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() - 1);
		yesterday.setDate(now.getDate() + 1);

		const data = {
			category: "Category 1",
			startDate: nexthour,
			endDate: yesterday,
			createdAt: now,
		};
		const result = await usecase.execute(data as any);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Name is required");
	});

	it("should throw an error when category is missing", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() - 1);
		yesterday.setDate(now.getDate() + 1);

		const data = {
			name: "Campaign 1",
			startDate: nexthour,
			endDate: yesterday,
			createdAt: now,
		};
		const result = await usecase.execute(data as any);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Category is required");
	});

	it("should create campaign active by default", async () => {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);

		const data = {
			category: "Category 1",
			name: "Campaign 1",
			startDate: nexthour,
			endDate: tomorrow,
			createdAt: now,
		};
		await usecase.execute(data as any);
		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				status: "active",
			}),
		);
	});

	it("should fail when an campaign with the same name already exists", async () => {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);

		const data = {
			category: "seasonal",
			name: "Campaign 1",
			startDate: nexthour,
			endDate: tomorrow,
			createdAt: now,
		};
		repository.create.mockResolvedValue({
			isFailure: true,
			error: new Error("Campaign already exists"),
			isSuccess: false,
			value: null,
		});
		const result = await usecase.execute(data as any);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Campaign already exists");
	});
});

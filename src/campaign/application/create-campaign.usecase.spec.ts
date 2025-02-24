import { TestBed } from "@suites/unit";
import { CreateCampaignUseCase } from "./create-campaign.usecase";
import { ICampaignRepository } from "../domain/repository/campaign.repository.interface";

describe("CreateCampaignUsecase", () => {
	let usecase: CreateCampaignUseCase;
	let repository: ICampaignRepository;

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
			category: "Category 1",
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
			category: "Category 1",
			name: "Campaign 1",
			startDate: nexthour,
			endDate: yesterday,
			createdAt: now,
		};
		await expect(usecase.execute(data)).rejects.toThrow();
	});

	it("should throw an error when startDate is less than createdAt", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() - 1);
		yesterday.setDate(now.getDate() + 1);

		const data = {
			category: "Category 1",
			name: "Campaign 1",
			startDate: nexthour,
			endDate: yesterday,
			createdAt: now,
		};
		await expect(usecase.execute(data)).rejects.toThrow();
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
		await expect(usecase.execute(data as any)).rejects.toThrow();
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
		await expect(usecase.execute(data as any)).rejects.toThrow();
	});

	it("should throw an error when createdAt is missing", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() - 1);
		yesterday.setDate(now.getDate() + 1);

		const data = {
			category: "Category 1",
			name: "Campaign 1",
			startDate: nexthour,
			endDate: yesterday,
		};
		await expect(usecase.execute(data as any)).rejects.toThrow();
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
		await expect(usecase.execute(data as any)).rejects.toThrow();
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
		await expect(usecase.execute(data as any)).rejects.toThrow();
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
		await usecase.execute(data);
		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				status: "active",
			}),
		);
	});
});

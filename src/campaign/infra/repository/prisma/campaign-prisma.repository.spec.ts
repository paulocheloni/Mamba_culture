import { TestBed } from "@suites/unit";
import { CampaignPrismaRepository } from "./campaign-prisma.repository";
import type { Mocked } from "@suites/doubles.jest";
import { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import type {
	CampaignCategory,
	CampaignStatus,
} from "src/campaign/domain/campaign/entity/campaign.interface";
import { PrismaService } from "src/shared/infra/prisma/prisma-extended.service";
import type { CustomPrismaService } from "nestjs-prisma";
import type { ExtendedPrismaClient } from "src/shared/infra/prisma/prisma.extension";

interface MockCampaignData {
	id: string;
	name: string;
	category: keyof typeof CampaignCategory;
	status: keyof typeof CampaignStatus;
	createdAt: Date;
	startDate: Date;
	endDate: Date;
	deletedAt?: Date | null;
}

describe("CampaignPrismaRepository", () => {
	let campaignPrismaRepository: CampaignPrismaRepository;
	let prismaService: Mocked<CustomPrismaService<ExtendedPrismaClient>>;
	const testDate = new Date("2025-01-01");

	const mockCampaignData = (
		overrides: Partial<MockCampaignData> = {},
	): Campaign => {
		const campaign = Campaign.create({
			id: "1",
			name: "Campaign One",
			category: "seasonal" as keyof typeof CampaignCategory,
			status: "active" as keyof typeof CampaignStatus,
			createdAt: testDate,
			startDate: testDate,
			endDate: testDate,
			...overrides,
		});
		if (!campaign.isSuccess) {
			throw new Error("Failed to create mock campaign");
		}
		return campaign.value;
	};

	beforeAll(async () => {
		const { unit, unitRef } = await TestBed.solitary(
			CampaignPrismaRepository,
		).compile();
		campaignPrismaRepository = unit;
		prismaService = unitRef.get(PrismaService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(campaignPrismaRepository).toBeTruthy();
	});

	it("should have a create method", () => {
		expect(campaignPrismaRepository.create).toBeDefined();
	});

	it("should have a save method", () => {
		expect(campaignPrismaRepository.save).toBeDefined();
	});

	it("should have a getById method", () => {
		expect(campaignPrismaRepository.getById).toBeDefined();
	});

	it("should have a getByName method", () => {
		expect(campaignPrismaRepository.getByName).toBeDefined();
	});

	describe("create", () => {
		it("should create a new campaign successfully", async () => {
			const campaign = mockCampaignData();
			prismaService.client.campaign.create.mockResolvedValue(undefined);

			const result = await campaignPrismaRepository.create(campaign);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeUndefined();
			expect(prismaService.client.campaign.create).toHaveBeenCalledWith({
				data: {
					id: campaign.id,
					name: campaign.name,
					category: campaign.category,
					status: campaign.status,
					createdAt: campaign.createdAt,
					startDate: campaign.startDate,
					endDate: campaign.endDate,
				},
			});
		});

		it("should return failure when creation fails", async () => {
			const campaign = mockCampaignData();
			const error = new Error("Database error");
			prismaService.client.campaign.create.mockRejectedValue(error);

			const result = await campaignPrismaRepository.create(campaign);

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(prismaService.client.campaign.create).toHaveBeenCalled();
		});
	});

	describe("getById", () => {
		it("should return campaign when found", async () => {
			const mockData = {
				id: "1",
				name: "Campaign One",
				category: "seasonal",
				status: "active",
				createdAt: testDate,
				startDate: testDate,
				endDate: testDate,
				deletedAt: null,
			};
			prismaService.client.campaign.findUnique.mockResolvedValue(
				mockData as any,
			);

			const result = await campaignPrismaRepository.getById("1");

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeInstanceOf(Campaign);
			expect(result.value.id).toBe("1");
			expect(result.value.name).toBe("Campaign One");
			expect(prismaService.client.campaign.findUnique).toHaveBeenCalledWith({
				where: { id: "1", deletedAt: null },
			});
		});

		it("should return failure when campaign not found", async () => {
			prismaService.client.campaign.findUnique.mockResolvedValue(null);

			const result = await campaignPrismaRepository.getById("1");

			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign not found");
			expect(result.error.code).toBe("CAMPAIGN_NOT_FOUND");
			expect(prismaService.client.campaign.findUnique).toHaveBeenCalledWith({
				where: { id: "1", deletedAt: null },
			});
		});

		it("should return failure on database error", async () => {
			const error = new Error("Database error");
			prismaService.client.campaign.findUnique.mockRejectedValue(error);

			const result = await campaignPrismaRepository.getById("1");

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(prismaService.client.campaign.findUnique).toHaveBeenCalled();
		});
	});

	describe("save", () => {
		it("should update campaign successfully", async () => {
			const campaign = mockCampaignData({ name: "Updated Campaign" });
			prismaService.client.campaign.update.mockResolvedValue(undefined);

			const result = await campaignPrismaRepository.save(campaign);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeUndefined();
			expect(prismaService.client.campaign.update).toHaveBeenCalledWith({
				where: { id: campaign.id },
				data: {
					name: campaign.name,
					category: campaign.category,
					status: campaign.status,
					startDate: campaign.startDate,
					endDate: campaign.endDate,
				},
			});
		});

		it("should return failure when update fails", async () => {
			const campaign = mockCampaignData();
			const error = new Error("Database error");
			prismaService.client.campaign.update.mockRejectedValue(error);

			const result = await campaignPrismaRepository.save(campaign);

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(prismaService.client.campaign.update).toHaveBeenCalled();
		});
	});

	describe("getByName", () => {
		it("should return campaign when found by name", async () => {
			const mockData = {
				id: "1",
				name: "Campaign One",
				category: "seasonal",
				status: "active",
				createdAt: testDate,
				startDate: testDate,
				endDate: testDate,
				deletedAt: null,
			};
			prismaService.client.campaign.findFirst.mockResolvedValue(
				mockData as any,
			);

			const result = await campaignPrismaRepository.getByName("Campaign One");

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeInstanceOf(Campaign);
			expect(result.value.id).toBe("1");
			expect(result.value.name).toBe("Campaign One");
			expect(prismaService.client.campaign.findFirst).toHaveBeenCalledWith({
				where: {
					name: "Campaign One",
					deletedAt: null,
				},
			});
		});

		it("should return failure when campaign not found by name", async () => {
			prismaService.client.campaign.findFirst.mockResolvedValue(null);

			const result = await campaignPrismaRepository.getByName("Campaign One");

			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign not found");
			expect(result.error.code).toBe("CAMPAIGN_NOT_FOUND");
			expect(prismaService.client.campaign.findFirst).toHaveBeenCalledWith({
				where: { name: "Campaign One", deletedAt: null },
			});
		});

		it("should return failure on database error", async () => {
			const error = new Error("Database error");
			prismaService.client.campaign.findFirst.mockRejectedValue(error);

			const result = await campaignPrismaRepository.getByName("Campaign One");

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(prismaService.client.campaign.findFirst).toHaveBeenCalled();
		});
	});
});

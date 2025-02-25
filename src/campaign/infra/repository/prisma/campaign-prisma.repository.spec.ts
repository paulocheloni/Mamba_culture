import { TestBed } from "@suites/unit";
import { CampaignPrismaRepository } from "./campaign-prisma.repository";
import { PrismaService } from "nestjs-prisma";
import type { Mocked } from "@suites/doubles.jest";
import { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import type { IQueryable } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import type {
	CampaignCategory,
	CampaignStatus,
} from "src/campaign/domain/campaign/entity/campaign.interface";

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
	let prismaService: Mocked<PrismaService>;
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

	it("should have a getAll method", () => {
		expect(campaignPrismaRepository.getAll).toBeDefined();
	});

	it("should have a getByName method", () => {
		expect(campaignPrismaRepository.getByName).toBeDefined();
	});

	describe("create", () => {
		it("should create a new campaign successfully", async () => {
			const campaign = mockCampaignData();
			prismaService.campaign.create.mockResolvedValue(undefined);

			const result = await campaignPrismaRepository.create(campaign);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeUndefined();
			expect(prismaService.campaign.create).toHaveBeenCalledWith({
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
			prismaService.campaign.create.mockRejectedValue(error);

			const result = await campaignPrismaRepository.create(campaign);

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(prismaService.campaign.create).toHaveBeenCalled();
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
			prismaService.campaign.findUnique.mockResolvedValue(mockData as any);

			const result = await campaignPrismaRepository.getById("1");

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeInstanceOf(Campaign);
			expect(result.value.id).toBe("1");
			expect(result.value.name).toBe("Campaign One");
			expect(prismaService.campaign.findUnique).toHaveBeenCalledWith({
				where: { id: "1", deletedAt: null },
			});
		});

		it("should return failure when campaign not found", async () => {
			prismaService.campaign.findUnique.mockResolvedValue(null);

			const result = await campaignPrismaRepository.getById("1");

			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign not found");
			expect(result.error.code).toBe("CAMPAIGN_NOT_FOUND");
			expect(prismaService.campaign.findUnique).toHaveBeenCalledWith({
				where: { id: "1", deletedAt: null },
			});
		});

		it("should return failure on database error", async () => {
			const error = new Error("Database error");
			prismaService.campaign.findUnique.mockRejectedValue(error);

			const result = await campaignPrismaRepository.getById("1");

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(prismaService.campaign.findUnique).toHaveBeenCalled();
		});
	});

	describe("save", () => {
		it("should update campaign successfully", async () => {
			const campaign = mockCampaignData({ name: "Updated Campaign" });
			prismaService.campaign.update.mockResolvedValue(undefined);

			const result = await campaignPrismaRepository.save(campaign);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeUndefined();
			expect(prismaService.campaign.update).toHaveBeenCalledWith({
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
			prismaService.campaign.update.mockRejectedValue(error);

			const result = await campaignPrismaRepository.save(campaign);

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(prismaService.campaign.update).toHaveBeenCalled();
		});
	});

	describe("getAll", () => {
		it("should return campaigns with query parameters including deletedAt", async () => {
			const mockCampaigns = [
				{
					id: "1",
					name: "Campaign One",
					category: "seasonal",
					status: "active",
					createdAt: testDate,
					startDate: testDate,
					endDate: testDate,
					deletedAt: null,
				},
				{
					id: "2",
					name: "Campaign Two",
					category: "seasonal",
					status: "active",
					createdAt: testDate,
					startDate: testDate,
					endDate: testDate,
					deletedAt: null,
				},
			];
			prismaService.campaign.findMany.mockResolvedValue(mockCampaigns as any);

			const query: IQueryable = {
				search: "Campaign",
				page: 0,
				limit: 10,
				orderBy: "name",
				order: "asc",
			};
			const result = await campaignPrismaRepository.getAll(query);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toHaveLength(2);
			expect(result.value[0].id).toBe("1");
			expect(result.value[0].name).toBe("Campaign One");
			expect(result.value[0].deletedAt).toBeNull();
			expect(prismaService.campaign.findMany).toHaveBeenCalledWith({
				where: {
					name: { contains: "Campaign" },
					deletedAt: null,
				},

				distinct: ["id"],
				skip: 0,
				take: 10,
				orderBy: { name: "asc" },
				select: {
					id: true,
					name: true,
					category: true,
					status: true,
					createdAt: true,
					startDate: true,
					endDate: true,
					deletedAt: true,
				},
			});
		});

		it("should return failure on database error", async () => {
			const error = new Error("Database error");
			prismaService.campaign.findMany.mockRejectedValue(error);
			const query: IQueryable = {
				search: "",
				page: 0,
				limit: 10,
				orderBy: "name",
				order: "asc",
			};

			const result = await campaignPrismaRepository.getAll(query);

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(prismaService.campaign.findMany).toHaveBeenCalled();
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
			prismaService.campaign.findFirst.mockResolvedValue(mockData as any);

			const result = await campaignPrismaRepository.getByName("Campaign One");

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeInstanceOf(Campaign);
			expect(result.value.id).toBe("1");
			expect(result.value.name).toBe("Campaign One");
			expect(prismaService.campaign.findFirst).toHaveBeenCalledWith({
				where: {
					name: "Campaign One",
					deletedAt: null,
				},
			});
		});

		it("should return failure when campaign not found by name", async () => {
			prismaService.campaign.findFirst.mockResolvedValue(null);

			const result = await campaignPrismaRepository.getByName("Campaign One");

			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign not found");
			expect(result.error.code).toBe("CAMPAIGN_NOT_FOUND");
			expect(prismaService.campaign.findFirst).toHaveBeenCalledWith({
				where: { name: "Campaign One", deletedAt: null },
			});
		});

		it("should return failure on database error", async () => {
			const error = new Error("Database error");
			prismaService.campaign.findFirst.mockRejectedValue(error);

			const result = await campaignPrismaRepository.getByName("Campaign One");

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(error);
			expect(prismaService.campaign.findFirst).toHaveBeenCalled();
		});
	});
});

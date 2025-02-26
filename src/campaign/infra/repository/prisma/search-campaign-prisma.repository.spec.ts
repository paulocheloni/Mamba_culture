import { TestBed } from "@suites/unit";
import { SearchCampaignPrismaRepository } from "./search-campaign-prisma.repository";
import { PrismaService } from "src/shared/infra/prisma/prisma-extended.service";
import type { QueryableDTO } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import type { Mocked } from "@suites/doubles.jest";

describe("SearchCampaignPrismaRepository", () => {
	let repository: SearchCampaignPrismaRepository;
	let prismaService: Mocked<any>;

	beforeAll(async () => {
		const { unit, unitRef } = await TestBed.solitary(
			SearchCampaignPrismaRepository,
		).compile();
		repository = unit;
		prismaService = unitRef.get(PrismaService);
	});

	beforeEach(() => {
		prismaService.client.campaign.findMany.mockReset();
		prismaService.client.campaign.count.mockReset();
	});

	it("should be defined", () => {
		expect(repository).toBeDefined();
	});

	it("should return a list of active campaigns", async () => {
		const mockData = [
			{
				id: "1",
				name: "Active Campaign 1",
				category: "seasonal",
				status: "active",
				startDate: new Date("2025-03-01"),
				end_date: new Date("2025-04-01"),
				createdAt: new Date(),
				deletedAt: null,
			},
			{
				id: "2",
				name: "Active Campaign 2",
				category: "regular",
				status: "active",
				startDate: new Date("2025-03-01"),
				end_date: new Date("2025-04-01"),
				createdAt: new Date(),
				deletedAt: null,
			},
		];

		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "",
			orderBy: "name",
			order: "asc",
		};

		prismaService.client.campaign.findMany.mockResolvedValue(mockData);
		prismaService.client.campaign.count.mockResolvedValue(mockData.length);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value).toStrictEqual(mockData);
		expect(response.metadata).toMatchObject({
			currentPage: 1,
			perPage: 10,
			total: 2,
			totalPages: 1,
			hasPrevPage: false,
			hasNextPage: false,
		});
	});

	it("should handle a search with no results", async () => {
		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "nonexistent",
			orderBy: "name",
			order: "asc",
		};

		prismaService.client.campaign.findMany.mockResolvedValue([]);
		prismaService.client.campaign.count.mockResolvedValue(0);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value).toStrictEqual([]);
		expect(response.metadata).toMatchObject({
			currentPage: 1,
			perPage: 10,
			total: 0,
			totalPages: 0,
			hasPrevPage: false,
			hasNextPage: false,
		});
	});

	it("should handle database errors", async () => {
		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "campaign",
			orderBy: "name",
			order: "asc",
		};

		const error = new Error("Database error");
		prismaService.client.campaign.findMany.mockRejectedValue(error);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(false);
		expect(response.isFailure).toBe(true);
		expect(response.error).toStrictEqual(error);
		expect(response.value).toStrictEqual([]);
	});

	it("should handle pagination with multiple pages", async () => {
		const query: QueryableDTO = {
			page: 1,
			limit: 5,
			search: "campaign",
			orderBy: "name",
			order: "asc",
		};

		const paginationResponse = [
			{
				id: "1",
				name: "Campaign A",
				category: "seasonal",
				status: "active",
				startDate: new Date("2025-03-01"),
				end_date: new Date("2025-04-01"),
				createdAt: new Date(),
				deletedAt: null,
			},
			{
				id: "2",
				name: "Campaign B",
				category: "regular",
				status: "active",
				startDate: new Date("2025-03-01"),
				end_date: new Date("2025-04-01"),
				createdAt: new Date(),
				deletedAt: null,
			},
			{
				id: "3",
				name: "Campaign C",
				category: "special",
				status: "active",
				startDate: new Date("2025-03-01"),
				end_date: new Date("2025-04-01"),
				createdAt: new Date(),
				deletedAt: null,
			},
			{
				id: "4",
				name: "Campaign D",
				category: "seasonal",
				status: "active",
				startDate: new Date("2025-03-01"),
				end_date: new Date("2025-04-01"),
				createdAt: new Date(),
				deletedAt: null,
			},
			{
				id: "5",
				name: "Campaign E",
				category: "regular",
				status: "active",
				startDate: new Date("2025-03-01"),
				end_date: new Date("2025-04-01"),
				createdAt: new Date(),
				deletedAt: null,
			},
		];

		prismaService.client.campaign.findMany.mockResolvedValue(
			paginationResponse.slice(0, 5),
		);
		prismaService.client.campaign.count.mockResolvedValue(10);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value).toHaveLength(5);
		expect(response.metadata).toMatchObject({
			currentPage: 1,
			perPage: 5,
			total: 10,
			totalPages: 2,
			hasPrevPage: false,
			hasNextPage: true,
		});
	});

	it("should search campaigns by name with partial match", async () => {
		const matchingData = {
			id: "1",
			name: "Summer Campaign",
			category: "seasonal",
			status: "active",
			startDate: new Date("2025-03-01"),
			end_date: new Date("2025-04-01"),
			createdAt: new Date(),
			deletedAt: null,
		};

		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "sum",
			orderBy: "name",
			order: "asc",
		};

		prismaService.client.campaign.findMany.mockResolvedValue([matchingData]);
		prismaService.client.campaign.count.mockResolvedValue(1);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value).toStrictEqual([matchingData]);
		expect(response.metadata.total).toBe(1);
	});

	it("should handle case-insensitive search", async () => {
		const data = {
			id: "1",
			name: "SUMMER Campaign",
			category: "seasonal",
			status: "active",
			startDate: new Date("2025-03-01"),
			end_date: new Date("2025-04-01"),
			createdAt: new Date(),
			deletedAt: null,
		};

		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "summer",
			orderBy: "name",
			order: "asc",
		};

		prismaService.client.campaign.findMany.mockResolvedValue([data]);
		prismaService.client.campaign.count.mockResolvedValue(1);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value).toStrictEqual([data]);
		expect(response.metadata.total).toBe(1);
	});

	it("should return all campaigns for empty search", async () => {
		const data1 = {
			id: "1",
			name: "Campaign One",
			category: "seasonal",
			status: "active",
			startDate: new Date("2025-03-01"),
			end_date: new Date("2025-04-01"),
			createdAt: new Date(),
			deletedAt: null,
		};

		const data2 = {
			id: "2",
			name: "Campaign Two",
			category: "regular",
			status: "active",
			startDate: new Date("2025-03-01"),
			end_date: new Date("2025-04-01"),
			createdAt: new Date(),
			deletedAt: null,
		};

		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "",
			orderBy: "name",
			order: "asc",
		};

		prismaService.client.campaign.findMany.mockResolvedValue([data1, data2]);
		prismaService.client.campaign.count.mockResolvedValue(2);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value).toStrictEqual([data1, data2]);
		expect(response.metadata.total).toBe(2);
	});

	it("should order by createdAt ascending", async () => {
		const dataOld = {
			id: "1",
			name: "Older Campaign",
			category: "seasonal",
			status: "active",
			startDate: new Date("2025-03-01"),
			end_date: new Date("2025-04-01"),
			createdAt: new Date("2025-01-01"),
			deletedAt: null,
		};

		const dataNew = {
			id: "2",
			name: "Newer Campaign",
			category: "regular",
			status: "active",
			startDate: new Date("2025-03-01"),
			end_date: new Date("2025-04-01"),
			createdAt: new Date("2025-02-01"),
			deletedAt: null,
		};

		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "",
			orderBy: "createdAt",
			order: "asc",
		};

		prismaService.client.campaign.findMany.mockResolvedValue([
			dataOld,
			dataNew,
		]);
		prismaService.client.campaign.count.mockResolvedValue(2);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value[0]).toStrictEqual(dataOld);
		expect(response.value[1]).toStrictEqual(dataNew);
		expect(response.metadata.total).toBe(2);
	});

	it("should order by name descending", async () => {
		const dataA = {
			id: "1",
			name: "Zebra Campaign",
			category: "seasonal",
			status: "active",
			startDate: new Date("2025-03-01"),
			end_date: new Date("2025-04-01"),
			createdAt: new Date(),
			deletedAt: null,
		};

		const dataB = {
			id: "2",
			name: "Apple Campaign",
			category: "regular",
			status: "active",
			startDate: new Date("2025-03-01"),
			end_date: new Date("2025-04-01"),
			createdAt: new Date(),
			deletedAt: null,
		};

		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "",
			orderBy: "name",
			order: "desc",
		};

		prismaService.client.campaign.findMany.mockResolvedValue([dataA, dataB]);
		prismaService.client.campaign.count.mockResolvedValue(2);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value[0]).toStrictEqual(dataA);
		expect(response.value[1]).toStrictEqual(dataB);
		expect(response.metadata.total).toBe(2);
	});

	it("should handle page beyond total pages", async () => {
		const query: QueryableDTO = {
			page: 10,
			limit: 1,
			search: "",
			orderBy: "name",
			order: "asc",
		};

		const mockData = [];

		prismaService.client.campaign.findMany.mockResolvedValue(mockData);
		prismaService.client.campaign.count.mockResolvedValue(0);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value).toStrictEqual(mockData);
		expect(response.metadata).toMatchObject({
			currentPage: 10,
			perPage: 1,
			total: 0,
			totalPages: 0,
			hasPrevPage: false,
			hasNextPage: false,
		});
	});

	it("should handle invalid page number", async () => {
		const query: QueryableDTO = {
			page: -1,
			limit: 10,
			search: "",
			orderBy: "name",
			order: "asc",
		};

		const mockData = [];

		prismaService.client.campaign.findMany.mockResolvedValue(mockData);
		prismaService.client.campaign.count.mockResolvedValue(0);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value).toStrictEqual(mockData);
		expect(response.metadata).toMatchObject({
			currentPage: 1,
			perPage: 10,
			total: 0,
			totalPages: 0,
			hasPrevPage: false,
			hasNextPage: false,
		});
	});

	it("should handle zero limit", async () => {
		const query: QueryableDTO = {
			page: 1,
			limit: 0,
			search: "",
			orderBy: "name",
			order: "asc",
		};

		const mockData = [];

		prismaService.client.campaign.findMany.mockResolvedValue(mockData);
		prismaService.client.campaign.count.mockResolvedValue(0);

		const response = await repository.getAll(query);

		expect(response.isSuccess).toBe(true);
		expect(response.isFailure).toBe(false);
		expect(response.value).toStrictEqual(mockData);
		expect(response.metadata).toMatchObject({
			currentPage: 1,
			perPage: 1,
			total: 0,
			totalPages: 0,
			hasPrevPage: false,
			hasNextPage: false,
		});
	});
});

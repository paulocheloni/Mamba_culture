import { TestBed } from "@suites/unit";
import { SearchCampaignPrismaRepository } from "./search-campaign-prisma.repository";
import { PrismaService } from "src/shared/infra/prisma/prisma-extended.service";
import type { QueryableDTO } from "src/campaign/domain/campaign/repository/campaign.repository.interface";

describe("SearchCampaignPrismaRepository", () => {
	let repository: SearchCampaignPrismaRepository;
	let prismaService: any;

	beforeAll(async () => {
		const { unit, unitRef } = await TestBed.solitary(
			SearchCampaignPrismaRepository,
		).compile();
		repository = unit;
		prismaService = unitRef.get(PrismaService);
	});

	beforeEach(() => {
		prismaService.client.campaign.paginate.mockReset();
	});

	it("should be defined", () => {
		expect(repository).toBeDefined();
	});

	it("should perform a successful search with results", async () => {
		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "campaign",
			orderBy: "name",
			order: "asc",
		};

		const mockResponse = {
			result: [
				{
					id: "1",
					name: "Campaign One",
					category: "seasonal",
					status: "active",
					createdAt: new Date(),
					startDate: new Date(),
					endDate: new Date(),
					deletedAt: null,
				},
				{
					id: "2",
					name: "Campaign Two",
					category: "regular",
					status: "paused",
					createdAt: new Date(),
					startDate: new Date(),
					endDate: new Date(),
					deletedAt: null,
				},
			],
			page: 1,
			limit: 10,
			count: 2,
			totalPages: 1,
			hasPrevPage: false,
			hasNextPage: false,
		};

		prismaService.client.campaign.paginate.mockResolvedValue(mockResponse);

		const result = await repository.getAll(query);

		expect(result.isSuccess).toBe(true);
		expect(result.isFailure).toBe(false);
		expect(result.error).toBeUndefined();
		expect(result.value).toStrictEqual(mockResponse.result);
		expect(result.metadata).toStrictEqual({
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

		const noResultsResponse = {
			result: [],
			page: 1,
			limit: 10,
			count: 0,
			totalPages: 0,
			hasPrevPage: false,
			hasNextPage: false,
		};

		prismaService.client.campaign.paginate.mockResolvedValue(noResultsResponse);

		const result = await repository.getAll(query);

		expect(result.isSuccess).toBe(true);
		expect(result.isFailure).toBe(false);
		expect(result.value).toStrictEqual([]);
		expect(result.metadata).toStrictEqual({
			currentPage: 1,
			perPage: 10,
			total: 0,
			totalPages: 0,
			hasPrevPage: false,
			hasNextPage: false,
		});
	});

	it("should handle errors gracefully", async () => {
		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "campaign",
			orderBy: "name",
			order: "asc",
		};

		const error = new Error("Database error");
		prismaService.client.campaign.paginate.mockRejectedValue(error);

		const result = await repository.getAll(query);

		expect(result.isSuccess).toBe(false);
		expect(result.isFailure).toBe(true);
		expect(result.error).toStrictEqual(error);
		expect(result.value).toStrictEqual([]);
		expect(result.metadata).toBeUndefined();
	});

	it("should handle pagination correctly with multiple pages", async () => {
		const query: QueryableDTO = {
			page: 1,
			limit: 5,
			search: "campaign",
			orderBy: "name",
			order: "asc",
		};

		const paginationResponse = {
			result: [
				{
					id: "2",
					name: "Campaign B",
					category: "regular",
					status: "paused",
					createdAt: new Date(),
					startDate: new Date(),
					endDate: new Date(),
					deletedAt: null,
				},
				{
					id: "1",
					name: "Campaign A",
					category: "seasonal",
					status: "active",
					createdAt: new Date(),
					startDate: new Date(),
					endDate: new Date(),
					deletedAt: null,
				},
				{
					id: "3",
					name: "Campaign C",
					category: "regular",
					status: "active",
					createdAt: new Date(),
					startDate: new Date(),
					endDate: new Date(),
					deletedAt: null,
				},
				{
					id: "4",
					name: "Campaign D",
					category: "seasonal",
					status: "active",
					createdAt: new Date(),
					startDate: new Date(),
					endDate: new Date(),
					deletedAt: null,
				},
				{
					id: "5",
					name: "Campaign E",
					category: "regular",
					status: "active",
					createdAt: new Date(),
					startDate: new Date(),
					endDate: new Date(),
					deletedAt: null,
				},
			],
			page: 1,
			limit: 5,
			count: 10,
			totalPages: 2,
			hasPrevPage: false,
			hasNextPage: true,
		};

		prismaService.client.campaign.paginate.mockResolvedValue(
			paginationResponse,
		);

		const result = await repository.getAll(query);

		expect(result.isSuccess).toBe(true);
		expect(result.isFailure).toBe(false);
		expect(result.value).toStrictEqual(paginationResponse.result);
		expect(result.metadata).toStrictEqual({
			currentPage: 1,
			perPage: 5,
			total: 10,
			totalPages: 2,
			hasPrevPage: false,
			hasNextPage: true,
		});
	});

	it("should pass the correct where clause to Prisma", async () => {
		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "campaign",
			orderBy: "name",
			order: "asc",
		};

		const expectedWhere = {
			name: { contains: "campaign" },
			deletedAt: null,
		};

		const mockResponse = {
			result: [],
			page: 1,
			limit: 10,
			count: 0,
			totalPages: 0,
			hasPrevPage: false,
			hasNextPage: false,
		};

		prismaService.client.campaign.paginate.mockResolvedValue(mockResponse);

		await repository.getAll(query);

		expect(prismaService.client.campaign.paginate).toHaveBeenCalledWith({
			page: 1,
			limit: 10,
			where: expectedWhere,
			distinct: ["id"],
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
			orderBy: { name: "asc" },
		});
	});

	it("should handle empty search correctly", async () => {
		const query: QueryableDTO = {
			page: 1,
			limit: 10,
			search: "",
			orderBy: "name",
			order: "asc",
		};

		const mockResponse = {
			result: [
				{
					id: "1",
					name: "Campaign One",
					category: "seasonal",
					status: "active",
					createdAt: new Date(),
					startDate: new Date(),
					endDate: new Date(),
					deletedAt: null,
				},
			],
			page: 1,
			limit: 10,
			count: 1,
			totalPages: 1,
			hasPrevPage: false,
			hasNextPage: false,
		};

		prismaService.client.campaign.paginate.mockResolvedValue(mockResponse);

		const result = await repository.getAll(query);

		expect(result.isSuccess).toBe(true);
		expect(result.isFailure).toBe(false);
		expect(result.value).toStrictEqual(mockResponse.result);
		expect(result.metadata).toStrictEqual({
			currentPage: 1,
			perPage: 10,
			total: 1,
			totalPages: 1,
			hasPrevPage: false,
			hasNextPage: false,
		});
	});
});

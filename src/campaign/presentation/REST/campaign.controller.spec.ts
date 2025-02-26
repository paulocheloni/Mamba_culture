import { CreateCampaignUseCase } from "src/campaign/application/create-campaign/create-campaign.usecase";
import { CampaignController } from "./campaign.controller";
import { TestBed } from "@suites/unit";
import type { Mocked } from "@suites/doubles.jest";
import { CreateCampaignBodyDto } from "./dto/request/create-campaign-body.dto";
import { GetCampaignUseCase } from "src/campaign/application/get-campaign/get-campaign.usecase";
import { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import { CampaignBuilder } from "src/campaign/domain/campaign/builder/campaign.builder";
import { DeleteCampaignUseCase } from "src/campaign/application/delete-campaign/delete-campaign.usecase";
import { SearchMetadataDTO } from "src/shared/infra/result/search.metadata.dto";
import { SearchCampaignDTO } from "src/campaign/infra/repository/prisma/dto/search-campaign.dto";
import { GetCampaignResponseDto } from "./dto/response/get-campaign/get-campaign.response.dto";
import { SearchCampaignPrismaRepository } from "src/campaign/infra/repository/prisma/search-campaign-prisma.repository";

describe("CampaignController", () => {
	let controller: CampaignController;
	let createCampaignUseCase: Mocked<CreateCampaignUseCase>;
	let getCampaignUseCase: Mocked<GetCampaignUseCase>;
	let deleteCampaignUseCase: Mocked<DeleteCampaignUseCase>;
	let campaignRepository: Mocked<SearchCampaignPrismaRepository>;

	beforeEach(async () => {
		const { unit, unitRef } =
			await TestBed.solitary(CampaignController).compile();
		controller = unit;
		createCampaignUseCase = unitRef.get(CreateCampaignUseCase);
		getCampaignUseCase = unitRef.get(GetCampaignUseCase);
		deleteCampaignUseCase = unitRef.get(DeleteCampaignUseCase);
		campaignRepository = unitRef.get(SearchCampaignPrismaRepository);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("createCampaign", () => {
		it("should call createCampaignUsecase.execute with the correct data", () => {
			const data = new CreateCampaignBodyDto();
			jest.spyOn(createCampaignUseCase, "execute").mockReturnValue(
				Promise.resolve({
					isFailure: false,
					error: null,
					value: void 0,
					isSuccess: true,
				}),
			);

			controller.createCampaign(data);

			expect(createCampaignUseCase.execute).toHaveBeenCalledWith(data);
		});
	});

	describe("createCampaign", () => {
		it("should return the result of createCampaignUsecase.execute", async () => {
			const data = new CreateCampaignBodyDto();
			const result = void 0;
			jest
				.spyOn(createCampaignUseCase, "execute")
				.mockReturnValue(Promise.resolve(result));

			const response = await controller.createCampaign(data);

			expect(response).toBe(result);
		});
	});

	describe("getCampaign", () => {
		it("should be defined", () => {
			expect(controller.getCampaign).toBeDefined();
		});

		it("should return a campaign", async () => {
			const result = Campaign.create({
				id: "123",
				name: "My Campaign",
				category: "regular",
				startDate: new Date("2023-01-01"),
				endDate: new Date("2023-12-31"),
				createdAt: new Date("2023-01-01"),
				status: "active",
			});
			jest
				.spyOn(getCampaignUseCase, "execute")
				.mockReturnValue(Promise.resolve(result));

			const response = await controller.getCampaign("123");
			expect(response.value.category).toBe("regular");
			expect(response.value.name).toBe("My Campaign");
			expect(response.value.startDate).toEqual(new Date("2023-01-01"));
			expect(response.value.endDate).toEqual(new Date("2023-12-31"));
			expect(response.value.createdAt).toBeInstanceOf(Date);
			expect(response.value.status).toBe("expired");
		});

		it("should throw an error if the campaign does not exist", async () => {
			jest
				.spyOn(getCampaignUseCase, "execute")
				.mockReturnValue(Promise.reject(new Error("Campaign not found")));
			expect(() => controller.getCampaign("123")).rejects.toThrow(
				"Campaign not found",
			);
		});
	});

	describe("deleteCampaign", () => {
		it("should be defined", () => {
			expect(controller.deleteCampaign).toBeDefined();
		});

		it("should call deleteCampaignUsecase.execute with the correct data", () => {
			const campaign = new CampaignBuilder().aCampaign();
			jest.spyOn(createCampaignUseCase, "execute").mockReturnValue(
				Promise.resolve({
					isFailure: false,
					error: null,
					value: void 0,
					isSuccess: true,
				}),
			);

			controller.deleteCampaign(campaign.value.id);
		});

		it("should return the result of deleteCampaignUsecase.execute", async () => {
			const campaign = new CampaignBuilder().aCampaign();
			const result = void 0;
			jest
				.spyOn(createCampaignUseCase, "execute")
				.mockReturnValue(Promise.resolve(result));

			const response = await controller.deleteCampaign(campaign.value.id);

			expect(response).toBe(result);
		});

		it("should throw an error if the campaign does not exist", async () => {
			jest
				.spyOn(deleteCampaignUseCase, "execute")
				.mockRejectedValue(new Error("Campaign not found"));
			expect(() => controller.deleteCampaign("123")).rejects.toThrow(
				"Campaign not found",
			);
		});
	});

	describe("getAllCampaigns", () => {
		it("should be defined", () => {
			expect(controller.getAllCampaigns).toBeDefined();
		});

		it("should call repository.getAll", async () => {
			const campaigns = [
				new CampaignBuilder().aCampaign(),
				new CampaignBuilder().aCampaign(),
			];
			const result = campaigns.map((c) => c.value);
			const metadata = new SearchMetadataDTO();

			const dtos = result.map((c) => new GetCampaignResponseDto(c));
			const resultDTO = new SearchCampaignDTO(dtos);
			resultDTO.metadata = metadata;
			resultDTO.value = dtos;
			resultDTO.isSuccess = true;
			resultDTO.isFailure = false;
			resultDTO.error = undefined;

			jest.spyOn(campaignRepository, "getAll").mockResolvedValue(resultDTO);

			await controller.getAllCampaigns({
				category: "regular",
				status: "active",
			});

			expect(campaignRepository.getAll).toHaveBeenCalled();
			expect(campaignRepository.getAll).toHaveBeenCalledWith({
				category: "regular",
				status: "active",
			});
		});

		it("should return the campaigns", async () => {
			const campaigns = [
				new CampaignBuilder().aCampaign(),
				new CampaignBuilder().aCampaign(),
			];
			const result = campaigns.map((c) => c.value);
			const metadata = new SearchMetadataDTO();

			const dtos = result.map(
				(c) =>
					new GetCampaignResponseDto({
						id: c.id,
						name: c.name,
						category: c.category,
						status: c.status,
						startDate: c.startDate,
						endDate: c.endDate,
						createdAt: c.createdAt,
					}),
			);
			const resultDTO = new SearchCampaignDTO(dtos);
			resultDTO.value = dtos;
			resultDTO.isSuccess = true;
			resultDTO.isFailure = false;
			resultDTO.error = undefined;
			resultDTO.metadata = metadata;
			jest.spyOn(campaignRepository, "getAll").mockResolvedValue(resultDTO);

			const response = await controller.getAllCampaigns({});

			expect(response).toHaveProperty("value");
			expect(response.value).toHaveLength(2);
			expect(response.error).toBeUndefined();
			expect(response.isSuccess).toBe(true);
			expect(response.isFailure).toBe(false);
			expect(response.value).toMatchObject(dtos);
		});
	});
});

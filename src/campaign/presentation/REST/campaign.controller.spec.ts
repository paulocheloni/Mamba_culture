import { CreateCampaignUseCase } from "src/campaign/application/create-campaign/create-campaign.usecase";
import { CampaignController } from "./campaign.controller";
import { TestBed } from "@suites/unit";
import type { Mocked } from "@suites/doubles.jest";
import { CreateCampaignBodyDto } from "./dto/request/create-campaign-body.dto";
import { GetCampaignUseCase } from "src/campaign/application/get-campaign/get-campaign.usecase";
import { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import { CampaignBuilder } from "src/campaign/domain/campaign/builder/campaign.builder";
import { DeleteCampaignUseCase } from "src/campaign/application/delete-campaign/delete-campaign.usecase";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { Result } from "src/shared/domain/result/result";

describe("CampaignController", () => {
	let controller: CampaignController;
	let createCampaignUseCase: Mocked<CreateCampaignUseCase>;
	let getCampaignUseCase: Mocked<GetCampaignUseCase>;
	let deleteCampaignUseCase: Mocked<DeleteCampaignUseCase>;
	let campaignRepository: Mocked<ICampaignRepository>;

	beforeEach(async () => {
		const { unit, unitRef } =
			await TestBed.solitary(CampaignController).compile();
		controller = unit;
		createCampaignUseCase = unitRef.get(CreateCampaignUseCase);
		getCampaignUseCase = unitRef.get(GetCampaignUseCase);
		deleteCampaignUseCase = unitRef.get(DeleteCampaignUseCase);
		campaignRepository = unitRef.get(ICampaignRepository);
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

			jest
				.spyOn(campaignRepository, "getAll")
				.mockResolvedValue(Result.ok(result));

			await controller.getAllCampaigns({});

			expect(campaignRepository.getAll).toHaveBeenCalled();
			expect(campaignRepository.getAll).toHaveBeenCalledWith({});
		});

		it("should return the campaigns", async () => {
			const campaigns = [
				new CampaignBuilder().aCampaign(),
				new CampaignBuilder().aCampaign(),
			];
			const result = campaigns.map((c) => c.value);
			jest
				.spyOn(campaignRepository, "getAll")
				.mockResolvedValue(Result.ok(result));

			const response = await controller.getAllCampaigns({});

			expect(response).toHaveProperty("value");
			expect(response.value).toHaveLength(2);
			expect(response.error).toBeUndefined();
			expect(response.isSuccess).toBe(true);
			expect(response.isFailure).toBe(false);
			expect(response.value).toMatchObject(result);
		});
	});
});

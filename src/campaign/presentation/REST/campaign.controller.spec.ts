import { CreateCampaignUseCase } from "src/campaign/application/create-campaign/create-campaign.usecase";
import { CampaignController } from "./campaign.controller";
import { TestBed } from "@suites/unit";
import type { Mocked } from "@suites/doubles.jest";
import { CreateCampaignBodyDto } from "./dto/create-campaign-body.dto";
import { GetCampaignUseCase } from "src/campaign/application/get-campaign/get-campaign.usecase";

describe("CampaignController", () => {
	let controller: CampaignController;
	let createCampaignUseCase: Mocked<CreateCampaignUseCase>;
	let getCampaignUseCase: Mocked<GetCampaignUseCase>;

	beforeEach(async () => {
		const { unit, unitRef } =
			await TestBed.solitary(CampaignController).compile();
		controller = unit;
		createCampaignUseCase = unitRef.get(CreateCampaignUseCase);
		getCampaignUseCase = unitRef.get(GetCampaignUseCase);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("createCampaign", () => {
		it("should call createCampaignUsecase.execute with the correct data", () => {
			const data = new CreateCampaignBodyDto();
			jest
				.spyOn(createCampaignUseCase, "execute")
				.mockReturnValue(Promise.resolve());

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
			jest.spyOn(getCampaignUseCase, "execute").mockReturnValue(
				Promise.resolve({
					id: "123",
					name: "My Campaign",
					category: "Marketing",
					startDate: new Date("2023-01-01"),
					endDate: new Date("2023-12-31"),
					createdAt: new Date(),
					status: "active",
				}),
			);

			const response = await controller.getCampaign("123");
			expect(response.category).toBe("Marketing");
			expect(response.name).toBe("My Campaign");
			expect(response.startDate).toEqual(new Date("2023-01-01"));
			expect(response.endDate).toEqual(new Date("2023-12-31"));
			expect(response.createdAt).toBeInstanceOf(Date);
			expect(response.status).toBe("active");
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
});

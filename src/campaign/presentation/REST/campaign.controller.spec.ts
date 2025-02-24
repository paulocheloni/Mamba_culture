import { CreateCampaignUseCase } from "src/campaign/application/create-campaign.usecase";
import { CampaignController } from "./campaign.controller";
import { TestBed } from "@suites/unit";
import type { Mocked } from "@suites/doubles.jest";
import { CreateCampaignBodyDto } from "./dto/create-campaign-body.dto";

describe("CampaignController", () => {
	let controller: CampaignController;
	let createCampaignUseCase: Mocked<CreateCampaignUseCase>;

	beforeEach(async () => {
		const { unit, unitRef } =
			await TestBed.solitary(CampaignController).compile();
		controller = unit;
		createCampaignUseCase = unitRef.get(CreateCampaignUseCase);
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
});

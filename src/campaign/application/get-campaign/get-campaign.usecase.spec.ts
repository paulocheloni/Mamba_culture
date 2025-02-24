import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { GetCampaignUseCase } from "./get-campaign.usecase";
import { TestBed } from "@suites/unit";

describe("GetCampaignUsecase", () => {
	let usecase: GetCampaignUseCase;
	let repository: ICampaignRepository;

	beforeAll(async () => {
		const { unit, unitRef } =
			await TestBed.solitary(GetCampaignUseCase).compile();
		usecase = unit;
		repository = unitRef.get(ICampaignRepository);
	});

	it("should be defined", () => {
		expect(usecase).toBeTruthy();
	});
});

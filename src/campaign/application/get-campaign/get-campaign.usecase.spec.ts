import { TestBed } from "@suites/unit";
import { GetCampaignUseCase } from "./get-campaign.usecase";

describe("GetCampaignUsecase", () => {
	let usecase: GetCampaignUseCase;

	beforeAll(async () => {
		const { unit } = await TestBed.solitary(GetCampaignUseCase).compile();
		usecase = unit;
	});

	it("should be defined", () => {
		expect(usecase).toBeTruthy();
	});
});

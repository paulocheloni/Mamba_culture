import type { Mocked } from "@suites/doubles.jest";
import { DeleteCampaignUseCase } from "./delete-campaign.usecase";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { TestBed } from "@suites/unit";
import { CampaignBuilder } from "src/campaign/domain/campaign/builder/campaign.builder";

describe("DeleteCampaignUseCase", () => {
	let useCase: DeleteCampaignUseCase;
	let campaignRepository: Mocked<ICampaignRepository>;

	beforeEach(async () => {
		const { unit, unitRef } = await TestBed.solitary(
			DeleteCampaignUseCase,
		).compile();
		useCase = unit;
		campaignRepository = unitRef.get(ICampaignRepository);
	});

	it("should throw an error if campaign is not found", async () => {
		campaignRepository.getById.mockResolvedValue({
			isSuccess: false,
			isFailure: true,
			error: new Error("Campaign not found"),
		});

		const result = await useCase.execute("123");
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Campaign not found");
	});

	it("should delete campaign if found and then save it", async () => {
		const campaign = new CampaignBuilder().aCampaign();
		campaign.value.delete = jest.fn().mockReturnValue({
			isSuccess: true,
		});

		campaignRepository.getById.mockResolvedValue(campaign);
		await useCase.execute("123");
		expect(campaign.value.delete).toHaveBeenCalled();
		expect(campaignRepository.save).toHaveBeenCalledWith(campaign.value);
	});
});

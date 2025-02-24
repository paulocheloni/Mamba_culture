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
		campaignRepository.getById.mockResolvedValue(null);
		await expect(useCase.execute("nonexistent-id")).rejects.toThrow(
			"Campaign not found",
		);
	});

	it("should delete campaign if found and then save it", async () => {
		const campaign = new CampaignBuilder().aCampaign();
		campaign.delete = jest.fn();

		campaignRepository.getById.mockResolvedValue(campaign);
		await useCase.execute("123");
		expect(campaign.delete).toHaveBeenCalled();
		expect(campaignRepository.save).toHaveBeenCalledWith(campaign);
	});
});

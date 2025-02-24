import { Inject } from "@nestjs/common";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";

export class DeleteCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(id: string) {
		const campaign = await this.campaignRepository.getById(id);
		if (!campaign) {
			throw new Error("Campaign not found");
		}
		campaign.delete();
		return this.campaignRepository.save(campaign);
	}
}

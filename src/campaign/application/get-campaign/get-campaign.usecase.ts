import { Inject } from "@nestjs/common";
import { ICampaignRepository } from "../../domain/campaign/repository/campaign.repository.interface";
import type { Campaign } from "src/campaign/domain/campaign/entity/campaign";
export class GetCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(id: string): Promise<Campaign> {
		const campaign = await this.campaignRepository.getById(id);
		if (!campaign || campaign.isDeleted()) {
			throw new Error("Campaign not found");
		}
		return campaign;
	}
}

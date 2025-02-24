import { Inject } from "@nestjs/common";
import { ICampaignRepository } from "../../domain/campaign/repository/campaign.repository.interface";
export class GetCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(id: string) {
		return this.campaignRepository.getById(id);
	}
}

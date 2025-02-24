import { Inject, Injectable } from "@nestjs/common";
import { ICampaignRepository } from "../../domain/campaign/repository/campaign.repository.interface";
import type { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import { Result } from "src/shared/domain/result/result";

@Injectable()
export class GetCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(id: string): Promise<Result<Campaign>> {
		const campaign = await this.campaignRepository.getById(id);

		if (campaign.isFailure) {
			return Result.fail(campaign.error);
		}
		return campaign;
	}
}

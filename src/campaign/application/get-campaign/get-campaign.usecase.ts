import { Inject, Injectable } from "@nestjs/common";
import { ICampaignRepository } from "../../domain/campaign/repository/campaign.repository.interface";
import type { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import { Result } from "src/shared/domain/result/result";
import { GetCampaignResponseDto } from "src/campaign/presentation/REST/dto/response/get-campaign/get-campaign.response.dto";
import { CampaignError } from "src/shared/domain/errors/campaign-error";

@Injectable()
export class GetCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(id: string): Promise<Result<GetCampaignResponseDto>> {
		const campaign = await this.campaignRepository.getById(id);

		if (campaign.isFailure) {
			return Result.fail(campaign.error);
		}
		return Result.ok(
			new GetCampaignResponseDto({
				id: campaign.value.id,
				name: campaign.value.name,
				status: campaign.value.status,
				category: campaign.value.category,
				createdAt: campaign.value.createdAt,
				startDate: campaign.value.startDate,
				endDate: campaign.value.endDate,
			}),
		);
	}
}

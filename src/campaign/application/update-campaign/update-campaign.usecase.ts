import { Inject } from "@nestjs/common";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import type { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { CampaignBuilder } from "src/campaign/domain/campaign/builder/campaign.builder";
import { Result } from "src/shared/domain/result/result";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";
import { CampaignError } from "src/shared/domain/errors/campaign-error";

export class UpdateCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(dto: UpdateCampaignDto) {
		const campaignExists = await this.campaignRepository.getById(dto.id);

		if (campaignExists.isFailure) {
			return Result.fail(campaignExists.error);
		}
		if (!campaignExists?.value || campaignExists?.value.isDeleted()) {
			return Result.fail(
				new CampaignError(
					CampaignErrorCodes.CAMPAIGN_NOT_FOUND,
					"Campaign not found",
				),
			);
		}

		const campaignNameExists = await this.campaignRepository.getByName(
			dto.name,
		);

		if (campaignNameExists?.isSuccess) {
			return Result.fail(campaignNameExists.error);
		}

		const campaign = new CampaignBuilder()
			.fromCampaign(campaignExists.value)
			.withCategory(dto.category)
			.withCreatedAt(campaignExists.value.createdAt)
			.withEndDate(dto.endDate)
			.withName(dto.name)
			.withStartDate(dto.startDate)
			.withStatus(dto.status)
			.build();
		if (campaign.isFailure) {
			return Result.fail(campaign.error);
		}

		return this.campaignRepository.save(campaign.value);
	}
}

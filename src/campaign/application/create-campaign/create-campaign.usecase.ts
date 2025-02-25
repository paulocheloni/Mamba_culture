import { Inject, Injectable } from "@nestjs/common";
import { ICampaignRepository } from "../../domain/campaign/repository/campaign.repository.interface";
import type { CreateCampaignDto } from "./dto/create-campaign.dto";
import { CampaignBuilder } from "../../domain/campaign/builder/campaign.builder";
import { v4 as uuid } from "uuid";
import { Result } from "src/shared/domain/result/result";
import { CampaignError } from "src/shared/domain/errors/campaign-error";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";

@Injectable()
export class CreateCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(data: CreateCampaignDto): Promise<Result<void>> {
		const campaign = new CampaignBuilder()
			.withCategory(data.category)
			.withCreatedAt(new Date())
			.withEndDate(data.endDate)
			.withId(uuid())
			.withName(data.name)
			.withStartDate(data.startDate)
			.withStatus("active")
			.build();

		if (campaign.isFailure) {
			return Result.fail(campaign.error);
		}

		const campaignNameExists = await this.campaignRepository.getByName(
			data.name,
		);

		if (campaignNameExists?.isSuccess) {
			return Result.fail(
				new CampaignError(CampaignErrorCodes.CAMPAIGN_ALREADY_EXISTS),
			);
		}

		return this.campaignRepository.create(campaign.value);
	}
}

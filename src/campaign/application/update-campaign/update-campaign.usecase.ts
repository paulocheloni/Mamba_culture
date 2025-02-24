import { Inject } from "@nestjs/common";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import type { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { CampaignBuilder } from "src/campaign/domain/campaign/builder/campaign.builder";

export class UpdateCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(dto: UpdateCampaignDto) {
		const campaignExists = await this.campaignRepository.getById(dto.id);

		if (!campaignExists || campaignExists.isDeleted()) {
			throw new Error("Campaign not found");
		}

		const campaign = new CampaignBuilder()
			.fromCampaign(campaignExists)
			.withCategory(dto.category)
			.withCreatedAt(campaignExists.createdAt)
			.withendDate(dto.endDate)
			.withName(dto.name)
			.withstartDate(dto.startDate)
			.withStatus(dto.status)
			.build();

		await this.campaignRepository.save(campaign);
	}
}

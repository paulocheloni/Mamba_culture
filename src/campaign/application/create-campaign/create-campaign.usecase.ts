import { Inject, Injectable } from "@nestjs/common";
import { ICampaignRepository } from "../../domain/campaign/repository/campaign.repository.interface";
import type { CreateCampaignDto } from "./dto/create-campaign.dto";
import { CampaignBuilder } from "../../domain/campaign/builder/campaign.builder";
import { v4 as uuid } from "uuid";

@Injectable()
export class CreateCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(data: CreateCampaignDto) {
		const campaign = new CampaignBuilder()
			.withCategory(data.category)
			.withCreatedAt(new Date())
			.withendDate(data.endDate)
			.withId(uuid())
			.withName(data.name)
			.withstartDate(data.startDate)
			.withStatus("active")
			.build();
		await this.campaignRepository.create(campaign);
	}
}

import { Module } from "@nestjs/common";
import { CampaignController } from "src/campaign/presentation/REST/campaign.controller";
import { CampaignRepository } from "../repository/campaign.repository";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { CreateCampaignUseCase } from "src/campaign/application/create-campaign/create-campaign.usecase";

@Module({
	imports: [],
	controllers: [CampaignController],
	providers: [
		{
			provide: ICampaignRepository,
			useClass: CampaignRepository,
		},
		CreateCampaignUseCase,
	],
})
export class CampaignModule {}

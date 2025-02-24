import { Module } from "@nestjs/common";
import { CampaignController } from "src/campaign/presentation/REST/campaign.controller";
import { CampaignRepository } from "../repository/campaign.repository";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { CreateCampaignUseCase } from "src/campaign/application/create-campaign/create-campaign.usecase";
import { GetCampaignUseCase } from "src/campaign/application/get-campaign/get-campaign.usecase";
import { DeleteCampaignUseCase } from "src/campaign/application/delete-campaign/delete-campaign.usecase";
import { UpdateCampaignUseCase } from "src/campaign/application/update-campaign/update-campaign.usecase";

@Module({
	imports: [],
	controllers: [CampaignController],
	providers: [
		{
			provide: ICampaignRepository,
			useClass: CampaignRepository,
		},
		CreateCampaignUseCase,
		GetCampaignUseCase,
		DeleteCampaignUseCase,
		UpdateCampaignUseCase,
	],
})
export class CampaignModule {}

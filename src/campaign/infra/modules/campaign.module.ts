import { Module } from "@nestjs/common";
import { CampaignController } from "src/campaign/presentation/REST/campaign.controller";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { CreateCampaignUseCase } from "src/campaign/application/create-campaign/create-campaign.usecase";
import { GetCampaignUseCase } from "src/campaign/application/get-campaign/get-campaign.usecase";
import { DeleteCampaignUseCase } from "src/campaign/application/delete-campaign/delete-campaign.usecase";
import { UpdateCampaignUseCase } from "src/campaign/application/update-campaign/update-campaign.usecase";
import { SearchCampaignPrismaRepository } from "../repository/prisma/search-campaign-prisma.repository";
import { CampaignPrismaRepository } from "../repository/prisma/campaign-prisma.repository";

@Module({
	imports: [],
	controllers: [CampaignController],
	providers: [
		{
			provide: ICampaignRepository,
			useClass: CampaignPrismaRepository,
		},
		CreateCampaignUseCase,
		GetCampaignUseCase,
		DeleteCampaignUseCase,
		UpdateCampaignUseCase,
		SearchCampaignPrismaRepository,
	],
})
export class CampaignModule {}

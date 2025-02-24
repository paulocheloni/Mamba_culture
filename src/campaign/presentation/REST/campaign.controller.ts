import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateCampaignUseCase } from "src/campaign/application/create-campaign.usecase";
import type { CreateCampaignBodyDto } from "./dto/create-campaign-body.dto";

@Controller("campaign")
export class CampaignController {
	constructor(
		@Inject(CreateCampaignUseCase)
		private readonly createCampaignUsecase: CreateCampaignUseCase,
	) {}

	@Post("/")
	createCampaign(@Body() data: CreateCampaignBodyDto) {
		return this.createCampaignUsecase.execute(data);
	}
}

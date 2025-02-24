import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
} from "@nestjs/common";
import { CreateCampaignUseCase } from "src/campaign/application/create-campaign/create-campaign.usecase";
import type { CreateCampaignBodyDto } from "./dto/create-campaign-body.dto";
import { GetCampaignUseCase } from "src/campaign/application/get-campaign/get-campaign.usecase";
import { DeleteCampaignUseCase } from "src/campaign/application/delete-campaign/delete-campaign.usecase";

@Controller("campaign")
export class CampaignController {
	constructor(
		@Inject(CreateCampaignUseCase)
		private readonly createCampaignUsecase: CreateCampaignUseCase,
		@Inject(GetCampaignUseCase)
		private readonly getCampaignUsecase: GetCampaignUseCase,
		@Inject(DeleteCampaignUseCase)
		private readonly deleteCampaignUsecase: DeleteCampaignUseCase,
	) {}

	@Post("")
	createCampaign(@Body() data: CreateCampaignBodyDto) {
		return this.createCampaignUsecase.execute(data);
	}

	@Get(":id")
	getCampaign(@Param("id") id: string) {
		return this.getCampaignUsecase.execute(id);
	}

	@Delete(":id")
	deleteCampaign(@Param("id") id: string) {
		return this.deleteCampaignUsecase.execute(id);
	}
}

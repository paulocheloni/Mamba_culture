import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { CreateCampaignUseCase } from "src/campaign/application/create-campaign/create-campaign.usecase";
import { CreateCampaignBodyDto } from "./dto/request/create-campaign-body.dto";
import { GetCampaignUseCase } from "src/campaign/application/get-campaign/get-campaign.usecase";
import { DeleteCampaignUseCase } from "src/campaign/application/delete-campaign/delete-campaign.usecase";
import { UpdateCampaignUseCase } from "src/campaign/application/update-campaign/update-campaign.usecase";
import { GetCampaignQueryDto } from "./dto/request/get-campaign/get-campaign-query.dto";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";

@Controller("campaign")
export class CampaignController {
	constructor(
		@Inject(CreateCampaignUseCase)
		private readonly createCampaignUsecase: CreateCampaignUseCase,
		@Inject(GetCampaignUseCase)
		private readonly getCampaignUsecase: GetCampaignUseCase,
		@Inject(DeleteCampaignUseCase)
		private readonly deleteCampaignUsecase: DeleteCampaignUseCase,
		@Inject(UpdateCampaignUseCase)
		private readonly updateCampaignUsecase: UpdateCampaignUseCase,
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
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

	@Put(":id")
	updateCampaign(@Param("id") id: string, @Body() data: CreateCampaignBodyDto) {
		return this.updateCampaignUsecase.execute({
			id,
			...data,
		});
	}

	/** Only Search methods don't go over usecases. The idea behind this is to have a separate flow for search avoiding extra complixity for database or orm related matters. */
	@Get("")
	getAllCampaigns(@Query() query: GetCampaignQueryDto) {
		return this.campaignRepository.getAll({
			...query,
		});
	}
}

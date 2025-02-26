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
import { QueryableDTO } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetCampaignResponseDto } from "./dto/response/get-campaign/get-campaign.response.dto";
import { Result } from "src/shared/domain/result/result";
import { GetCampaignResponseDtoWithResult } from "./dto/response/get-campaign/get-campaign.result.dto";
import { SearchCampaignDTO } from "src/campaign/infra/repository/prisma/dto/search-campaign.dto";
import { SearchCampaignPrismaRepository } from "src/campaign/infra/repository/prisma/search-campaign-prisma.repository";
import { ICampaign } from "src/campaign/domain/campaign/entity/campaign.interface";

@Controller("campaign")
@ApiTags("Campaign")
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
		@Inject(SearchCampaignPrismaRepository)
		private readonly campaignRepository: SearchCampaignPrismaRepository,
	) {}

	@Post("")
	@ApiBody({ type: CreateCampaignBodyDto })
	@ApiResponse({
		status: 201,
		description: "Created",
		type: Result<ICampaign["id"]>,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 500, description: "Internal Server Error" })
	@ApiResponse({ status: 409, description: "Conflict" })
	async createCampaign(
		@Body() data: CreateCampaignBodyDto,
	): Promise<Result<{ id: string }>> {
		return this.createCampaignUsecase.execute(data);
	}

	@Get(":id")
	@ApiResponse({
		status: 200,
		description: "Ok",
		type: GetCampaignResponseDtoWithResult,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 500, description: "Internal Server Error" })
	@ApiResponse({ status: 404, description: "Not Found" })
	async getCampaign(
		@Param("id") id: string,
	): Promise<Result<GetCampaignResponseDto>> {
		return this.getCampaignUsecase.execute(id);
	}

	@Delete(":id")
	@ApiResponse({ status: 204, description: "Deleted", type: Result<void> })
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 500, description: "Internal Server Error" })
	@ApiResponse({ status: 404, description: "Not Found" })
	async deleteCampaign(@Param("id") id: string): Promise<Result<void>> {
		return this.deleteCampaignUsecase.execute(id);
	}

	@Put(":id")
	@ApiResponse({ status: 200, description: "Ok", type: Result<void> })
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 404, description: "Not Found" })
	@ApiResponse({ status: 500, description: "Internal Server Error" })
	@ApiResponse({ status: 409, description: "Conflict" })
	async updateCampaign(
		@Param("id") id: string,
		@Body("") data: CreateCampaignBodyDto,
	): Promise<Result<void>> {
		return this.updateCampaignUsecase.execute({
			id,
			...data,
		});
	}

	/** Only Search methods don't go over usecases. The idea behind this is to have a separate flow for search avoiding extra complixity for database or orm related matters. */
	@Get("")
	@ApiResponse({
		status: 200,
		description: "Ok",
		type: SearchCampaignDTO,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 500, description: "Internal Server Error" })
	async getAllCampaigns(
		@Query("") query: QueryableDTO,
	): Promise<SearchCampaignDTO> {
		return this.campaignRepository.getAll({
			...query,
		});
	}
}

import { ResultDto } from "src/shared/infra/result/result.dto";
import { GetCampaignResponseDto } from "./get-campaign.response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class GetAllCampaignResultDTO extends ResultDto {
	@Type(() => GetCampaignResponseDto)

	@ApiProperty({ type: GetCampaignResponseDto, isArray: true })
	value: GetCampaignResponseDto[];
}

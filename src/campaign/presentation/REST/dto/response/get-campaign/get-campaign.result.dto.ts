import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ResultDto } from "src/shared/infra/result/result.dto";
import { GetCampaignResponseDto } from "./get-campaign.response.dto";

export class GetCampaignResponseDtoWithResult extends ResultDto {
	@Type(() => GetCampaignResponseDto)
	@ApiProperty({ type: GetCampaignResponseDto })
	value: GetCampaignResponseDto;
}

import { ResultDto } from "src/shared/infra/result/result.dto";
import { GetCampaignResponseDto } from "./get-campaign.response.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class GetCampaignResponseDtoWithResult extends ResultDto {
	@Type(() => GetCampaignResponseDto)
	@ApiProperty({ type: GetCampaignResponseDto })
	value: GetCampaignResponseDto;
}

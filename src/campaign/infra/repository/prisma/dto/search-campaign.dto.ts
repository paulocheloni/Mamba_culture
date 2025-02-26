import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { GetCampaignResponseDto } from "src/campaign/presentation/REST/dto/response/get-campaign/get-campaign.response.dto";
import { SearchResultDTO } from "src/shared/infra/result/search-result.dto";

export class SearchCampaignDTO extends SearchResultDTO {
	@ApiProperty({
		required: false,
	})
	@Type(() => GetCampaignResponseDto)
	value: GetCampaignResponseDto[];

	constructor(value: GetCampaignResponseDto[]) {
		super();
		Object.assign(this, { value });
	}
}

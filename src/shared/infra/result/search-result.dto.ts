import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ResultDto } from "./result.dto";
import { SearchMetadataDTO } from "./search.metadata.dto";

export class SearchResultDTO extends ResultDto {
	@ApiProperty({
		required: false,
	})
	@Type(() => SearchMetadataDTO)
	metadata: SearchMetadataDTO;
}

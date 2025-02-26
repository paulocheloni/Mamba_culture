import { Type } from "class-transformer";
import { ResultDto } from "./result.dto";
import { SearchMetadataDTO } from "./search.metadata.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SearchResultDTO extends ResultDto {
	@ApiProperty({
		required: false,
	})
	@Type(() => SearchMetadataDTO)
	metadata: SearchMetadataDTO;
}

import { ApiProperty } from "@nestjs/swagger";

export class SearchMetadataDTO {
	@ApiProperty({ required: false })
	total?: number;

	@ApiProperty({ required: false })
	totalPages?: number;

	@ApiProperty({ required: false })
	currentPage?: number;

	@ApiProperty({ required: false })
	perPage?: number;

	@ApiProperty({ required: false })
	search?: string;

	@ApiProperty({ required: false })
	nextPage?: string;

	@ApiProperty({ required: false })
	hasPrevPage?: boolean;

	@ApiProperty({ required: false })
	hasNextPage?: boolean;
}

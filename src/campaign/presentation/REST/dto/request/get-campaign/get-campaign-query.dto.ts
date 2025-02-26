import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class GetCampaignQueryDto {
	@ApiProperty({
		required: false,
	})
	@Type(() => Number)
	@IsNumber()
	page? = 1;

	@ApiProperty({
		required: false,
	})
	@IsNumber()
	@Type(() => Number)
	limit? = 10;

	@ApiProperty({
		required: false,
	})
	@IsString()
	@IsOptional()
	category?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsEnum(["active", "paused"])
	status? = "active";

	@ApiProperty({
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	includeDeleted? = false;

	@ApiProperty({
		required: false,
	})
	@IsEnum(["asc", "desc"])
	@IsOptional()
	order? = "asc";

	@ApiProperty({
		required: false,
	})
	@MaxLength(30)
	@IsOptional()
	orderBy? = "createdAt";

	@ApiProperty({
		required: false,
	})
	@MaxLength(255)
	@IsOptional()
	search?: string;
}

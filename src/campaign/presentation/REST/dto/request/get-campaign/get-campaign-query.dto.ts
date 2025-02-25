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
	@Type(() => Number)
	@IsNumber()
	page? = 1;

	@IsNumber()
	@Type(() => Number)
	limit? = 10;

	@IsString()
	@IsOptional()
	category?: string;

	@IsOptional()
	@IsEnum(["active", "paused"])
	status? = "active";

	@IsBoolean()
	@IsOptional()
	includeDeleted? = false;

	@IsEnum(["asc", "desc"])
	@IsOptional()
	order? = "asc";

	@MaxLength(30)
	@IsOptional()
	orderBy? = "createdAt";

	@MaxLength(255)
	@IsOptional()
	search?: string;
}

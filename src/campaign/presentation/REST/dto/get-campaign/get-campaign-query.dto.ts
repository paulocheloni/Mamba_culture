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
	@IsNumber()
	@IsOptional()
	page? = 1;
	@Type(() => Number)

	@IsNumber()
	limit? = 10;
	@Type(() => Number)

	@IsString()
	category?: string;

	@IsEnum(["active", "paused"])
	status?: string;

	@IsBoolean()
	includeDeleted?: boolean;

	@IsEnum(["asc", "desc"])
	order?: string;

	@MaxLength(30)
	orderBy?: string;

	@MaxLength(255)
	search?: string;
}

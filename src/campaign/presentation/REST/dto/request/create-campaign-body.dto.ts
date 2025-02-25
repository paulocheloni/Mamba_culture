import { Transform, Type } from "class-transformer";
import {
	IsDate,
	IsEnum,
	IsISO8601,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateCampaignBodyDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEnum(["seasonal", "regular", "special"])
	@IsNotEmpty()
	category: "seasonal" | "regular" | "special";

	@IsDate()
	@Transform(({ value }) => new Date(value))
	@IsNotEmpty()
	startDate: Date;

	@IsDate()
	@Transform(({ value }) => new Date(value))
	endDate: Date;

	@IsOptional()
	@IsEnum(["active", "paused"])
	status?: "active" | "paused";
}

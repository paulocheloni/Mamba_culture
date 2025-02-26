import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateCampaignBodyDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsEnum(["seasonal", "regular", "special"])
	@IsNotEmpty()
	category: "seasonal" | "regular" | "special";

	@IsDate()
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	@IsNotEmpty()
	startDate: Date;

	@IsDate()
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	endDate: Date;

	@IsOptional()
	@ApiProperty()
	@IsEnum(["active", "paused"])
	status?: "active" | "paused";
}

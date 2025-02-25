import { IsDate, IsNotEmpty, IsString } from "@nestjs/class-validator";
import { IsEnum, IsOptional } from "class-validator";

export class CreateCampaignBodyDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEnum(["seasonal", "regular", "special"])
	@IsNotEmpty()
	category: "seasonal" | "regular" | "special";

	@IsDate()
	@IsNotEmpty()
	startDate: Date;

	@IsDate()
	@IsNotEmpty()
	endDate: Date;

	@IsOptional()
	@IsEnum(["active", "paused"])
	status?: "active" | "paused";
}

import { IsDate, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CreateCampaignBodyDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	category: string;

	@IsDate()
	@IsNotEmpty()
	startDate: Date;

	@IsDate()
	@IsNotEmpty()
	endDate: Date;
}

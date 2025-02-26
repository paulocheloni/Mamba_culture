import { ApiProperty } from "@nestjs/swagger";

export class GetCampaignResponseDto {
	@ApiProperty()
	id: string;
	@ApiProperty()
	name: string;
	@ApiProperty()
	category: "seasonal" | "regular" | "special";
	@ApiProperty()
	startDate: Date;
	@ApiProperty()
	endDate: Date;
	@ApiProperty()
	status: "active" | "paused" | "expired";
	@ApiProperty()
	createdAt: Date;

	constructor(obj: GetCampaignResponseDto) {
		Object.assign(this, obj);
	}
}

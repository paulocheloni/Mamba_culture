import type { ICampaign } from "src/campaign/domain/campaign/entity/campaign.interface";

export class GetCampaignResponseDto {
	id: string;
	name: string;
	category: "seasonal" | "regular" | "special";
	startDate: Date;
	endDate: Date;
	status: "active" | "paused" | "expired";
	createdAt: Date;

	constructor(props: ICampaign) {
		this.id = props.id;
		this.name = props.name;
		this.category = props.category;
		this.startDate = props.startDate;
		this.endDate = props.endDate;
		this.status = props.status;
		this.createdAt = props.createdAt;
	}
}

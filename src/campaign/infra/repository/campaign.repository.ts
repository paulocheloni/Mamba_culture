import { Injectable } from "@nestjs/common";
import type { ICampaign } from "src/campaign/domain/entity/campaign.interface";
import type { ICampaignRepository } from "src/campaign/domain/repository/campaign.repository.interface";

@Injectable()
export class CampaignRepository implements ICampaignRepository {
	private campaigns: ICampaign[];

	constructor() {
		this.campaigns = [];
	}
	create(campaign: ICampaign): Promise<void> {
		this.campaigns.push(campaign);
		return Promise.resolve();
	}
	save(campaign: ICampaign): Promise<void> {
		const index = this.campaigns.findIndex((c) => c.id === campaign.id);
		this.campaigns[index] = campaign;
		return Promise.resolve();
	}
}

import { Injectable } from "@nestjs/common";
import type { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import type { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";

@Injectable()
export class CampaignRepository implements ICampaignRepository {
	private campaigns: Campaign[];

	constructor() {
		this.campaigns = [];
	}
	getById(id: string): Promise<Campaign> {
		const campaign = this.campaigns.find((c) => c.id === id);
		if (!campaign) {
			return Promise.reject(new Error("Campaign not found"));
		}

		return Promise.resolve(campaign);
	}
	create(campaign: Campaign): Promise<void> {
		if (this.campaigns.some((c) => c.id === campaign.id)) {
			return Promise.reject(new Error("Campaign already exists"));
		}
		if (this.campaigns.some((c) => c.name === campaign.name)) {
			return Promise.reject(new Error("Campaign name already exists"));
		}

		this.campaigns.push(campaign);
		return Promise.resolve();
	}
	save(campaign: Campaign): Promise<void> {
		if (!this.campaigns.some((c) => c.id === campaign.id)) {
			return Promise.reject(new Error("Campaign not found"));
		}

		if (
			this.campaigns.some(
				(c) => c.name === campaign.name && c.id !== campaign.id,
			)
		) {
			return Promise.reject(new Error("Campaign name already exists"));
		}

		const index = this.campaigns.findIndex((c) => c.id === campaign.id);
		this.campaigns[index] = campaign;
		return Promise.resolve();
	}
}

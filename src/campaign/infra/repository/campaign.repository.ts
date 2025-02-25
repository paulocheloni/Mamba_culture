import { Injectable } from "@nestjs/common";
import type { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import type { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { CampaignError } from "src/shared/domain/errors/campaign-error";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";
import { Result } from "src/shared/domain/result/result";

@Injectable()
export class CampaignRepository implements ICampaignRepository {
	private campaigns: Campaign[];

	constructor() {
		this.campaigns = [];
	}
	getById(id: string): Promise<Result<Campaign>> {
		const index = this.campaigns.findIndex((c) => c.id === id);
		if (index === -1) {
			return Promise.resolve(
				Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAING_NOT_FOUND,
						"Campaign not found",
					),
				),
			);
		}

		const campaign = this.campaigns[index];

		return Promise.resolve(Result.ok(campaign));
	}
	create(campaign: Campaign): Promise<Result<void>> {
		this.campaigns.push(campaign);
		return Promise.resolve(Result.ok());
	}
	save(campaign: Campaign): Promise<Result<void>> {
		const index = this.campaigns.findIndex((c) => c.id === campaign.id);
		if (index === -1) {
			return Promise.resolve(
				Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAING_NOT_FOUND,
						"Campaign not found",
					),
				),
			);
		}
		this.campaigns[index] = campaign;
		return Promise.resolve(Result.ok());
	}

	getAll(): Promise<Result<Campaign[]>> {
		return Promise.resolve(Result.ok(this.campaigns));
	}

	getByName(name: string): Promise<Result<Campaign>> {
		const index = this.campaigns.findIndex((c) => c.name === name);
		if (index === -1) {
			return Promise.resolve(
				Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAING_NOT_FOUND,
						"Campaign not found",
					),
				),
			);
		}
		const campaign = this.campaigns[index];

		return Promise.resolve(Result.ok(campaign));
	}
}

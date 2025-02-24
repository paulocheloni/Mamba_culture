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
		const campaign = this.campaigns.find((c) => c.id === id);
		if (!campaign) {
			return Promise.resolve(
				Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAING_NOT_FOUND,
						"Campaign not found",
					),
				),
			);
		}

		return Promise.resolve(Result.ok(campaign));
	}
	create(campaign: Campaign): Promise<Result<void>> {
		if (this.campaigns.some((c) => c.id === campaign.id)) {
			return Promise.resolve(
				Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAIGN_ALREADY_EXISTS,
						"Campaign already exists",
					),
				),
			);
		}
		if (this.campaigns.some((c) => c.name === campaign.name)) {
			return Promise.resolve(
				Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAIGN_ALREADY_EXISTS,
						"Campaign already exists",
					),
				),
			);
		}

		this.campaigns.push(campaign);
		return Promise.resolve(Result.ok());
	}
	save(campaign: Campaign): Promise<Result<void>> {
		if (!this.campaigns.some((c) => c.id === campaign.id)) {
			return Promise.resolve(
				Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAING_NOT_FOUND,
						"Campaign not found",
					),
				),
			);
		}

		if (
			this.campaigns.some(
				(c) => c.name === campaign.name && c.id !== campaign.id,
			)
		) {
			return Promise.resolve(
				Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAIGN_ALREADY_EXISTS,
						"Campaign name already exists",
					),
				),
			);
		}

		const index = this.campaigns.findIndex((c) => c.id === campaign.id);
		this.campaigns[index] = campaign;
		return Promise.resolve(Result.ok());
	}

	getAll(): Promise<Result<Campaign[]>> {
		return Promise.resolve(Result.ok(this.campaigns));
	}
}

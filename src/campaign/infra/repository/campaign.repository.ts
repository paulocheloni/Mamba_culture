import { Injectable } from "@nestjs/common";
import type { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import type { ICampaign } from "src/campaign/domain/campaign/entity/campaign.interface";
import type { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { CampaignError } from "src/shared/domain/errors/campaign-error";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";
import { TestableRepository } from "src/shared/domain/repository/testable.repository";
import { Result } from "src/shared/domain/result/result";

@Injectable()
export class CampaignRepository
	extends TestableRepository
	implements ICampaignRepository
{
	private campaigns: Campaign[];

	constructor() {
		super();

		this.campaigns = [];
	}

	protected callReset(): void {
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

		if (campaign.isDeleted()) {
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

	getAll(): Promise<Result<ICampaign[]>> {
		return Promise.resolve(
			Result.ok(
				this.campaigns
					.filter((c) => !c.isDeleted())
					.map((c) => {
						return {
							id: c.id,
							name: c.name,
							category: c.category,
							status: c.status,
							createdAt: c.createdAt,
							startDate: c.startDate,
							endDate: c.endDate,
						};
					}),
			),
		);
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

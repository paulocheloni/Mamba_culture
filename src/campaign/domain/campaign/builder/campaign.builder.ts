import { Result } from "src/shared/domain/result/result";
import { Campaign } from "../entity/campaign";
import {
	CampaignCategory,
	CampaignStatus,
	type ICampaign,
} from "../entity/campaign.interface";
import { v4 as uuid } from "uuid";
import { CampaignError } from "src/shared/domain/errors/campaign-error";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";

export class CampaignBuilder {
	private _id?: string;
	private _name?: string;
	private _status?: keyof typeof CampaignStatus;
	private _category?: keyof typeof CampaignCategory;
	private _createdAt?: Date;
	private _startDate?: Date;
	private _endDate?: Date;

	withId(id: string): this {
		this._id = id;
		return this;
	}

	withName(name: string): this {
		this._name = name;
		return this;
	}

	withStatus(status: keyof typeof CampaignStatus): this {
		this._status = status;
		return this;
	}

	withCategory(category: keyof typeof CampaignCategory): this {
		this._category = category;
		return this;
	}

	withCreatedAt(createdAt: Date): this {
		this._createdAt = createdAt;
		return this;
	}

	withStartDate(startDate: Date): this {
		this._startDate = startDate;
		return this;
	}

	withEndDate(endDate: Date): this {
		this._endDate = endDate;
		return this;
	}

	aCampaign(): Result<Campaign> {
		const now = new Date();
		const nexthour = new Date();
		nexthour.setHours(now.getHours() + 1);
		const tomorrow = new Date();
		tomorrow.setDate(now.getDate() + 1);

		return Campaign.create({
			id: uuid(),
			name: "Campaign 1",
			status: "active",
			category: "seasonal",
			createdAt: now,
			startDate: nexthour,
			endDate: tomorrow,
			deletedAt: undefined,
		});
	}

	customCampaign(campaign: Partial<ICampaign>): Result<Campaign> {
		return Campaign.create({
			id: campaign.id ?? uuid(),
			name: campaign.name ?? "Campaign 1",
			status: campaign.status ?? "active",
			category: campaign.category ?? "seasonal",
			createdAt: campaign.createdAt ?? new Date(),
			startDate: campaign.startDate ?? new Date(),
			endDate: campaign.endDate ?? new Date(),
			deletedAt: undefined,
		});
	}

	fromCampaign(campaign: Campaign): this {
		this._id = campaign.id;
		this._name = campaign.name;
		this._status = campaign.status;
		this._category = campaign.category;
		this._createdAt = campaign.createdAt;
		this._startDate = campaign.startDate;
		this._endDate = campaign.endDate;
		return this;
	}

	build(): Result<Campaign> {
		const requiredFields = [
			{ field: this._startDate, code: CampaignErrorCodes.START_DATE_REQUIRED },
			{ field: this._endDate, code: CampaignErrorCodes.END_DATE_REQUIRED },
			{ field: this._createdAt, code: CampaignErrorCodes.CREATED_AT_REQUIRED },
			{ field: this._name, code: CampaignErrorCodes.NAME_REQUIRED },
			{ field: this._status, code: CampaignErrorCodes.STATUS_REQUIRED },
			{ field: this._category, code: CampaignErrorCodes.CATEGORY_REQUIRED },
		];

		for (const { field, code } of requiredFields) {
			if (!field) {
				return Result.fail(new CampaignError(code));
			}
		}

		if (!CampaignStatus[this._status]) {
			return Result.fail(new CampaignError(CampaignErrorCodes.INVALID_STATUS));
		}

		if (!CampaignCategory[this._category]) {
			return Result.fail(
				new CampaignError(CampaignErrorCodes.INVALID_CATEGORY),
			);
		}

		const id = this._id ?? uuid();

		return Campaign.create({
			id,
			name: this._name,
			status: this._status,
			category: this._category,
			createdAt: this._createdAt,
			startDate: this._startDate,
			endDate: this._endDate,
			deletedAt: undefined,
		});
	}
}

// campaign.entity.ts
import { CampaignStatus, type ICampaign } from "./campaign.interface";
import { CampaignError } from "src/shared/domain/errors/campaign-error";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";
import { Result } from "src/shared/domain/result/result";

export enum CampaignErrorDomainCodes {
	START_DATE_BEFORE_CREATED_AT = "START_DATE_BEFORE_CREATED_AT",
	END_DATE_BEFORE_START_DATE = "END_DATE_BEFORE_START_DATE",
	CANNOT_PAUSE_EXPIRED_CAMPAIGN = "CANNOT_PAUSE_EXPIRED_CAMPAIGN",
	CANNOT_PAUSE_DELETED_CAMPAIGN = "CANNOT_PAUSE_DELETED_CAMPAIGN",
	CANNOT_ACTIVATE_EXPIRED_CAMPAIGN = "CANNOT_ACTIVATE_EXPIRED_CAMPAIGN",
	CANNOT_ACTIVATE_DELETED_CAMPAIGN = "CANNOT_ACTIVATE_DELETED_CAMPAIGN",
}

export class Campaign {
	private readonly _id: string;
	private _name: string;
	private _status: keyof typeof CampaignStatus;
	private _category: string;
	private readonly _createdAt: Date;
	private _startDate: Date;
	private _endDate: Date;
	private _deletedAt?: Date;

	private constructor(campaign: ICampaign) {
		this._id = campaign.id;
		this._name = campaign.name;
		this._status = campaign.status;
		if (campaign.endDate < new Date()) {
			this._status = CampaignStatus.expired;
		}
		this._category = campaign.category;
		this._createdAt = campaign.createdAt;
		this._startDate = campaign.startDate;
		this._endDate = campaign.endDate;
		this._deletedAt = campaign.deletedAt;
	}

	public static create(campaign: ICampaign): Result<Campaign> {
		if (campaign.startDate < campaign.createdAt) {
			return Result.fail(
				new CampaignError(
					CampaignErrorCodes.START_DATE_BEFORE_CREATED_AT,
					"startDate must be greater than createdAt",
				),
			);
		}
		if (campaign.endDate < campaign.startDate) {
			return Result.fail(
				new CampaignError(
					CampaignErrorCodes.END_DATE_BEFORE_START_DATE,
					"endDate must be greater than startDate",
				),
			);
		}
		const instance = new Campaign(campaign);
		return Result.ok(instance);
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get status(): keyof typeof CampaignStatus {
		return this._status;
	}

	get category(): string {
		return this._category;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get startDate(): Date {
		return this._startDate;
	}

	get endDate(): Date {
		return this._endDate;
	}

	isActive(): boolean {
		if (this.isDeleted()) return false;
		return this._status === CampaignStatus.active;
	}

	isPaused(): boolean {
		if (this.isDeleted()) return false;
		return this._status === CampaignStatus.paused;
	}

	isExpired(): boolean {
		if (this.isDeleted()) return false;
		if (this._endDate < new Date()) {
			this._status = CampaignStatus.expired;
			return true;
		}
		return this._status === CampaignStatus.expired;
	}

	pause(): Result<void> {
		if (this.isExpired()) {
			return Result.fail(
				new CampaignError(
					CampaignErrorCodes.CANNOT_PAUSE_EXPIRED_CAMPAIGN,
					"Cannot pause an expired campaign",
				),
			);
		}
		if (this.isDeleted()) {
			return Result.fail(
				new CampaignError(
					CampaignErrorCodes.CANNOT_PAUSE_DELETED_CAMPAIGN,
					"Cannot pause a deleted campaign",
				),
			);
		}
		this._status = CampaignStatus.paused;
		return Result.ok();
	}

	activate(): Result<void> {
		if (this.isExpired()) {
			return Result.fail(
				new CampaignError(
					CampaignErrorCodes.CANNOT_ACTIVATE_EXPIRED_CAMPAIGN,
					"Cannot activate an expired campaign",
				),
			);
		}
		if (this.isDeleted()) {
			return Result.fail(
				new CampaignError(
					CampaignErrorCodes.CANNOT_ACTIVATE_DELETED_CAMPAIGN,
					"Cannot activate a deleted campaign",
				),
			);
		}
		this._status = CampaignStatus.active;
		return Result.ok();
	}

	delete(): Result<void> {
		this._deletedAt = new Date();
		return Result.ok();
	}

	isDeleted(): boolean {
		return !!this._deletedAt;
	}
}

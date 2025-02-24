import { CampaignStatus, type ICampaign } from "./campaign.interface";

export class Campaign {
	private readonly _id: string;
	private _name: string;
	private _status: keyof typeof CampaignStatus;
	private _category: string;
	private readonly _createdAt: Date;
	private _startDate: Date;
	private _endDate: Date;
	private _deletedAt?: Date;

	constructor(campaign: ICampaign) {
		this._id = campaign.id;
		this._name = campaign.name;
		this._status = campaign.status;
		if (campaign.endDate < new Date()) {
			this._status = CampaignStatus.expired;
		}
		this._category = campaign.category;
		if (campaign.startDate < campaign.createdAt) {
			throw new Error("startDate must be greater than createdAt");
		}

		this._createdAt = campaign.createdAt;
		this._startDate = campaign.startDate;

		if (campaign.endDate < campaign.startDate) {
			throw new Error("endDate must be greater than startDate");
		}
		this._endDate = campaign.endDate;
		this._deletedAt = campaign.deletedAt;
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
		if (this.isDeleted()) {
			return false;
		}

		return this._status === CampaignStatus.active;
	}

	isPaused(): boolean {
		if (this.isDeleted()) {
			return false;
		}

		return this._status === CampaignStatus.paused;
	}

	isExpired(): boolean {
		if (this.isDeleted()) {
			return false;
		}
		if (this._endDate < new Date()) {
			this._status = CampaignStatus.expired;
			return true;
		}
		return this._status === CampaignStatus.expired;
	}

	pause(): void {
		if (this.isExpired()) {
			throw new Error("Cannot pause an expired campaign");
		}
		if (this.isDeleted()) {
			throw new Error("Cannot pause a deleted campaign");
		}
		this._status = CampaignStatus.paused;
	}

	activate(): void {
		if (this.isExpired()) {
			throw new Error("Cannot activate an expired campaign");
		}
		if (this.isDeleted()) {
			throw new Error("Cannot activate a deleted campaign");
		}
		this._status = CampaignStatus.active;
	}

	delete(): void {
		this._deletedAt = new Date();
	}

	isDeleted(): boolean {
		return !!this._deletedAt;
	}
}

import { Campaign } from "../entity/campaign";
import { CampaignStatus } from "../entity/campaign.interface";
import { v4 as uuid } from "uuid";

export class CampaignBuilder {
	private _id: string;
	private _name: string;
	private _status: keyof typeof CampaignStatus;
	private _category: string;
	private _createdAt: Date;
	private _startDate: Date;
	private _endDate: Date;

	withId(id: string): this {
		this._id = id;
		return this;
	}

	withName(name: string): this {
		this._name = name;
		return this;
	}

	withStatus(status: keyof typeof CampaignStatus): this {
		if (!(status in CampaignStatus)) {
			throw new Error("Invalid status");
		}
		this._status = status;
		return this;
	}

	withCategory(category: string): this {
		this._category = category;
		return this;
	}

	withCreatedAt(createdAt: Date): this {
		this._createdAt = createdAt;
		return this;
	}

	withstartDate(startDate: Date): this {
		this._startDate = startDate;
		return this;
	}

	withendDate(endDate: Date): this {
		this._endDate = endDate;
		return this;
	}

	aCampaign(): Campaign {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);

		return new Campaign({
			id: uuid(),
			name: "Campaign 1",
			status: "active",
			category: "Category 1",
			createdAt: now,
			startDate: nexthour,
			endDate: tomorrow,
		});
	}

	fromCampaign(campaign: Campaign): this {
		this._id = campaign.id;
		this._name = campaign.name;
		this._status = campaign.status;
		this._category = campaign.category;
		this._startDate = campaign.startDate;
		this._endDate = campaign.endDate;
		this._createdAt = campaign.createdAt;
		return this;
	}

	build(): Campaign {
		if (!this._id) {
			throw new Error("Id is required");
		}

		if (!this._name) {
			throw new Error("Name is required");
		}

		if (!this._status) {
			throw new Error("Status is required");
		}

		if (!this._category) {
			throw new Error("Category is required");
		}

		if (!this._createdAt) {
			throw new Error("CreatedAt is required");
		}

		if (!this._startDate) {
			throw new Error("startDate is required");
		}

		if (!this._endDate) {
			throw new Error("endDate is required");
		}

		if (this._endDate < this._startDate) {
			throw new Error("endDate must be greater than startDate");
		}

		if (this._startDate < this._createdAt) {
			throw new Error("startDate must be greater than createdAt");
		}

		return new Campaign({
			id: this._id,
			name: this._name,
			status: this._status,
			category: this._category,
			createdAt: this._createdAt,
			startDate: this._startDate,
			endDate: this._endDate,
		});
	}
}

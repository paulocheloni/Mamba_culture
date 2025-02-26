import { CampaignErrorCodes } from "./campaign-error-codes";

export class CampaignError {
	public readonly code: CampaignErrorCodes;
	public readonly message: string;

	constructor(code: CampaignErrorCodes, message?: string) {
		this.code = code;
		this.message = message || CampaignError.defaultMessage(code);
	}

	private static defaultMessage(code: CampaignErrorCodes): string {
		const messages: Record<CampaignErrorCodes, string> = {
			[CampaignErrorCodes.ID_REQUIRED]: "Id is required",
			[CampaignErrorCodes.NAME_REQUIRED]: "Name is required",
			[CampaignErrorCodes.STATUS_REQUIRED]: "Status is required",
			[CampaignErrorCodes.CATEGORY_REQUIRED]: "Category is required",
			[CampaignErrorCodes.CREATED_AT_REQUIRED]: "CreatedAt is required",
			[CampaignErrorCodes.START_DATE_REQUIRED]: "startDate is required",
			[CampaignErrorCodes.END_DATE_REQUIRED]: "endDate is required",
			[CampaignErrorCodes.END_DATE_BEFORE_START_DATE]:
				"endDate must be greater than startDate",
			[CampaignErrorCodes.START_DATE_BEFORE_CREATED_AT]:
				"startDate must be greater than createdAt",
			[CampaignErrorCodes.CANNOT_PAUSE_EXPIRED_CAMPAIGN]:
				"Cannot pause an expired campaign",
			[CampaignErrorCodes.CANNOT_PAUSE_DELETED_CAMPAIGN]:
				"Cannot pause a deleted campaign",
			[CampaignErrorCodes.CANNOT_ACTIVATE_EXPIRED_CAMPAIGN]:
				"Cannot activate an expired campaign",
			[CampaignErrorCodes.CANNOT_ACTIVATE_DELETED_CAMPAIGN]:
				"Cannot activate a deleted campaign",
			[CampaignErrorCodes.CAMPAIGN_NOT_FOUND]: "Campaign not found",
			[CampaignErrorCodes.CAMPAIGN_ALREADY_EXISTS]: "Campaign already exists",
			[CampaignErrorCodes.INVALID_STATUS]: "Invalid status",
			[CampaignErrorCodes.INVALID_CATEGORY]: "Invalid category",
		};
		return messages[code];
	}
}

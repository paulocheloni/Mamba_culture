export enum CampaignErrorCodes {
	ID_REQUIRED = "ID_REQUIRED",
	NAME_REQUIRED = "NAME_REQUIRED",
	STATUS_REQUIRED = "STATUS_REQUIRED",
	CATEGORY_REQUIRED = "CATEGORY_REQUIRED",
	CREATED_AT_REQUIRED = "CREATED_AT_REQUIRED",
	START_DATE_REQUIRED = "START_DATE_REQUIRED",
	END_DATE_REQUIRED = "END_DATE_REQUIRED",
	END_DATE_BEFORE_START_DATE = "END_DATE_BEFORE_START_DATE",
	START_DATE_BEFORE_CREATED_AT = "START_DATE_BEFORE_CREATED_AT",
	CANNOT_PAUSE_EXPIRED_CAMPAIGN = "CANNOT_PAUSE_EXPIRED_CAMPAIGN",
	CANNOT_PAUSE_DELETED_CAMPAIGN = "CANNOT_PAUSE_DELETED_CAMPAIGN",
	CANNOT_ACTIVATE_EXPIRED_CAMPAIGN = "CANNOT_ACTIVATE_EXPIRED_CAMPAIGN",
	CANNOT_ACTIVATE_DELETED_CAMPAIGN = "CANNOT_ACTIVATE_DELETED_CAMPAIGN",
	CAMPAIGN_NOT_FOUND = "CAMPAIGN_NOT_FOUND",
	CAMPAIGN_ALREADY_EXISTS = "CAMPAIGN_ALREADY_EXISTS",
	INVALID_STATUS = "INVALID_STATUS",
	INVALID_CATEGORY = "INVALID_CATEGORY",
}

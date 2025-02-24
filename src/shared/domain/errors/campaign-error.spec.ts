import { CampaignErrorCodes } from "./campaign-error-codes";
import { CampaignError } from "./campaign-error";

describe("CampaignError", () => {
	const errorData: Array<[CampaignErrorCodes, string]> = [
		[CampaignErrorCodes.ID_REQUIRED, "Id is required"],
		[CampaignErrorCodes.NAME_REQUIRED, "Name is required"],
		[CampaignErrorCodes.STATUS_REQUIRED, "Status is required"],
		[CampaignErrorCodes.CATEGORY_REQUIRED, "Category is required"],
		[CampaignErrorCodes.CREATED_AT_REQUIRED, "CreatedAt is required"],
		[CampaignErrorCodes.START_DATE_REQUIRED, "startDate is required"],
		[CampaignErrorCodes.END_DATE_REQUIRED, "endDate is required"],
		[
			CampaignErrorCodes.END_DATE_BEFORE_START_DATE,
			"endDate must be greater than startDate",
		],
		[
			CampaignErrorCodes.START_DATE_BEFORE_CREATED_AT,
			"startDate must be greater than createdAt",
		],
		[
			CampaignErrorCodes.CANNOT_PAUSE_EXPIRED_CAMPAIGN,
			"Cannot pause an expired campaign",
		],
		[
			CampaignErrorCodes.CANNOT_PAUSE_DELETED_CAMPAIGN,
			"Cannot pause a deleted campaign",
		],
		[
			CampaignErrorCodes.CANNOT_ACTIVATE_EXPIRED_CAMPAIGN,
			"Cannot activate an expired campaign",
		],
		[
			CampaignErrorCodes.CANNOT_ACTIVATE_DELETED_CAMPAIGN,
			"Cannot activate a deleted campaign",
		],
		[CampaignErrorCodes.CAMPAING_NOT_FOUND, "Campaign not found"],
		[CampaignErrorCodes.CAMPAIGN_ALREADY_EXISTS, "Campaign already exists"],
	];

	test.each(errorData)(
		"should return default message for code %s",
		(code, expectedMessage) => {
			const error = new CampaignError(code);
			expect(error.code).toBe(code);
			expect(error.message).toBe(expectedMessage);
		},
	);

	test("should use custom message when provided", () => {
		const customMessage = "Custom error message";
		const error = new CampaignError(
			CampaignErrorCodes.NAME_REQUIRED,
			customMessage,
		);
		expect(error.code).toBe(CampaignErrorCodes.NAME_REQUIRED);
		expect(error.message).toBe(customMessage);
	});
});

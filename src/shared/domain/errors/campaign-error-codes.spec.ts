import { CampaignErrorCodes } from "./campaign-error-codes";

describe("CampaignErrorCodes", () => {
	it("should contain all the correct error codes", () => {
		expect(CampaignErrorCodes.ID_REQUIRED).toBe("ID_REQUIRED");
		expect(CampaignErrorCodes.NAME_REQUIRED).toBe("NAME_REQUIRED");
		expect(CampaignErrorCodes.STATUS_REQUIRED).toBe("STATUS_REQUIRED");
		expect(CampaignErrorCodes.CATEGORY_REQUIRED).toBe("CATEGORY_REQUIRED");
		expect(CampaignErrorCodes.CREATED_AT_REQUIRED).toBe("CREATED_AT_REQUIRED");
		expect(CampaignErrorCodes.START_DATE_REQUIRED).toBe("START_DATE_REQUIRED");
		expect(CampaignErrorCodes.END_DATE_REQUIRED).toBe("END_DATE_REQUIRED");
		expect(CampaignErrorCodes.END_DATE_BEFORE_START_DATE).toBe(
			"END_DATE_BEFORE_START_DATE",
		);
		expect(CampaignErrorCodes.START_DATE_BEFORE_CREATED_AT).toBe(
			"START_DATE_BEFORE_CREATED_AT",
		);
		expect(CampaignErrorCodes.CANNOT_PAUSE_EXPIRED_CAMPAIGN).toBe(
			"CANNOT_PAUSE_EXPIRED_CAMPAIGN",
		);
		expect(CampaignErrorCodes.CANNOT_PAUSE_DELETED_CAMPAIGN).toBe(
			"CANNOT_PAUSE_DELETED_CAMPAIGN",
		);
		expect(CampaignErrorCodes.CANNOT_ACTIVATE_EXPIRED_CAMPAIGN).toBe(
			"CANNOT_ACTIVATE_EXPIRED_CAMPAIGN",
		);
		expect(CampaignErrorCodes.CANNOT_ACTIVATE_DELETED_CAMPAIGN).toBe(
			"CANNOT_ACTIVATE_DELETED_CAMPAIGN",
		);
		expect(CampaignErrorCodes.CAMPAING_NOT_FOUND).toBe("CAMPAING_NOT_FOUND");
		expect(CampaignErrorCodes.CAMPAIGN_ALREADY_EXISTS).toBe(
			"CAMPAIGN_ALREADY_EXISTS",
		);
	});

	it("should have exactly 15 error codes", () => {
		const keys = Object.keys(CampaignErrorCodes);
		expect(keys.length).toBe(15);
	});
});

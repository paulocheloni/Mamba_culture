import { UpdateCampaignDto } from "./update-campaign.dto";

describe("UpdateCampaignDto", () => {
	it("should allow assignment of inherited properties and id", () => {
		const dto = new UpdateCampaignDto();
		dto.id = "123";
		dto.name = "Test Campaign";
		dto.category = "Marketing";
		dto.startDate = new Date("2023-01-01");
		dto.endDate = new Date("2023-12-31");
		dto.status = "active";

		expect(dto.id).toBe("123");
		expect(dto.name).toBe("Test Campaign");
		expect(dto.category).toBe("Marketing");
		expect(dto.startDate).toEqual(new Date("2023-01-01"));
		expect(dto.endDate).toEqual(new Date("2023-12-31"));
		expect(dto.status).toBe("active");
	});
});

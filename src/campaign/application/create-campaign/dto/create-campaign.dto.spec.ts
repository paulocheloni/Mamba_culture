import { CreateCampaignDto } from "./create-campaign.dto";

describe("CreateCampaignDto", () => {
	let dto: CreateCampaignDto;
	beforeAll(() => {
		dto = new CreateCampaignDto();
	});

	it("should be defined", () => {
		expect(dto).toBeTruthy();
	});

	it("should have a category property", () => {
		expect(dto).toHaveProperty("category");
	});

	it("should have a name property", () => {
		expect(dto).toHaveProperty("name");
	});

	it("should have a startDate property", () => {
		expect(dto).toHaveProperty("startDate");
	});

	it("should have a endDate property", () => {
		expect(dto).toHaveProperty("endDate");
	});
});

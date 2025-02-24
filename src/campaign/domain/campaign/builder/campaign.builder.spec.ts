import { Campaign } from "../entity/campaign";
import { CampaignBuilder } from "./campaign.builder";

describe("CampaignBuilder", () => {
	test("builds a valid campaign", () => {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() + 2);
		const endDate = new Date();
		endDate.setDate(endDate.getDate() + 5);
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withstartDate(startDate)
			.withendDate(endDate);
		const campaign = builder.build();
		expect(campaign).toBeInstanceOf(Campaign);
		expect(campaign.id).toBe("1");
		expect(campaign.name).toBe("Test");
		expect(campaign.status).toBe("active");
	});

	test("throws if id is missing", () => {
		const builder = new CampaignBuilder()
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withstartDate(new Date())
			.withendDate(new Date());
		expect(() => builder.build()).toThrow("Id is required");
	});

	test("throws if name is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withstartDate(new Date())
			.withendDate(new Date());
		expect(() => builder.build()).toThrow("Name is required");
	});

	test("throws if status is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withstartDate(new Date())
			.withendDate(new Date());
		expect(() => builder.build()).toThrow("Status is required");
	});

	test("throws if category is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCreatedAt(new Date())
			.withstartDate(new Date())
			.withendDate(new Date());
		expect(() => builder.build()).toThrow("Category is required");
	});

	test("throws if createdAt is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withstartDate(new Date())
			.withendDate(new Date());
		expect(() => builder.build()).toThrow("CreatedAt is required");
	});

	test("throws if startDate is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withendDate(new Date());
		expect(() => builder.build()).toThrow("startDate is required");
	});

	test("throws if endDate is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withstartDate(new Date());
		expect(() => builder.build()).toThrow("endDate is required");
	});

	test("when creating it should not allow campaign with endDate < startDate", () => {
		const createdAt = new Date();
		const pastEnd = new Date();
		pastEnd.setDate(pastEnd.getDate() - 1);
		const start = new Date();
		start.setDate(start.getDate() + 1);
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(createdAt)
			.withstartDate(start)
			.withendDate(pastEnd);
		expect(() => builder.build()).toThrow(
			"endDate must be greater than startDate",
		);
	});

	test("throws if endDate is before startDate", () => {
		const createdAt = new Date();
		const start = new Date();
		start.setDate(start.getDate() + 3);
		const end = new Date();
		end.setDate(end.getDate() + 2);
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(createdAt)
			.withstartDate(start)
			.withendDate(end);
		expect(() => builder.build()).toThrow(
			"endDate must be greater than startDate",
		);
	});

	test("throws if startDate is not greater than createdAt", () => {
		const createdAt = new Date();
		const start = new Date(createdAt.getTime());
		const end = new Date();
		end.setDate(end.getDate() + 1);
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(createdAt)
			.withstartDate(start)
			.withendDate(end);
		expect(() => builder.build()).toThrow(
			"startDate must be greater than createdAt",
		);
	});

	test("aCampaign returns a campaign with default values", () => {
		const campaign = new CampaignBuilder().aCampaign();
		expect(campaign).toBeInstanceOf(Campaign);
		expect(campaign.id).toBeDefined();
		expect(campaign.name).toBe("Campaign 1");
		expect(campaign.status).toBe("active");
		expect(campaign.category).toBe("Category 1");
		expect(campaign.createdAt).toBeInstanceOf(Date);
		expect(campaign.startDate).toBeInstanceOf(Date);
		expect(campaign.endDate).toBeInstanceOf(Date);
	});
});

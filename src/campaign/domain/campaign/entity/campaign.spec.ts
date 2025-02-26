import { Campaign } from "./campaign";

describe("Campaign", () => {
	let campaign: Campaign;

	beforeAll(() => {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);
		const result = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "seasonal",
			createdAt: now,
			startDate: nexthour,
			endDate: tomorrow,
		});
		if (result.isFailure) throw result.error;
		campaign = result.value;
	});

	it("should be defined", () => {
		expect(campaign).toBeTruthy();
	});

	it("should return true when status is active", () => {
		expect(campaign.isActive()).toBe(true);
	});

	it("should return true when status is paused", () => {
		const result = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "paused",
			category: "seasonal",
			createdAt: new Date(),
			startDate: new Date(),
			endDate: new Date(),
		});
		campaign = result.value;
		expect(result.isFailure).toBe(false);
		expect(campaign.isPaused()).toBe(true);
	});

	it("should return true when status is expired", () => {
		const result = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "expired",
			category: "seasonal",
			endDate: new Date(),
			createdAt: new Date(),
			startDate: new Date(),
		});
		campaign = result.value;
		expect(campaign.isExpired()).toBe(true);
	});

	it("should throw an error when endDate is less than startDate", () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() + 1);
		yesterday.setDate(now.getDate() - 1);

		const result = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "seasonal",
			createdAt: now,
			startDate: nexthour,
			endDate: yesterday,
		});

		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("endDate must be greater than startDate");
	});

	it("should throw an error when startDate is less than createdAt", () => {
		const now = new Date();
		const yesterday = new Date();
		yesterday.setDate(now.getDate() - 1);

		const result = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "seasonal",
			createdAt: now,
			startDate: yesterday,
			endDate: new Date(),
		});

		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe(
			"startDate must be greater than createdAt",
		);
	});

	it("should be possible to delete a campaign", () => {
		campaign = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "seasonal",
			createdAt: new Date(),
			startDate: new Date(),
			endDate: new Date(),
		}).value;
		campaign.delete();
		expect(campaign.isDeleted()).toBe(true);
	});

	it("should be possible to pause a campaign", () => {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);

		const result = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "seasonal",
			createdAt: now,
			startDate: nexthour,
			endDate: tomorrow,
		});
		campaign = result.value;
		campaign.pause();

		expect(campaign.isPaused()).toBe(true);
	});

	it("should be possible to activate a campaign", () => {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);

		const result = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "seasonal",
			createdAt: now,
			startDate: nexthour,
			endDate: tomorrow,
		});
		campaign = result.value;

		expect(campaign.isActive()).toBe(true);
	});

	it("should not be possible to activate a deleted campaign", () => {
		const result = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "seasonal",
			createdAt: new Date(),
			startDate: new Date(),
			endDate: new Date(),
			deletedAt: new Date(),
		});
		campaign = result.value;
		const activatedResult = campaign.activate();
		expect(activatedResult).toHaveProperty("error");
		expect(campaign.isActive()).toBe(false);
		expect(activatedResult.error.message).toBe(
			"Cannot activate a deleted campaign",
		);
		expect(campaign.isDeleted()).toBe(true);
	});

	it("should not be possible to activate an expired campaign", () => {
		const now = new Date();
		const yesterday = new Date();
		const hourAgo = new Date();
		const minuteAgo = new Date();
		yesterday.setDate(now.getDate() - 1);
		hourAgo.setHours(now.getHours() - 1);
		minuteAgo.setMinutes(now.getMinutes() - 1);

		const result = Campaign.create({
			id: "1",
			name: "Campaign 1",
			status: "expired",
			category: "seasonal",
			createdAt: yesterday,
			startDate: hourAgo,
			endDate: minuteAgo,
		});

		campaign = result.value;

		const activateResult = campaign.activate();
		expect(activateResult).toHaveProperty("error");
		expect(campaign.isActive()).toBe(false);
		expect(activateResult.error.message).toBe(
			"Cannot activate an expired campaign",
		);
		expect(campaign.isExpired()).toBe(true);
	});
});

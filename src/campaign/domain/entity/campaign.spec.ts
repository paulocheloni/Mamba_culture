import { Campaign } from "./campaign";

describe("Campaign", () => {
	let campaign: Campaign;

	beforeAll(() => {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);
		campaign = new Campaign({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "Category 1",
			createdAt: now,
			startDate: nexthour,
			endDate: tomorrow,
		});
	});

	it("should be defined", () => {
		expect(campaign).toBeTruthy();
	});

	it("should return true when status is active", () => {
		expect(campaign.isActive()).toBe(true);
	});

	it("should return true when status is paused", () => {
		campaign = new Campaign({
			id: "1",
			name: "Campaign 1",
			status: "paused",
			category: "Category 1",
			createdAt: new Date(),
			startDate: new Date(),
			endDate: new Date(),
		});
		expect(campaign.isPaused()).toBe(true);
	});

	it("should return true when status is expired", () => {
		campaign = new Campaign({
			id: "1",
			name: "Campaign 1",
			status: "expired",
			category: "Category 1",
			endDate: new Date(),
			createdAt: new Date(),
			startDate: new Date(),
		});
		expect(campaign.isExpired()).toBe(true);
	});

	it("should throw an error when endDate is less than startDate", () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() + 1);
		yesterday.setDate(now.getDate() - 1);
		expect(() => {
			new Campaign({
				id: "1",
				name: "Campaign 1",
				status: "active",
				category: "Category 1",
				endDate: yesterday,
				createdAt: now,
				startDate: nexthour,
			});
		}).toThrow("endDate must be greater than startDate");
	});

	it("should throw an error when startDate is less than createdAt", () => {
		const now = new Date();
		const yesterday = new Date();
		yesterday.setDate(now.getDate() - 1);

		expect(() => {
			new Campaign({
				id: "1",
				name: "Campaign 1",
				status: "active",
				category: "Category 1",
				endDate: new Date(),
				createdAt: now,
				startDate: yesterday,
			});
		}).toThrow("startDate must be greater than createdAt");
	});

	it("should be possible to delete a campaign", () => {
		campaign.delete();
		expect(campaign.isDeleted()).toBe(true);
	});

	it("should be possible to pause a campaign", () => {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);

		campaign = new Campaign({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "Category 1",
			createdAt: now,
			startDate: nexthour,
			endDate: tomorrow,
		});

		campaign.pause();

		expect(campaign.isPaused()).toBe(true);
	});

	it("should be possible to activate a campaign", () => {
		const now = new Date();
		const nexthour = new Date();
		const tomorrow = new Date();

		nexthour.setHours(now.getHours() + 1);
		tomorrow.setDate(now.getDate() + 1);

		campaign = new Campaign({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "Category 1",
			createdAt: now,
			startDate: nexthour,
			endDate: tomorrow,
		});

		expect(campaign.isActive()).toBe(true);
	});

	it("should not be possible to activate a deleted campaign", () => {
		campaign = new Campaign({
			id: "1",
			name: "Campaign 1",
			status: "active",
			category: "Category 1",
			createdAt: new Date(),
			startDate: new Date(),
			endDate: new Date(),
			deletedAt: new Date(),
		});
		expect(() => {
			campaign.activate();
		}).toThrow("Cannot activate a deleted campaign");
	});

	it("should not be possible to activate an expired campaign", () => {
		const now = new Date();
		const yesterday = new Date();
		const hourAgo = new Date();
		const minuteAgo = new Date();
		yesterday.setDate(now.getDate() - 1);
		hourAgo.setHours(now.getHours() - 1);
		minuteAgo.setMinutes(now.getMinutes() - 1);

		campaign = new Campaign({
			id: "1",
			name: "Campaign 1",
			status: "expired",
			category: "Category 1",
			createdAt: yesterday,
			startDate: hourAgo,
			endDate: minuteAgo,
		});

		expect(() => {
			campaign.activate();
		}).toThrow("Cannot activate an expired campaign");
	});
});

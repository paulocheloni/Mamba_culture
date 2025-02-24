/** @type {import('jest').Config} */
module.exports = {
	transform: {
		"^.+\\.[tj]s?$": ["@swc/jest"],
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
	transformIgnorePatterns: ["<rootDir>/jest.setup.cjs"],
	collectCoverageFrom: ["src/**/*.{ts,tsx}"],
	reporters: [
		"default",
		[
			"jest-ctrf-json-reporter",
			{
				outputName: "test-results/report.json",
			},
		],
		[
			"jest-junit",
			{
				outputName: "test-results/results.xml",
			},
		],
	],
};

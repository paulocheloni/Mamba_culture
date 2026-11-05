/** @type {import('jest').Config} */
const swcJestConfig = {
	swcrc: false,
	sourceMaps: "inline",
	jsc: {
		parser: {
			syntax: "typescript",
			tsx: false,
			decorators: true,
			dynamicImport: true,
		},
		transform: {
			legacyDecorator: true,
			decoratorMetadata: true,
		},
		baseUrl: __dirname,
		paths: {
			"src/*": ["src/*"],
		},
	},
	module: {
		type: "commonjs",
	},
};

module.exports = {
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	transform: {
		"^.+\\.[tj]s?$": ["@swc/jest", swcJestConfig],
	},
	setupFiles: ["<rootDir>/jest.setup.cjs"],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.spec.ts",
		"!src/metadata.ts",
	],
	reporters: [
		"default",
		[
			"jest-ctrf-json-reporter",
			{
				outputFile: "report.json",
				outputDir: "test-results",
			},
		],
		[
			"jest-junit",
			{
				outputDirectory: "test-results",
				outputName: "results.xml",
			},
		],
	],
};

export abstract class TestableRepository {
	/** should only be called in tests */
	protected abstract callReset(): void | Promise<void>;
	reset() {
		if (process.env.NODE_ENV === "test") {
			this.callReset();
		}
	}
}

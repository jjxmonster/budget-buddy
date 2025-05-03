import { expect, Locator, Page } from "@playwright/test"

/**
 * Page Object Model for the Home page
 * Following the POM pattern for maintainable e2e tests
 */
export class HomePage {
	readonly page: Page
	readonly heading: Locator

	constructor(page: Page) {
		this.page = page
		this.heading = page.getByRole("heading", { level: 1 })
	}

	/**
	 * Navigate to the home page
	 */
	async goto() {
		await this.page.goto("/")
	}

	/**
	 * Verify the page is loaded correctly
	 */
	async expectPageLoaded() {
		await expect(this.page).toHaveTitle(/Budget Buddy/)
		await expect(this.heading).toBeVisible()
	}
}

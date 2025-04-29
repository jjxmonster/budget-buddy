import { expect, test } from "@playwright/test"

test.describe("Basic navigation", () => {
	test("should navigate to the home page", async ({ page }) => {
		// Navigate to the application
		await page.goto("/")

		// Make sure the page is loaded
		await expect(page).toHaveTitle(/Budget Buddy/)
	})
})

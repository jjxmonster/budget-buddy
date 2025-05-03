import { expect, test as setup } from "@playwright/test"
import path from "path"

const authFile = path.join(__dirname, "../playwright/.auth/user.json")

const E2E_USERNAME = process.env.E2E_USERNAME
const E2E_PASSWORD = process.env.E2E_PASSWORD

if (!E2E_USERNAME || !E2E_PASSWORD) {
	throw new Error("E2E_USERNAME and E2E_PASSWORD must be set")
}

setup("authenticate", async ({ page, baseURL }) => {
	// Navigate to login page and wait for it to load
	await page.goto(`${baseURL}/auth/login`)

	// Wait for and fill email input
	const emailInput = page.locator('input[data-testid="auth-input-email"]')
	await emailInput.waitFor({ state: "visible" })
	await emailInput.click()
	await emailInput.fill(E2E_USERNAME)
	await expect(emailInput).toHaveValue(E2E_USERNAME)

	// Wait for and fill password input
	const passwordInput = page.locator('input[data-testid="auth-input-password"]')
	await passwordInput.waitFor({ state: "visible" })
	await passwordInput.click()
	await passwordInput.fill(E2E_PASSWORD)
	await expect(passwordInput).toHaveValue(E2E_PASSWORD)

	// Wait for and click submit button
	const submitButton = page.locator('button[type="submit"]')
	await submitButton.click()

	await page.waitForURL(`${baseURL}/dashboard/expenses`)

	// Store authentication state
	await page.context().storageState({ path: authFile })
})

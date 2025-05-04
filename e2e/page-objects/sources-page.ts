import { expect, Locator, Page } from "@playwright/test"

export class SourcesPage {
	readonly page: Page
	readonly pageTitle: Locator
	readonly addSourceButton: Locator
	readonly sourcesTable: Locator
	readonly sourcesTableBody: Locator
	readonly emptyState: Locator
	readonly createSourceDialog: Locator
	readonly sourceNameInput: Locator
	readonly submitSourceButton: Locator
	readonly cancelSourceButton: Locator
	readonly deleteConfirmButton: Locator
	readonly deleteCancelButton: Locator

	constructor(page: Page) {
		this.page = page
		this.pageTitle = page.locator("h1.text-3xl.font-bold", { hasText: "Sources" })
		this.addSourceButton = page.getByTestId("add-source-button")
		this.sourcesTable = page.locator(".rounded-md.border").filter({ has: page.locator("table") })
		this.sourcesTableBody = page.getByTestId("source-table-body")
		this.emptyState = page.getByText("No sources found")
		this.createSourceDialog = page.getByTestId("create-source-dialog")
		this.sourceNameInput = page.getByTestId("source-name-input")
		this.submitSourceButton = page.getByTestId("submit-source-button")
		this.cancelSourceButton = page.getByTestId("cancel-source-button")
		this.deleteConfirmButton = page.getByRole("button", { name: "Delete" })
		this.deleteCancelButton = page.getByRole("button", { name: "Cancel" })
	}

	/**
	 * Navigate to the sources page
	 */
	async goto() {
		await this.page.goto("/dashboard/sources")
		await this.page.waitForLoadState("networkidle")
	}

	/**
	 * Click the Add Source button to open the create dialog
	 */
	async clickAddSourceButton() {
		await this.addSourceButton.click()
	}

	/**
	 * Fill in the source form with the given name
	 */
	async fillSourceForm(name: string) {
		await this.sourceNameInput.fill(name)
	}

	/**
	 * Submit the source form and wait for the dialog to close
	 */
	async submitSourceForm() {
		await this.submitSourceButton.click()
		await this.createSourceDialog.waitFor({ state: "hidden" })
		// Wait for the UI to update with the new source
		await this.page.waitForLoadState("networkidle")
	}

	/**
	 * Cancel the source form and wait for the dialog to close
	 */
	async cancelSourceForm() {
		await this.cancelSourceButton.click()
		await this.createSourceDialog.waitFor({ state: "hidden" })
	}

	/**
	 * Add a new source in one operation
	 */
	async addSource(name: string) {
		await this.clickAddSourceButton()
		await this.fillSourceForm(name)
		await this.submitSourceForm()
	}

	/**
	 * Check if a source with the given name exists
	 */
	async expectSourceExists(name: string) {
		const sourceElement = this.page.getByText(name, { exact: true })
		return await expect(sourceElement).toBeVisible({ timeout: 5000 })
	}

	/**
	 * Get the count of source rows
	 */
	async getSourceRowsCount() {
		return this.page.getByTestId(/^source-row-/).count()
	}

	/**
	 * Find a source by name
	 */
	findSourceByName(name: string) {
		return this.page.getByText(name, { exact: true })
	}

	/**
	 * Get the name of the last source in the list
	 */
	async getLastSourceName() {
		const lastSourceRow = this.page.getByTestId(/^source-row-/).last()
		const nameCell = lastSourceRow.locator("td").first()
		return (await nameCell.textContent()) || ""
	}

	/**
	 * Edit the last source in the list
	 */
	async editLastSource(newName: string) {
		// Click the edit button of the last source
		await this.page
			.getByTestId(/^edit-source-/)
			.last()
			.click()

		await this.sourceNameInput.fill(newName)

		// Submit the form
		await this.submitSourceButton.click()
		await this.page.waitForLoadState("networkidle")
	}

	/**
	 * Delete the last source in the list
	 */
	async deleteLastSource() {
		// Click the delete button of the last source
		await this.page
			.getByTestId(/^delete-source-/)
			.last()
			.click()

		// Confirm deletion in the dialog
		await this.deleteConfirmButton.waitFor({ state: "visible" })
		await this.deleteConfirmButton.click()
		await this.page.waitForLoadState("networkidle")
	}
}

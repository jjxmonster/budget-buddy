import { Locator, Page } from "@playwright/test"

export class CategoriesPage {
	readonly page: Page
	readonly pageTitle: Locator
	readonly addCategoryButton: Locator
	readonly categoriesTable: Locator
	readonly categoriesTableBody: Locator
	readonly emptyState: Locator
	readonly createCategoryDialog: Locator
	readonly categoryNameInput: Locator
	readonly submitCategoryButton: Locator
	readonly cancelCategoryButton: Locator
	readonly deleteConfirmButton: Locator
	readonly deleteCancelButton: Locator

	constructor(page: Page) {
		this.page = page
		this.pageTitle = page.locator("h1.text-3xl.font-bold", { hasText: "Categories" })
		this.addCategoryButton = page.getByTestId("add-category-button")
		this.categoriesTable = page.getByTestId("categories-table-container")
		this.categoriesTableBody = page.getByTestId("categories-table-body")
		this.emptyState = page.getByTestId("empty-categories")
		this.createCategoryDialog = page.getByTestId("create-category-dialog")
		this.categoryNameInput = page.getByTestId("category-name-input")
		this.submitCategoryButton = page.getByTestId("submit-category-button")
		this.cancelCategoryButton = page.getByTestId("cancel-category-button")
		this.deleteConfirmButton = page.getByRole("button", { name: "Delete" })
		this.deleteCancelButton = page.getByRole("button", { name: "Cancel" })
	}

	async goto() {
		await this.page.goto("/dashboard/categories")
		await this.page.waitForLoadState("networkidle")
	}

	async clickAddCategoryButton() {
		await this.addCategoryButton.click()
		await this.createCategoryDialog.waitFor({ state: "visible" })
	}

	async fillCategoryForm(name: string) {
		await this.categoryNameInput.fill(name)
	}

	async submitCategoryForm() {
		await this.submitCategoryButton.click()
		await this.createCategoryDialog.waitFor({ state: "hidden" })
		// Wait for the UI to update with the new category
		await this.page.waitForLoadState("networkidle")
	}

	async cancelCategoryForm() {
		await this.cancelCategoryButton.click()
		await this.createCategoryDialog.waitFor({ state: "hidden" })
	}

	async addCategory(name: string) {
		await this.clickAddCategoryButton()
		await this.fillCategoryForm(name)
		await this.submitCategoryForm()
	}

	async deleteCategory(name: string) {
		await this.page.getByText(name, { exact: true }).click()
		await this.deleteConfirmButton.click()
		await this.page.waitForLoadState("networkidle")
	}

	async getCategoryRowsCount() {
		return this.page.getByTestId(/^category-row-/).count()
	}

	findCategoryByName(name: string) {
		return this.page.getByText(name, { exact: true })
	}

	async getLastCategoryName() {
		const firstCategoryCell = this.page.getByTestId(/^category-name-/).last()
		return (await firstCategoryCell.textContent()) || ""
	}

	async editLastCategory(newName: string) {
		// Click the edit button of the first category
		await this.page
			.getByTestId(/^edit-category-/)
			.last()
			.click()

		// Wait for the edit dialog to appear and fill in the new name
		await this.categoryNameInput.waitFor({ state: "visible" })
		await this.categoryNameInput.fill(newName)

		// Submit the form
		await this.submitCategoryButton.click()
		await this.page.waitForLoadState("networkidle")
	}

	async deleteLastCategory() {
		// Click the delete button of the first category
		await this.page
			.getByTestId(/^delete-category-/)
			.last()
			.click()

		// Confirm deletion in the dialog
		await this.deleteConfirmButton.waitFor({ state: "visible" })
		await this.deleteConfirmButton.click()
		await this.page.waitForLoadState("networkidle")
	}
}

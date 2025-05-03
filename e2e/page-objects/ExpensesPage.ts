import { expect, Locator, Page } from "@playwright/test"

/**
 * Page Object Model for the Expenses dashboard page
 * Following the POM pattern for maintainable e2e tests
 */
export class ExpensesPage {
	readonly page: Page

	// Page elements
	readonly heading: Locator
	readonly addExpenseButton: Locator
	readonly expenseTableContainer: Locator
	readonly expenseTableBody: Locator

	// Form modal elements
	readonly expenseFormModal: Locator
	readonly expenseTitleInput: Locator
	readonly expenseDescriptionInput: Locator
	readonly expenseDatePicker: Locator
	readonly expenseAmountInput: Locator
	readonly expenseCategorySelect: Locator
	readonly expenseSourceSelect: Locator
	readonly expenseSubmitButton: Locator
	readonly expenseCancelButton: Locator

	constructor(page: Page) {
		this.page = page

		// Initialize page elements
		this.heading = page.getByRole("heading", { name: "Expenses" })
		this.addExpenseButton = page.getByTestId("add-expense-button")
		this.expenseTableContainer = page.getByTestId("expense-table-container")
		this.expenseTableBody = page.getByTestId("expense-table-body")

		// Initialize form modal elements
		this.expenseFormModal = page.getByTestId("expense-form-modal")
		this.expenseTitleInput = page.getByTestId("expense-title-input")
		this.expenseDescriptionInput = page.getByTestId("expense-description-input")
		this.expenseDatePicker = page.getByTestId("expense-date-picker")
		this.expenseAmountInput = page.getByTestId("expense-amount-input")
		this.expenseCategorySelect = page.getByTestId("expense-category-select")
		this.expenseSourceSelect = page.getByTestId("expense-source-select")
		this.expenseSubmitButton = page.getByTestId("expense-submit-button")
		this.expenseCancelButton = page.getByTestId("expense-cancel-button")
	}

	/**
	 * Navigate to the expenses page
	 */
	async goto() {
		await this.page.goto("/dashboard/expenses")
	}

	/**
	 * Verify the page is loaded correctly
	 */
	async expectPageLoaded() {
		await expect(this.heading).toBeVisible()
		await expect(this.addExpenseButton).toBeVisible()
		await expect(this.expenseTableContainer).toBeVisible()
	}

	/**
	 * Open the add expense form
	 */
	async openAddExpenseForm() {
		await this.addExpenseButton.click()
		await expect(this.expenseFormModal).toBeVisible()
	}

	/**
	 * Fill the expense form with the provided data
	 */
	async fillExpenseForm({
		title,
		description,
		amount,
		category,
		source,
	}: {
		title: string
		description?: string
		amount: number
		category?: string
		source?: string
	}) {
		// Fill required fields
		await this.expenseTitleInput.fill(title)
		await this.expenseAmountInput.fill(amount.toString())

		// Fill optional fields if provided
		if (description) {
			await this.expenseDescriptionInput.fill(description)
		}

		// Select category if provided
		if (category) {
			await this.expenseCategorySelect.click()
			await this.page.getByRole("option", { name: category }).click()
		}

		// Select source if provided
		if (source) {
			await this.expenseSourceSelect.click()
			await this.page.getByRole("option", { name: source }).click()
		}
	}

	/**
	 * Submit the expense form
	 */
	async submitExpenseForm() {
		await this.expenseSubmitButton.click()
		await expect(this.expenseFormModal).not.toBeVisible({ timeout: 5000 })
	}

	/**
	 * Cancel the expense form
	 */
	async cancelExpenseForm() {
		await this.expenseCancelButton.click()
		await expect(this.expenseFormModal).not.toBeVisible()
	}

	/**
	 * Add a new expense with the provided data
	 */
	async addExpense(expenseData: {
		title: string
		description?: string
		amount: number
		category?: string
		source?: string
	}) {
		await this.openAddExpenseForm()
		await this.fillExpenseForm(expenseData)
		await this.submitExpenseForm()
	}

	/**
	 * Get expense row by title
	 */
	getExpenseRowByTitle(title: string) {
		return this.page.locator(`tr:has(td[data-testid="expense-title"]:text-is("${title}"))`)
	}

	/**
	 * Verify expense exists in the table
	 */
	async expectExpenseExists({
		title,
		description,
		amount,
		category,
		source,
	}: {
		title: string
		description?: string
		amount?: number
		category?: string
		source?: string
	}) {
		const row = this.getExpenseRowByTitle(title)
		await expect(row).toBeVisible({ timeout: 5000 })

		// Verify other fields if provided
		if (amount !== undefined) {
			const amountCell = row.locator('[data-testid="expense-amount"]')
			await expect(amountCell).toContainText(`$${amount.toFixed(2)}`)
		}

		if (description) {
			const descriptionCell = row.locator('[data-testid="expense-description"]')
			await expect(descriptionCell).toContainText(description)
		}

		if (category) {
			const categoryCell = row.locator('[data-testid="expense-category"]')
			await expect(categoryCell).toContainText(category)
		}

		if (source) {
			const sourceCell = row.locator('[data-testid="expense-source"]')
			await expect(sourceCell).toContainText(source)
		}
	}

	/**
	 * Take a screenshot of the expenses page
	 */
	async takeScreenshot(name: string) {
		await this.page.screenshot({ path: `screenshots/expenses-${name}.png` })
	}
}

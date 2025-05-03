import { expect, test } from "@playwright/test"
import { ExpensesPage } from "../page-objects/ExpensesPage"

test.describe("Expenses Dashboard", () => {
	let expensesPage: ExpensesPage

	test.beforeEach(async ({ page }) => {
		// Navigate to expenses page and verify it's loaded
		expensesPage = new ExpensesPage(page)
		await expensesPage.goto()
		await expensesPage.expectPageLoaded()
	})

	test("should add a new expense and verify it appears in the table", async () => {
		// Test data for the new expense
		const newExpense = {
			title: "Test Expense " + Date.now(), // Make title unique with timestamp
			description: "Test description for automated test",
			amount: 42.5,
			category: "Food",
			source: "Revolut",
		}

		// Step 1: Click Add Expense button and verify modal opens
		await expensesPage.openAddExpenseForm()

		// Step 2: Fill in the expense form
		await expensesPage.fillExpenseForm(newExpense)

		// Optional: Take screenshot of filled form for visual verification
		await expensesPage.takeScreenshot("filled-form")

		// Step 3: Submit the form
		await expensesPage.submitExpenseForm()

		// Step 4: Verify the new expense appears in the table
		await expensesPage.expectExpenseExists(newExpense)

		// Optional: Take screenshot of table showing the new expense
		await expensesPage.takeScreenshot("added-expense")
	})

	test("should cancel adding an expense", async () => {
		// Test data for the expense
		const expenseToCancel = {
			title: "Expense To Cancel",
			amount: 25.99,
		}

		// Open form and fill it
		await expensesPage.openAddExpenseForm()
		await expensesPage.fillExpenseForm(expenseToCancel)

		// Cancel the form
		await expensesPage.cancelExpenseForm()

		// Verify the form is closed
		await expect(expensesPage.expenseFormModal).not.toBeVisible()

		// Try to find the canceled expense (should not exist)
		const canceledExpenseRow = expensesPage.getExpenseRowByTitle(expenseToCancel.title)
		await expect(canceledExpenseRow).not.toBeVisible({ timeout: 1000 })
	})
})

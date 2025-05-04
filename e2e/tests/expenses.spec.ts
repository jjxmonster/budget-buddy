import { expect, test } from "@playwright/test"
import { CategoriesPage } from "../page-objects/categories-page"
import { ExpensesPage } from "../page-objects/expenses-page"

test.describe("Expenses Dashboard", () => {
	let expensesPage: ExpensesPage
	let categoryName: string

	test.beforeEach(async ({ page }) => {
		const categoriesPage = new CategoriesPage(page)
		categoryName = "Food" + Date.now()
		await categoriesPage.goto()
		await categoriesPage.addCategory(categoryName)

		expensesPage = new ExpensesPage(page)
		await expensesPage.goto()
		await expensesPage.expectPageLoaded()
	})

	test("should add a new expense and verify it appears in the table", async () => {
		// Test data for the new expense
		const newExpense = {
			title: "Test Expense " + Date.now(),
			description: "Test description for automated test",
			amount: 42.5,
			category: categoryName,
			source: "Revolut",
		}

		// Step 1: Click Add Expense button and verify modal opens
		await expensesPage.openAddExpenseForm()

		// Step 2: Fill in the expense form
		await expensesPage.fillExpenseForm(newExpense)

		// Step 3: Submit the form
		await expensesPage.submitExpenseForm()

		await expensesPage.expectExpenseExists(newExpense)
	})
})

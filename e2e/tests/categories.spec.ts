import { expect, test } from "@playwright/test"
import { CategoriesPage } from "../page-objects/categories-page"

test.describe("Categories Dashboard", () => {
	let categoriesPage: CategoriesPage

	test.beforeEach(async ({ page }) => {
		categoriesPage = new CategoriesPage(page)
		await categoriesPage.goto()
	})

	test("should display the categories page", async () => {
		await expect(categoriesPage.pageTitle).toBeVisible()
		await expect(categoriesPage.pageTitle).toHaveText("Categories")
	})

	test("should add a new category and display it in the list", async () => {
		const newCategoryName = `Test Category ${Date.now()}`

		await categoriesPage.clickAddCategoryButton()
		await categoriesPage.fillCategoryForm(newCategoryName)
		await categoriesPage.submitCategoryForm()

		await expect(categoriesPage.findCategoryByName(newCategoryName)).toBeVisible()
	})

	test("should edit an existing category", async () => {
		// Create a category if none exists
		const initialEmptyState = await categoriesPage.emptyState.isVisible()
		if (initialEmptyState) {
			const tempCategory = "Temporary Category"
			await categoriesPage.addCategory(tempCategory)
		}

		// Get the first category name
		const oldCategoryName = await categoriesPage.getLastCategoryName()
		const newCategoryName = `Edited Category ${Date.now()}`

		// Edit the category
		await categoriesPage.editLastCategory(newCategoryName)

		// Verify the category was updated
		await expect(categoriesPage.findCategoryByName(newCategoryName)).toBeVisible()
		await expect(categoriesPage.findCategoryByName(oldCategoryName)).toBeHidden()
	})

	test("should delete a category", async () => {
		const tempCategory = "Category to Delete" + Date.now()
		await categoriesPage.addCategory(tempCategory)

		await categoriesPage.deleteLastCategory()

		await expect(categoriesPage.findCategoryByName(tempCategory)).not.toBeVisible()
	})
})

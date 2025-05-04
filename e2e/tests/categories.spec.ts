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
})

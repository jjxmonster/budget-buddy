import { expect, test } from "@playwright/test"
import { SourcesPage } from "../page-objects/sources-page"

test.describe("Sources Management", () => {
	test("should add a new source", async ({ page }) => {
		// Arrange
		const sourcesPage = new SourcesPage(page)
		const sourceNameToAdd = `Bank Account ${Date.now()}`

		await sourcesPage.goto()
		await sourcesPage.addSource(sourceNameToAdd)

		await sourcesPage.expectSourceExists(sourceNameToAdd)
	})

	test("should delete a source", async ({ page }) => {
		// Arrange
		const sourcesPage = new SourcesPage(page)
		const sourceNameToDelete = `Source to Delete ${Date.now()}`

		// Create a source first
		await sourcesPage.goto()
		await sourcesPage.addSource(sourceNameToDelete)

		// Act
		await sourcesPage.deleteLastSource()

		await sourcesPage.expectSourceExists(sourceNameToDelete)
	})
})

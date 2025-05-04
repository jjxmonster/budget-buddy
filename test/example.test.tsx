import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

describe("Sample test", () => {
	it("should pass a basic test", () => {
		expect(true).toBe(true)
	})

	it("can render a simple component", () => {
		render(<div data-testid="sample">Hello, World!</div>)
		expect(screen.getByTestId("sample")).toBeDefined()
	})
})

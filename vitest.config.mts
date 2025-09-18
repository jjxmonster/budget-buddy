import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"
import { resolve } from "path"

export default defineConfig({
	// @ts-expect-error - Plugin version compatibility issue between vite versions
	plugins: [tsconfigPaths(), react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./test/setup.ts"],
		include: ["**/*.test.{ts,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			reportsDirectory: "./coverage/unit",
			exclude: ["node_modules/", ".next/", "test/", "**/*.d.ts", "**/*.config.{js,ts}"],
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./"),
		},
	},
})

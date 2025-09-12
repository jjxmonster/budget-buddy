"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ChatApiKeyProps {
	apiKey: string
	onChange: (value: string) => void
}

export function ChatApiKey({ apiKey, onChange }: ChatApiKeyProps) {
	return (
		<div className="bg-muted/50 border-b p-4">
			<div className="space-y-2">
				<Label htmlFor="api-key" className="text-sm font-medium">
					OpenRouter API Key
				</Label>
				<Input
					id="api-key"
					type="password"
					value={apiKey}
					onChange={(e) => onChange(e.target.value)}
					placeholder="sk-or-v1-..."
					className="text-sm"
				/>
				<p className="text-muted-foreground text-xs">Provide your own OpenRouter API key.</p>
			</div>
		</div>
	)
}

"use client"

import * as React from "react"
import { Tooltip as RechartsTooltip, TooltipProps } from "recharts"
import { cn } from "@/utils/helpers"

export type ChartConfig = Record<string, { label?: string; color?: string; icon?: React.ReactNode }>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	config: ChartConfig
}

const ChartContext = React.createContext<ChartConfig>({})

function ChartContainer({ className, children, config, style, ...props }: ChartContainerProps) {
	const styleVars: Record<string, string> = {}
	for (const [key, value] of Object.entries(config)) {
		if (value?.color) {
			styleVars[`--color-${key}`] = String(value.color)
		}
	}
	return (
		<ChartContext.Provider value={config}>
			<div
				data-slot="chart-container"
				className={cn("relative w-full", className)}
				style={{ ...(style || {}), ...(styleVars as unknown as React.CSSProperties) }}
				{...props}
			>
				{children}
			</div>
		</ChartContext.Provider>
	)
}

function useChartConfig() {
	return React.useContext(ChartContext)
}

function ChartTooltip(props: TooltipProps<number, string>) {
	return <RechartsTooltip {...props} />
}

interface RechartsPayloadItem {
	color?: string
	name?: string
	value?: number | string
	payload?: Record<string, unknown>
}

type ChartTooltipContentProps = {
	active?: boolean
	payload?: RechartsPayloadItem[]
	label?: unknown
	className?: string
	nameKey?: string
	labelFormatter?: (value: unknown) => string
	hideLabel?: boolean
}

function ChartTooltipContent({
	active,
	payload,
	label,
	className,
	nameKey,
	labelFormatter,
	hideLabel,
}: ChartTooltipContentProps) {
	if (!active || !payload || payload.length === 0) return null
	const formattedLabel = labelFormatter ? labelFormatter(label) : String(label ?? "")
	return (
		<div className={cn("bg-popover text-popover-foreground rounded-md border p-2 shadow-md", className)}>
			{!hideLabel && <div className="text-muted-foreground mb-1 text-xs">{formattedLabel}</div>}
			<div className="space-y-0.5">
				{payload.map((entry: RechartsPayloadItem, idx: number) => {
					// Prefer a custom field from the datum when nameKey is provided; fallback to entry.name
					const payloadName =
						nameKey && entry?.payload && entry.payload[nameKey] != null
							? String(entry.payload[nameKey] as unknown as string)
							: entry.name
					return (
						<div key={idx} className="flex items-center justify-between gap-6 text-sm">
							<span className="flex items-center gap-2">
								<span className="inline-block h-2 w-2 rounded-sm" style={{ background: entry.color }} />
								{payloadName}
							</span>
							<span className="font-medium">{entry.value?.toLocaleString?.() ?? entry.value}</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, useChartConfig }


"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  minutes: {
    label: "Minutes",
    color: "hsl(var(--chart-1))",
  },
  workouts: {
    label: "Workouts",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type ProgressChartProps = {
    data: {
        day: string;
        minutes: number;
        workouts: number;
    }[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="minutes" fill="var(--color-minutes)" radius={4} />
        <Bar dataKey="workouts" fill="var(--color-workouts)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Mon", minutes: 55, workouts: 1 },
  { day: "Tue", minutes: 40, workouts: 1 },
  { day: "Wed", minutes: 70, workouts: 2 },
  { day: "Thu", minutes: 0, workouts: 0 },
  { day: "Fri", minutes: 60, workouts: 1 },
  { day: "Sat", minutes: 90, workouts: 2 },
  { day: "Sun", minutes: 0, workouts: 0 },
]

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

export function ProgressChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
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

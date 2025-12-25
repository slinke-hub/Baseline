
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"

type ProgressChartProps = {
    data: {
        [key: string]: string | number;
    }[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  const chartConfig = useMemo(() => {
    if (!data || data.length === 0) return {};
    
    const keys = Object.keys(data[0]).filter(key => key !== 'day');
    const config: ChartConfig = {};

    const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

    keys.forEach((key, index) => {
        config[key] = {
            label: key.charAt(0).toUpperCase() + key.slice(1),
            color: colors[index % colors.length],
        }
    });

    return config;
  }, [data]);

  const bars = useMemo(() => {
      if (!data || data.length === 0) return [];
      return Object.keys(data[0]).filter(key => key !== 'day');
  }, [data]);

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
        {bars.map(key => (
            <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

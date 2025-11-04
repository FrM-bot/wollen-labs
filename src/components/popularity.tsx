"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

export const description = "A radial chart with a custom shape"

const chartConfig = {
  popularity: {
    label: "popularity",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type PopularityChartProps = {
    chartData: {
        browser: string;
        popularity: number;
        fill: string;
    }[]
}

export function PopularityChart({ chartData }: PopularityChartProps) {
  // Normalize popularity to 0-100 range and calculate end angle (360 degrees = full circle)
  const normalizedPopularity = Math.min(Math.max(chartData[0].popularity, 0), 100)
  const endAngle = (normalizedPopularity / 100) * 360
  
  return (
    <Card className="flex flex-col bg-neutral-50 border-none shadow-none">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={[{ ...chartData[0], popularity: normalizedPopularity }]}
            startAngle={90}
            endAngle={90 - endAngle}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="popularity" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {normalizedPopularity}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          / 100
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Popularity Score
        </div>
        <div className="text-muted-foreground leading-none text-xs">
          Based on recent plays and listener engagement
        </div>
      </CardFooter>
    </Card>
  )
}

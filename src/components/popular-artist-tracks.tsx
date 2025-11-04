"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ArtistTopTrackDTO } from "@/types/dto/track"

const chartConfig = {
  popularity: {
    label: "Popularity",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type PopularArtistTracksProps = {
  tracks: ArtistTopTrackDTO[]
}

export function PopularArtistTracks({ tracks }: PopularArtistTracksProps) {
  // Tomar los top 10 tracks y formatear para el gráfico
  const chartData = tracks.slice(0, 10).map((track) => ({
    name: track.name.length > 20 ? track.name.slice(0, 20) + '...' : track.name,
    fullName: track.name,
    popularity: track.popularity,
  }))

  return (
    <Card className="bg-neutral-50 border-none shadow-none">
      <CardHeader>
        <CardTitle>Track Popularity</CardTitle>
        <CardDescription>Top 10 most popular tracks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                labelFormatter={(_, payload) => payload[0]?.payload?.fullName || ''}
              />}
            />
            <Bar 
              dataKey="popularity" 
              fill="var(--color-popularity)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

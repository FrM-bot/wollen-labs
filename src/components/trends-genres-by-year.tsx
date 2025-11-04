"use client"
import React, { useMemo } from 'react'
import useGenresByYear from '@/app/hooks/use-genres-by-year'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { Spinner } from '@/components/ui/spinner'

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
]

type ChartDataEntry = {
  year: string;
  [genre: string]: string | number;
}

type ProcessedChartData = {
  chartDataArray: ChartDataEntry[];
  topGenres: string[];
}

export default function TrendsGenresByYear() {
  const { data, error, loading } = useGenresByYear("2000,2005,2010,2015,2020,2025", 30)

  // Procesar datos para el gráfico
  const chartData = useMemo((): ProcessedChartData => {
    if (!data || data.length === 0) {
      return { chartDataArray: [], topGenres: [] }
    }

    // Obtener todos los géneros únicos de todos los años
    const allGenres = new Set<string>()
    data.forEach(yearData => {
      yearData.topGenres.forEach(genre => {
        allGenres.add(genre.genre)
      })
    })

    // Crear un mapa de género -> porcentaje por año
    const genreMap = new Map<string, Map<number, number>>()
    allGenres.forEach(genre => {
      genreMap.set(genre, new Map())
    })

    // Rellenar los datos
    data.forEach(yearData => {
      const year = yearData.year
      yearData.topGenres.forEach(genreData => {
        genreMap.get(genreData.genre)?.set(year, genreData.percentage)
      })
    })

    // Calcular el promedio de porcentaje para cada género (para determinar el top)
    const genreAverages = Array.from(genreMap.entries()).map(([genre, percentages]) => {
      const values = Array.from(percentages.values())
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      return { genre, avg }
    })

    // Ordenar por promedio y tomar los top géneros
    const topGenres = genreAverages
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 6)
      .map(g => g.genre)

    // Crear estructura de datos para el gráfico
    const chartDataArray: ChartDataEntry[] = data.map(yearData => {
      const entry: ChartDataEntry = { year: yearData.year.toString() }
      topGenres.forEach(genre => {
        const percentage = genreMap.get(genre)?.get(yearData.year) || 0
        entry[genre] = Number(percentage.toFixed(1))
      })
      return entry
    })

    return { chartDataArray, topGenres }
  }, [data])

  // Configuración del gráfico
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    chartData.topGenres.forEach((genre, index) => {
      config[genre] = {
        label: genre.charAt(0).toUpperCase() + genre.slice(1),
        color: COLORS[index % COLORS.length],
      }
    })
    return config
  }, [chartData.topGenres])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error al cargar los datos: {error.message}</p>
      </div>
    )
  }

  if (!chartData.chartDataArray || chartData.chartDataArray.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="w-full p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Tendencias de Géneros por Año</h2>
        <p className="text-sm text-gray-500">Evolución de los géneros más populares (2020-2025)</p>
      </div>
      
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <LineChart
          data={chartData.chartDataArray}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="year" 
            className="text-xs"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: '#6b7280' }}
            label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft', className: 'text-xs' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {chartData.topGenres.map((genre, index) => (
            <Line
              key={genre}
              type="monotone"
              dataKey={genre}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  )
}

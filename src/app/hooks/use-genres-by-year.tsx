"use client"
import { useState, useEffect } from 'react'
import { Error } from '@/types/utils'
import { Routes } from '@/lib/routes'
import { query } from '@/lib/query-client'
import { ResponseDTO } from "@/types/utils";

export type GenreCount = {
  genre: string;
  count: number;
  percentage: number;
};

export type YearGenreData = {
  year: number;
  totalTracks: number;
  genres: GenreCount[];
  topGenres: GenreCount[];
};

export default function useGenresByYear(years: string = "2020,2021,2022,2023,2024,2025", limit: number = 30) {
    const [state, setState] = useState({
        data: [] as YearGenreData[],
        error: null as Error | null,
        loading: true
    })

    useEffect(() => {
        const url = `${Routes.api.genres.analyze}?years=${years}&limit=${limit}`;
        query.get<ResponseDTO<YearGenreData[]>>(url)
            .then(({ data, error }) => {
                if (error || !data) {
                    setState(prev => ({ ...prev, error, loading: false }))
                    return
                }
                setState(prev => ({ ...prev, data: data, loading: false }))
            })
            .catch((err) => {
                setState(prev => ({ ...prev, error: err, loading: false }))
            })
    }, [years, limit])

    return {
        data: state.data,
        error: state.error,
        loading: state.loading
    }
}


"use client"
import { useState, useEffect } from 'react'
import { Error } from '@/types/utils'
import { TopArtistDTO } from '@/types/dto/artist'
import { Routes } from '@/lib/routes'
import { query } from '@/lib/query-client'
import { ResponseDTO } from "@/types/utils";

export default function useTopArtists() {
    const [state, setState] = useState({
        artists: [] as TopArtistDTO[],
        error: null as Error | null,
        loading: true
    })

    useEffect(() => {
        query.get<ResponseDTO<TopArtistDTO[]>>(Routes.api.artists.topArtists)
            .then(({ data, error }) => {
                if (error || !data) {
                    setState(prev => ({ ...prev, error, loading: false }))
                    return
                }
                setState(prev => ({ ...prev, artists: data, loading: false }))
            })
            .catch((err) => {
                setState(prev => ({ ...prev, error: err, loading: false }))
            })
    }, [])

    return {
        data: state.artists,
        error: state.error,
        loading: state.loading
    }
}

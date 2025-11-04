"use client"
import { useState, useEffect } from 'react'
import { Error } from '@/types/utils'
import { TopTrackDTO } from '@/types/dto/track'
import { Routes } from '@/lib/routes'
import { query } from '@/lib/query-client'
import { ResponseDTO } from "@/types/utils";

export default function useTopTracks() {
    const [state, setState] = useState({
        tracks: [] as TopTrackDTO[],
        error: null as Error | null,
        loading: true
    })

    useEffect(() => {
        query.get<ResponseDTO<TopTrackDTO[]>>(Routes.api.tracks.topTracks)
            .then(({ data, error }) => {
                if (error || !data) {
                    setState({ ...state, error, loading: false })
                    return
                }
                setState({ ...state, tracks: data, loading: false })
            })
            .catch((err) => {
                setState({ ...state, error: err, loading: false })
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        data: state.tracks,
        error: state.error,
        loading: state.loading
    }
}

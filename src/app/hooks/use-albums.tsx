"use client"
import { useState, useEffect } from 'react'
import { Error } from '@/types/utils'
import { AlbumDTO as Album } from '@/types/dto/album'
import { Routes } from '@/lib/routes'
import { query } from '@/lib/query-client'
import { ResponseDTO } from "@/types/utils";

export default function useAlbums() {
    const [state, setState] = useState({
        albums: [] as Album[],
        error: null as Error | null,
        loading: true
    })

    useEffect(() => {
        query.get<ResponseDTO<Album[]>>(Routes.api.albums.several())
            .then(({ data, error }) => {
                if (error || !data) {
                    setState({ ...state, error })
                    return
                }
                setState({ ...state, albums: data })
            })
            .catch((err) => {
                setState({ ...state, error: err })
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        data: state.albums,
        error: state.error,
        loading: state.loading
    }
}

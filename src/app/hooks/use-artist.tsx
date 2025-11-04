import { useState, useEffect } from 'react'
import { Error } from '@/types/utils'
import { ArtistDTO } from '@/types/dto/artist'
import { ArtistTopTrackDTO } from '@/types/dto/track'
import { Routes } from '@/lib/routes'
import { query } from '@/lib/query-client'
import { ResponseDTO } from "@/types/utils";

export default function useArtist({ id }: { id?: string }) {
    const [state, setState] = useState<{
        data: {
            artist: ArtistDTO,
            topTracks: ArtistTopTrackDTO[]
        } | null
        error: Error | null
        loading: boolean
    }>(() => ({
        data: null,
        error: !id ? { message: 'No ID provided', status: 400 } : null,
        loading: !!id
    }))

    useEffect(() => {
        if (!id) return
        
        query.get<ResponseDTO<{ artist: ArtistDTO, topTracks: ArtistTopTrackDTO[] }>>(Routes.api.artists.details(id))
            .then(({ data, error }) => {
                if (error || !data) {
                    setState({ data: null, error, loading: false })
                    return
                }
                setState({ data, error: null, loading: false })
            })
            .catch((err) => {
                setState({ data: null, error: err, loading: false })
            })
    }, [id])

    return {
        data: state.data,
        error: state.error,
        loading: state.loading
    }
}

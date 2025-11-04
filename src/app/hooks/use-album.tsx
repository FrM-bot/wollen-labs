import { useState, useEffect } from 'react'
import { Error } from '@/types/utils'
import { AlbumDetailsDTO } from '@/types/dto/album'
import { Routes } from '@/lib/routes'
import { query } from '@/lib/query-client'
import { ResponseDTO } from "@/types/utils";

export default function useAlbum({ id }: { id?: string }) {
    const [state, setState] = useState<{
        album: AlbumDetailsDTO | null
        error: Error | null
        loading: boolean
    }>(() => ({
        album: null,
        error: !id ? { message: 'No ID provided', status: 400 } : null,
        loading: !!id
    }))

    useEffect(() => {
        if (!id) return


        query.get<ResponseDTO<AlbumDetailsDTO>>(Routes.api.albums.details(id))
            .then(({ data, error }) => {
                if (error || !data) {
                    setState({ album: null, error, loading: false })
                    return
                }
                setState({ album: data, error: null, loading: false })
            })
            .catch((err) => {
                setState({ album: null, error: err, loading: false })
            })
    }, [id])

    return {
        data: state.album,
        error: state.error,
        loading: state.loading
    }
}

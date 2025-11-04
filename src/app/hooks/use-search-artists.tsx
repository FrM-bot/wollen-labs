"use client"
import { useState, useEffect } from 'react'
import { Error } from '@/types/utils'
import { Routes } from '@/lib/routes'
import { query } from '@/lib/query-client'
import { ResponseDTO } from "@/types/utils";

export type SearchArtistDTO = {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  genres: string[];
  popularity: number;
  uri: string;
};

export default function useSearchArtists(searchQuery: string, limit: number = 20) {
    const [state, setState] = useState({
        artists: [] as SearchArtistDTO[],
        error: null as Error | null,
        loading: false
    })

    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === "") {
            // Reset state asynchronously to avoid cascading renders
            const timeoutId = setTimeout(() => {
                setState(prev => ({ ...prev, artists: [], error: null, loading: false }))
            }, 0)
            return () => clearTimeout(timeoutId)
        }

        let cancelled = false
        
        // Set loading state asynchronously
        const loadingTimeoutId = setTimeout(() => {
            if (!cancelled) {
                setState(prev => ({ ...prev, loading: true }))
            }
        }, 0)

        const url = `${Routes.api.search.artists}?q=${encodeURIComponent(searchQuery)}&limit=${limit}`;
        query.get<ResponseDTO<SearchArtistDTO[]>>(url)
            .then(({ data, error }) => {
                if (cancelled) return
                if (error || !data) {
                    setState(prev => ({ ...prev, error, loading: false }))
                    return
                }
                setState(prev => ({ ...prev, artists: data, loading: false }))
            })
            .catch((err) => {
                if (cancelled) return
                setState(prev => ({ ...prev, error: err, loading: false }))
            })

        return () => {
            cancelled = true
            clearTimeout(loadingTimeoutId)
        }
    }, [searchQuery, limit])

    return {
        data: state.artists,
        error: state.error,
        loading: state.loading
    }
}


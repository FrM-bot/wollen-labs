import { useState, useEffect } from 'react'
import { Error } from '@/types/utils'
import { Routes } from '@/lib/routes'
import { query } from '@/lib/query-client'
import type { ArtistTopTracksResponse } from '@/types/in/track'
import { ResponseDTO } from "@/types/utils";

interface AudioFeatures {
  acousticness: number
  danceability: number
  energy: number
  instrumentalness: number
  key: number
  liveness: number
  loudness: number
  mode: number
  speechiness: number
  tempo: number
  time_signature: number
  valence: number
}

interface AudioAnalysis {
  bars: unknown[]
  beats: unknown[]
  sections: unknown[]
  segments: unknown[]
  tatums: unknown[]
}

interface TrackData {
  track: ArtistTopTracksResponse
  audioFeatures: AudioFeatures | null
  audioAnalysis: AudioAnalysis | null
  hasUserAuth: boolean
}

export default function useTrack({ id }: { id?: string }) {
  const [state, setState] = useState<{
    track: TrackData | null
    error: Error | null
    loading: boolean
  }>(() => ({
    track: null,
    error: !id ? { message: 'No ID provided', status: 400 } : null,
    loading: !!id
  }))

  useEffect(() => {
    if (!id) return

    query.get<ResponseDTO<TrackData>>(Routes.api.tracks.details(id))
      .then(({ data, error }) => {
        if (error || !data) {
          setState({ track: null, error, loading: false })
          return
        }
        setState({ track: data, error: null, loading: false })
      })
      .catch((err) => {
        setState({ track: null, error: err, loading: false })
      })
  }, [id])

  return {
    data: state.track,
    error: state.error,
    loading: state.loading
  }
}

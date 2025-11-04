'use client'
import { use } from 'react'
import useAlbum from "@/app/hooks/use-album"
import TrackListItem from "@/components/track-list-itme"
import { Disc } from 'lucide-react'
import Link from 'next/link'
import { Routes } from '@/lib/routes'
import { Spinner } from '@/components/ui/spinner'

export default function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)

    // Fetch album data directly using the query function
    // This properly handles cookies and authentication
    const { data, error, loading } = useAlbum({ id })


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-neutral-400">
                    <Spinner className="size-4" />
                </div>
            </div>
        )
    }

    if (error || !data) {
        return <div>Error: {error?.message || 'Failed to load album'}</div>
    }

    const { album, meta } = data
    const { largestTrack, shortestTrack, totalMinutes, totalSeconds, discsQty } = meta
    const tracks = album.tracks

    return (
        <div>
            {/* Header Section */}
            <div className="px-4 sm:px-6 pt-8 sm:pt-16 pb-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-end max-w-7xl mx-auto">
                    {/* Album Cover */}
                    <div className="shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={album?.images[0]?.url}
                            alt={album?.name}
                            className="w-40 h-40 sm:w-56 sm:h-56 shadow-2xl rounded"
                        />
                    </div>

                    {/* Album Info */}
                    <div className="flex flex-col gap-1 pb-2 text-center sm:text-left w-full sm:w-auto">
                        <p className="text-sm font-semibold">Album</p>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                            {album?.name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 text-sm">
                            <Link 
                            href={Routes.client.artists.details(album?.artists[0]?.id || "")}
                            className="font-semibold hover:text-emerald-500 transition">{album?.artists[0]?.name}</Link>
                            <span>•</span>
                            <span>{new Date(album.release_date).getFullYear()}</span>
                            <span>•</span>
                            <span>{album.total_tracks} songs,</span>
                            <span className="text-neutral-400">
                                {totalMinutes} min {totalSeconds} sec
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Largest vs shortest track */}

            <div className="px-4 sm:px-6 pb-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                    <span className="text-sm font-semibold">Largest song</span>
                    <TrackListItem track={largestTrack} />
                </div>
                <div>
                    <span className="text-sm font-semibold">Shortest song</span>
                    <TrackListItem track={shortestTrack} />
                </div>
            </div>

            {/* Tracks List */}
            <div className="px-6 pb-6 max-w-7xl mx-auto">
                <div className="border-b border-neutral-300 pb-2 mb-2">
                    <div className="grid grid-cols-[16px_1fr_auto] gap-4 px-4 text-sm text-neutral-400">
                        <div className="text-center">#</div>
                        <div>Title</div>
                        <div className="text-center">
                            <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {tracks.map((track) => {
                    let currentDisc = 1
                    if (track.disc_number >= currentDisc && track.track_number === 1 && discsQty > 1) {
                        currentDisc = track.disc_number
                        return <>
                            <div className="px-6 py-4 max-w-7xl mx-auto flex gap-3 items-center">
                                <span>
                                    <Disc className="size-5" />
                                </span>
                                <span className="text-sm font-semibold">Disc {track.disc_number}</span>
                            </div>
                            <TrackListItem
                                key={track.id}
                                track={track}
                                index={track.track_number}
                            />
                        </>
                    }
                    return (
                        <TrackListItem
                            key={track.id}
                            track={track}
                            index={track.track_number}
                        />
                    )
                })}
            </div>
        </div>
    )
}

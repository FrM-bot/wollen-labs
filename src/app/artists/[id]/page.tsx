'use client'
import { use } from 'react'
import useArtist from '@/app/hooks/use-artist'
import { Badge } from '@/components/ui/badge'
import TrackListItem from '@/components/track-list-itme'
import { PopularityChart } from '@/components/popularity'
import { PopularArtistTracks } from '@/components/popular-artist-tracks'
import { Spinner } from '@/components/ui/spinner'

export default function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const { data, error, loading } = useArtist({ id })

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
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Error: {error?.message || 'Failed to load artist'}</div>
            </div>
        )
    }

    const { artist, topTracks } = data

    return (
        <div className="">
            {/* Hero Section */}
            <div
                className="relative h-[400px] rounded-sm w-full"
                style={{
                    backgroundImage: artist.images[0] ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url(${artist.images[0].url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 30%',
                    backgroundAttachment: 'scroll',
                }}
            >
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h1 className="text-7xl font-black mb-6 text-white">{artist.name}</h1>
                    <p className="text-sm text-white font-semibold">
                        {artist.followers.total.toLocaleString()} followers
                    </p>
                </div>
            </div>

            {/* Artist Info */}
            {artist.genres.length > 0 && (
                <div className="px-8 py-6">
                    <h2 className="text-sm font-semibold mb-4">GENRES</h2>
                    <div className="flex flex-wrap gap-2">
                        {artist.genres.map((genre) => (
                            <Badge
                                variant="outline"
                                key={genre}
                                className="p-1 px-3 text-sm bg-white"
                            >
                                {genre}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Tracks */}
            <div className="px-8 py-6">
                <h2 className="text-2xl font-bold mb-6">Popular</h2>
                <div className="space-y-2">
                    {topTracks.map((track, index) => (
                        <TrackListItem
                            key={track.id}
                            track={track}
                            index={index + 1}
                        />
                    ))}
                </div>
            </div>
            {/* Popularity Chart */}
            <PopularityChart
                chartData={[
                    { browser: "safari", popularity: artist.popularity, fill: "var(--color-safari)" },
                ]}
            />
            {/* Popular tracks chart */}
            <div className="px-8 py-6">
                <PopularArtistTracks tracks={topTracks} />
            </div>
        </div>
    )
}

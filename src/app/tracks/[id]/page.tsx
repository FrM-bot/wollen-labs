'use client'
import { use } from 'react'
import useTrack from '@/app/hooks/use-track'
import { PopularityChart } from '@/components/popularity'
import { formatDuration } from '@/lib/utils'
import Link from 'next/link'
import { Routes } from '@/lib/routes'
import { Music, Clock, TrendingUp, Headphones } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const { data, error, loading } = useTrack({ id })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-neutral-400">
                    <Spinner className="size-4" />
                </div>
            </div>
        )
    }

    if (error || !data || !data.track) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Error: {error?.message || 'Failed to load track'}</div>
            </div>
        )
    }

    const { track, audioFeatures } = data
    const trackData = track.tracks[0]
    const albumImage = trackData.album.images[0] || trackData.album.images[1] || trackData.album.images[2]

    return (
        <div className="">
            {/* Hero Section */}
            <div
                className="relative h-[400px] rounded-sm w-full"
                style={{
                    backgroundImage: albumImage ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url(${albumImage.url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 30%',
                    backgroundAttachment: 'scroll',
                }}
            >
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h1 className="text-5xl md:text-7xl font-black mb-4 text-white">{trackData.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white">
                        {trackData.artists.map((artist: { id: string; name: string }, index: number) => (
                            <Link
                                key={artist.id}
                                href={Routes.client.artists.details(artist.id)}
                                className="text-lg font-semibold hover:underline"
                            >
                                {artist.name}
                                {index < trackData.artists.length - 1 && ','}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Track Info */}
            <div className="px-8 py-6 space-y-6">
                {/* Album Info */}
                <div>
                    <h2 className="text-sm font-semibold mb-2 text-gray-500">ALBUM</h2>
                    <Link
                        href={Routes.client.albums.details(trackData.album.id)}
                        className="text-lg font-semibold hover:text-emerald-500 transition"
                    >
                        {trackData.album.name}
                    </Link>
                    {trackData.album.release_date && (
                        <p className="text-sm text-gray-500 mt-1">
                            Released: {new Date(trackData.album.release_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    )}
                </div>

                {/* Track Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm font-semibold">{formatDuration(trackData.duration_ms)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Popularity</p>
                            <p className="text-sm font-semibold">{trackData.popularity}%</p>
                        </div>
                    </div>
                    {audioFeatures && (
                        <>
                            <div className="flex items-center gap-2">
                                <Music className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Tempo</p>
                                    <p className="text-sm font-semibold">{Math.round(audioFeatures.tempo)} BPM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Headphones className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Energy</p>
                                    <p className="text-sm font-semibold">{Math.round(audioFeatures.energy * 100)}%</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Audio Features */}
                {audioFeatures && (
                    <div>
                        <h2 className="text-sm font-semibold mb-4 text-gray-500">AUDIO FEATURES</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Danceability</p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-emerald-500 h-2 rounded-full"
                                        style={{ width: `${audioFeatures.danceability * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{Math.round(audioFeatures.danceability * 100)}%</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Valence</p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${audioFeatures.valence * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{Math.round(audioFeatures.valence * 100)}%</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Acousticness</p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: `${audioFeatures.acousticness * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{Math.round(audioFeatures.acousticness * 100)}%</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Speechiness</p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-orange-500 h-2 rounded-full"
                                        style={{ width: `${audioFeatures.speechiness * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{Math.round(audioFeatures.speechiness * 100)}%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview */}
                {trackData.preview_url && (
                    <div>
                        <h2 className="text-sm font-semibold mb-4 text-gray-500">PREVIEW</h2>
                        <audio controls className="w-full">
                            <source src={trackData.preview_url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}

                {/* Popularity Chart */}
                <div>
                    <h2 className="text-sm font-semibold mb-4 text-gray-500">POPULARITY</h2>
                    <PopularityChart
                        chartData={[
                            { browser: "safari", popularity: trackData.popularity, fill: "var(--color-safari)" },
                        ]}
                    />
                </div>

                {/* External Link */}
                <div>
                    <a
                        href={trackData.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                    >
                        <span>Open in Spotify</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    )
}

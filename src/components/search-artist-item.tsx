import { cn } from "@/lib/utils"
import { SearchArtistDTO } from "@/app/hooks/use-search-artists"
import { Users, Music } from 'lucide-react'
import Link from 'next/link'
import { Routes } from "@/lib/routes"

type Props = {
    artist: SearchArtistDTO
}

const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
}

export default function SearchArtistItem({ artist }: Props) {
    const imageUrl = artist.images[0]?.url || artist.images[1]?.url

    return (
        <Link href={Routes.client.artists.details(artist.id)}>
            <div
                className={cn(
                    "grid grid-cols-[80px_1fr] gap-4 p-4 hover:bg-white border border-transparent hover:border-neutral-100 rounded-lg group transition cursor-pointer"
                )}
            >
                <div className="relative aspect-square rounded-md overflow-hidden bg-neutral-100">
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imageUrl}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-8 h-8 text-neutral-400" />
                        </div>
                    )}
                </div>

                <div className='flex-1 min-w-0 flex flex-col justify-center'>
                    <h3 className='text-base font-semibold truncate group-hover:text-emerald-500 transition-colors mb-1'>
                        {artist.name}
                    </h3>
                    <div className='flex items-center gap-4 flex-wrap'>
                        <span className='flex items-center gap-1 text-xs text-zinc-500'>
                            <Users className='w-3 h-3' />
                            {formatNumber(artist.followers.total)} followers
                        </span>
                        {artist.genres.length > 0 && (
                            <span className='text-xs text-zinc-500'>
                                {artist.genres.slice(0, 2).join(", ")}
                                {artist.genres.length > 2 && "..."}
                            </span>
                        )}
                        <span className='text-xs text-zinc-500'>
                            Popularity: {artist.popularity}%
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}


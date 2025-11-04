import { cn } from "@/lib/utils"
import { TopArtistDTO } from "@/types/dto/artist"
import { TrendingUp, Users } from 'lucide-react'

type Props = {
    artist: TopArtistDTO
    index?: number
}

const formatNumber = (num: string) => {
    const n = parseInt(num)
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toString()
}

export default function TopArtistListItem({ artist, index }: Props) {
    return (
        <div
            key={artist.mbid}
            className={
                cn(
                    !index ? "grid-cols-[1fr_auto]" : "grid-cols-[16px_1fr]",
                    "grid gap-4 px-4 py-2 hover:bg-white border border-transparent hover:border-neutral-100 rounded-sm group transition"
                )
            }
        >
            {index && (
                <div className="text-neutral-400 text-sm text-center flex items-center justify-center">
                    {index}
                </div>
            )}


            <div className='flex-1 min-w-0'>
                <h3 className='text-sm font-semibold truncate group-hover:text-emerald-500 transition-colors'>
                    {artist.name}
                </h3>
                <div className='flex items-center gap-3 mt-1'>
                    <span className='flex items-center gap-1 text-[10px] text-zinc-500'>
                        <Users className='w-3 h-3' />
                        {formatNumber(artist.listeners)}
                    </span>
                    <span className='flex items-center gap-1 text-[10px] text-zinc-500'>
                        <TrendingUp className='w-3 h-3' />
                        {formatNumber(artist.playcount)}
                    </span>
                </div>
            </div>
        </div>
    )
}

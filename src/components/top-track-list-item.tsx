
import { cn } from "@/lib/utils"
import { TopTrackDTO } from "@/types/dto/track"
import { TrendingUp, Users } from 'lucide-react'

type Props = {
    track: TopTrackDTO
    index?: number
}

const formatNumber = (num: string) => {
    const n = parseInt(num)
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toString()
}

const formatDuration = (seconds: string) => {
    const s = parseInt(seconds)
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function TopTrackListItem({ track, index }: Props) {

    return (
        <div
            key={track.mbid}
            className={
                cn(
                    !index ? "grid-cols-[1fr_auto]" : "grid-cols-[16px_1fr_auto]",
                    "grid gap-4 px-4 py-2 hover:bg-white border border-transparent hover:border-neutral-100 rounded-sm group transition"
                )
            }
        >
            {index && (
                <div className="text-neutral-400 text-sm text-center flex items-center justify-center">
                    {index}
                </div>
            )}

            <div className="flex flex-col min-w-0">
                <span className="font-medium truncate group-hover:text-green-500 transition text-sm">
                    {track.name}
                </span>
                <div className="flex gap-1 text-sm text-neutral-400">
                    <span className="hover:text-green-500 hover:underline transition text-xs">
                        {track.artist.name}
                    </span>
                </div>
                <div className='flex items-center gap-3 mt-1'>
                    <span className='flex items-center gap-1 text-[10px] text-zinc-500'>
                        <Users className='w-3 h-3' />
                        {formatNumber(track.listeners)}
                    </span>
                    <span className='flex items-center gap-1 text-[10px] text-zinc-500'>
                        <TrendingUp className='w-3 h-3' />
                        {formatNumber(track.playcount)}
                    </span>
                </div>
            </div>

            <div className="text-neutral-400 text-sm flex items-center">
                {formatDuration(track.duration)}
            </div>
        </div>
    )
}
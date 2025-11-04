import useTopTracks from '@/app/hooks/use-top-tracks'
import TopTrackListItem from './top-track-list-item'
import { ScrollArea } from './ui/scroll-area'

export default function TopTracksTab() {
    const { data, error, loading } = useTopTracks()
    if (loading) {
        return (
            <aside className='w-80 p-6'>
                <div className='space-y-3'>
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className='flex gap-3 animate-pulse'>
                            <div className='w-14 h-14 bg-neutral-200 rounded-md' />
                            <div className='flex-1 space-y-2'>
                                <div className='h-4 bg-neutral-200 rounded w-3/4' />
                                <div className='h-3 bg-neutral-200 rounded w-1/2' />
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        )
    }

    if (error) {
        return (
            <aside className='w-80 p-6'>
                <p className='text-zinc-400 text-sm'>Error loading tracks</p>
            </aside>
        )
    }
    return (
        <ScrollArea className="overflow-y-auto rounded-md bg-white border border-neutral-100">
            {data.sort((a, b) => Number(b.playcount) - Number(a.playcount)).map((track, index) => {
                return <TopTrackListItem key={track.mbid || index} track={track} index={index + 1} />
            })}
        </ScrollArea>
    )
}

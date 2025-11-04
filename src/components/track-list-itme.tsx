
import { Routes } from "@/lib/routes"
import { cn, formatDuration } from "@/lib/utils"
import { AlbumDetailsDTO } from "@/types/dto/album"
import Link from "next/link"

type Props = {
    track: AlbumDetailsDTO['album']['tracks'][number]
    index?: number
}
export default function TrackListItem({ track, index }: Props) {

    return (
        <div
            key={track.id}
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
                <Link href={Routes.client.tracks.details(track.id)} className="font-medium truncate group-hover:text-green-500 transition">
                    {track.name}
                </Link>
                <div className="flex gap-1 text-sm text-neutral-400">
                    {track.artists.map((artist, index) => (
                        <span key={artist.id}>
                            <Link href={Routes.client.artists.details(artist.id)} className="hover:text-green-500 hover:underline transition">
                                {artist.name}
                            </Link>
                            {index < track.artists.length - 1 && ", "}
                        </span>
                    ))}
                </div>
            </div>

            <div className="text-neutral-400 text-sm flex items-center">
                {formatDuration(track.duration_ms)}
            </div>
        </div>
    )
}
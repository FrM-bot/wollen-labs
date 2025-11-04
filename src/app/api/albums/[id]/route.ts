import { query } from "@/lib/query-spotify";
import { NextRequest } from "next/server";
import { MILI_TO_MIN, MILI_TO_SEC } from "@/lib/utils";
import { createResponse } from "@/lib/response";
import type { AlbumDetailResponse } from "@/types/in/album";
import type { AlbumDetailsDTO } from "@/types/dto/album";
import { Endpoints } from "@/lib/endpoints";

function formatAlbum(album: AlbumDetailResponse) {
    return {
        id: album.id,
        images: album.images,
        uri: album.uri,
        name: album.name,
        artists: album.artists,
        release_date: album.release_date,
        total_tracks: album.total_tracks,
        tracks: album.tracks?.items?.map((track) => ({
            duration_ms: track.duration_ms,
            disc_number: track.disc_number,
            track_number: track.track_number,
            id: track.id,
            name: track.name,
            artists: track.artists
        }))
    }
}

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/albums/[id]">
) {
  const { id } = await ctx.params;

  const { data, error, status } = await query<AlbumDetailResponse>(
    Endpoints.spotify.albums.details(id)
  );

  if (error || !data) return createResponse(null, error, status)
  

  // Calculate total duration
  const totalDurationMs = data?.tracks?.items?.reduce(
    (acc, track) => acc + track.duration_ms,
    0
  );
  const totalMinutes = Math.floor(totalDurationMs / MILI_TO_MIN);
  const totalSeconds = Math.floor(
    (totalDurationMs % MILI_TO_MIN) / MILI_TO_SEC
  );

  const largestTrack = data?.tracks?.items?.reduce((a, b) =>
    a.duration_ms > b.duration_ms ? a : b
  )

  const shortestTrack = data?.tracks?.items?.reduce((a, b) =>
    a.duration_ms < b.duration_ms ? a : b
  )

  const discsQty = data?.tracks?.items?.reduce((acc, track) => {
    if (track.disc_number > acc) {
      acc = track.disc_number
    }
    return acc
  }, 1)

  return createResponse<AlbumDetailsDTO>({
    album: formatAlbum(data),
    meta: {
      largestTrack,
      shortestTrack,
      totalMinutes,
      totalSeconds,
      discsQty,
    },
  }, error, status)
}

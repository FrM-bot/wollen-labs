import { query } from "@/lib/query-last-fm";
import type { TopTracksResponse } from "@/types/in/track";
import type { TopTrackDTO } from "@/types/dto/track";
import { Endpoints } from "@/lib/endpoints";
import { createResponse } from "@/lib/response";

function formatTopTracks(topTracks: TopTracksResponse): TopTrackDTO[] {
  return topTracks.tracks.track.map((track) => ({
    image: track.image,
    name: track.name,
    duration: track.duration,
    listeners: track.listeners,
    playcount: track.playcount,
    mbid: track.mbid,
    artist: track.artist,
  }))
}

export async function GET(): Promise<Response> {
  const response = await query
    .addParams({
      method: "chart.gettoptracks",
      format: "json",
    })
    .get<TopTracksResponse>(Endpoints.lastfm.tracks.topTracks());

  if (!response?.tracks?.track) {
    return createResponse<null>(null, {
      message: 'Error to get top tracks',
      status: 500
    }, 500);
  }

  const tracks = formatTopTracks(response)

  return createResponse(tracks, null, 200);
}

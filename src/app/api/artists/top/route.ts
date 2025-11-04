import { query } from "@/lib/query-last-fm";
import type { TopArtistsResponse } from "@/types/in/artist";
import type { TopArtistDTO } from "@/types/dto/artist";
import { Endpoints } from "@/lib/endpoints";
import { createResponse } from "@/lib/response";

function formatTopArtists(topArtists: TopArtistsResponse): TopArtistDTO[] {
  return topArtists.artists.artist.map((artist) => ({
    image: artist.image,
    name: artist.name,
    listeners: artist.listeners,
    playcount: artist.playcount,
    mbid: artist.mbid,
    url: artist.url,
  }))
}

export async function GET(): Promise<Response> {
  const response = await query
    .addParams({
      method: "chart.gettopartists",
      format: "json",
    })
    .get<TopArtistsResponse>(Endpoints.lastfm.artists.topArtists());

  if (!response?.artists?.artist) {
    return createResponse<null>(null, {
      message: 'Error to get top artists',
      status: 500
    }, 500);
  }

  const artists = formatTopArtists(response)

  return createResponse(artists, null, 200);
}

import { query } from "@/lib/query-spotify"
import { NextRequest } from "next/server";
import type { ArtistDetailResponse } from "@/types/in/artist";
import { createResponse } from "@/lib/response";
import { ArtistTopTracksResponse } from "@/types/in/track";
import { ArtistDTO } from "@/types/dto/artist";
import { ArtistTopTrackDTO } from "@/types/dto/track";
import { Endpoints } from "@/lib/endpoints";

function formatArtist(artist: ArtistDetailResponse): ArtistDTO {
    return {
        id: artist.id,
        images: artist.images,
        uri: artist.uri,
        name: artist.name,
        followers: artist.followers,
        genres: artist.genres,
        popularity: artist.popularity,
    }
}

function formatTopTracks(topTracks: ArtistTopTracksResponse): ArtistTopTrackDTO[] {
    return topTracks.tracks.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists,
        duration_ms: track.duration_ms,
        disc_number: track.disc_number,
        track_number: track.track_number,
        popularity: track.popularity,
    }))
}

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/artists/[id]">
) {
  const { id } = await ctx.params;

  const {
    data: artist,
    error: artistError,
    status: artistStatus
  } = await query<ArtistDetailResponse>(Endpoints.spotify.artists.details(id));

  const {
    data: topTracks,
    error: topTracksError,
    status: topTracksStatus
  } = await query<ArtistTopTracksResponse>(Endpoints.spotify.artists.topTracks(id));

  if (artistError || !artist) {
    return createResponse(
      null,
      artistError,
      artistStatus
    );
  }

  if (topTracksError || !topTracks) {
    return createResponse(
      null,
      topTracksError,
      topTracksStatus
    );
  }

  return createResponse<{
    artist: ArtistDTO,
    topTracks: ArtistTopTrackDTO[]
  }>({ artist: formatArtist(artist), topTracks: formatTopTracks(topTracks) },
    artistError,
    artistStatus
  );
}

import { query } from "@/lib/query-spotify"
import { NextRequest } from "next/server";
import { createResponse } from "@/lib/response";
import { Endpoints } from "@/lib/endpoints";
import { getUserToken } from "@/lib/auth";
import type { ArtistTopTracksResponse } from "@/types/in/track";

type SpotifyTrack = {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    release_date: string;
    external_urls: {
      spotify: string;
    };
  };
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  uri: string;
};

type TrackData = {
  track: ArtistTopTracksResponse;
  audioFeatures: null;
  audioAnalysis: null;
  hasUserAuth: boolean;
};

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/tracks/[id]">
) {
  const { id } = await ctx.params;
  const userToken = await getUserToken();
  const hasUserAuth = !!userToken;

  // Get track details - Spotify returns a single track object
  const { data: trackData, error: trackError, status: trackStatus } = 
    await query<SpotifyTrack>(Endpoints.spotify.tracks.details(id), {
      useUserToken: true,
    });

  if (trackError || !trackData) {
    return createResponse(null, trackError, trackStatus);
  }

  // Wrap track in the expected format to match ArtistTopTracksResponse
  const trackResponse: ArtistTopTracksResponse = {
    tracks: [trackData as ArtistTopTracksResponse['tracks'][number]]
  };

  const response: TrackData = {
    track: trackResponse,
    audioFeatures: null,
    audioAnalysis: null,
    hasUserAuth,
  };

  return createResponse<TrackData>(response, null, 200);
}


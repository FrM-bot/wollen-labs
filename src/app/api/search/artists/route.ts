import { query } from "@/lib/query-spotify"
import { NextRequest } from "next/server";
import { createResponse } from "@/lib/response";
import { Endpoints } from "@/lib/endpoints";

type SpotifyArtistSearchItem = {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  genres: string[];
  popularity: number;
  uri: string;
};

type SpotifySearchResponse = {
  artists: {
    items: SpotifyArtistSearchItem[];
    total: number;
  };
};

type SearchArtistDTO = {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  genres: string[];
  popularity: number;
  uri: string;
};

function formatArtist(artist: SpotifyArtistSearchItem): SearchArtistDTO {
  return {
    id: artist.id,
    name: artist.name,
    images: artist.images,
    followers: artist.followers,
    genres: artist.genres,
    popularity: artist.popularity,
    uri: artist.uri,
  };
}

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;
  const queryParam = searchParams.get("q");
  const limitParam = searchParams.get("limit");

  if (!queryParam || queryParam.trim() === "") {
    return createResponse<null>(
      null,
      { message: "Query parameter 'q' is required", status: 400 },
      400
    );
  }

  const limit = limitParam
    ? Math.min(Math.max(parseInt(limitParam), 1), 50)
    : 20;

  const { data, error, status } = await query<SpotifySearchResponse>(
    Endpoints.spotify.search,
    {
      params: {
        q: queryParam,
        type: "artist",
        limit: limit.toString(),
        market: "US",
      },
      useUserToken: true,
    }
  );

  if (error || !data) {
    return createResponse<null>(null, error, status);
  }

  const artists = data.artists?.items?.map(formatArtist) || [];

  return createResponse<SearchArtistDTO[]>(artists, null, 200);
}


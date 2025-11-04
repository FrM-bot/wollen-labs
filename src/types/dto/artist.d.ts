import type { ArtistDetailResponse, TopArtistsResponse } from "@/types/in/artist"

export type ArtistDTO = Pick<ArtistDetailResponse, "id" | "images" | "uri" | "name" | "followers" | "genres" | "popularity">;

export type TopArtistDTO = Pick<TopArtistsResponse['artists']['artist'][number], 'name' | 'playcount' | 'listeners' | 'mbid' | 'url' | 'image'>;

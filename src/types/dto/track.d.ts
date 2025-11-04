import type { ArtistTopTracksResponse, TopTracksResponse } from "@/types/in/track"

export type ArtistTopTrackDTO = Pick<ArtistTopTracksResponse['tracks'][number], "duration_ms" | "disc_number" | "track_number" | "id" | "name" | "artists" | "popularity">

export type TopTrackDTO = Pick<TopTracksResponse['tracks']["track"][number], 'artist' | 'duration' | 'listeners' | 'name' | 'playcount' | 'mbid' | 'image'>
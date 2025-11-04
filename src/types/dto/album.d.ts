import type { AlbumResponse } from "@/types/in/album";

export type AlbumDetails = Pick<
  typeof AlbumResponse,
  | "id"
  | "images"
  | "uri"
  | "name"
  | "artists"
  | "release_date"
  | "total_tracks"
> & {
  tracks: Pick<AlbumResponse["tracks"]["items"][number], "duration_ms" | "disc_number" | "track_number" | "id" | "name" | "artists">[];
};


export interface AlbumDetailsDTO {
  album: AlbumDetails;
  meta: {
    largestTrack: AlbumDetails["tracks"]["items"][number];
    shortestTrack: AlbumDetails["tracks"]["items"][number];
    totalMinutes: number;
    totalSeconds: number;
    discsQty: number;
  };
}

export type AlbumDTO = Pick<AlbumResponse, "id" | "images" | "uri" | "name">;
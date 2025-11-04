import { query } from "@/lib/query-spotify";
import type { AlbumResponse } from "@/types/in/album";
import { ALBUMS_ID } from "@/data/albums";
import type { AlbumDTO } from "@/types/dto/album";
import { Endpoints } from "@/lib/endpoints";
import { createResponse } from "@/lib/response";

function formatAlbum(album: AlbumResponse): AlbumDTO {
  return {
    id: album.id,
    images: album.images,
    uri: album.uri,
    name: album.name,
  };
}

export async function GET(): Promise<Response> {
  const { data, error, status } = await query<{ albums: AlbumResponse[] }>(
    Endpoints.spotify.albums.several(),
    {
      params: {
        ids: ALBUMS_ID.join(","),
      },
      useUserToken: true
    }
  );

  if (!data?.albums || error) {
    return createResponse<null>(null, error, status);
  }

  const albums = data?.albums?.map((album) => formatAlbum(album));

  return createResponse<AlbumDTO[]>(albums, error, status);
}

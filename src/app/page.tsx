"use client"
import AlbumsList from "@/components/albums-list";
import { Typography } from "@/components/typography";
import useAlbums from "./hooks/use-albums";
import TrendsGenresByYear from "@/components/trends-genres-by-year";

export default function Home() {
  const { data, error } = useAlbums()

  if (error) {
    return (
      <div className="p-4">
        <Typography size="heading">Discover new albums</Typography>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col">
      <Typography size="heading">Discover new albums</Typography>
      <div>
        <AlbumsList albums={data} />
      </div>
      <TrendsGenresByYear />
    </div>
  );
}

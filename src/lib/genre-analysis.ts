import { query } from "./query-spotify";
import { Endpoints } from "./endpoints";

// Tipos para las respuestas de Spotify
type SpotifyTrack = {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    release_date: string;
    name: string;
  };
  popularity: number;
};

type SpotifySearchResponse = {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
};

type SpotifyArtist = {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
};

type SpotifyArtistsResponse = {
  artists: SpotifyArtist[];
};

type GenreCount = {
  genre: string;
  count: number;
  percentage: number;
};

type YearGenreData = {
  year: number;
  totalTracks: number;
  genres: GenreCount[];
  topGenres: GenreCount[];
};

/**
 * Busca tracks populares de un año específico
 */
export async function searchTracksByYear(
  year: number,
  limit: number = 50
): Promise<SpotifyTrack[]> {
  const response = await query<SpotifySearchResponse>(Endpoints.spotify.search, {
    params: {
      q: `year:${year}`,
      type: "track",
      limit: limit.toString(),
      market: "US",
    },
  });

  if (response.error || !response.data) {
    console.error(`Error buscando tracks del año ${year}:`, response.error);
    return [];
  }

  return response.data.tracks?.items || [];
}

/**
 * Obtiene información de múltiples artistas (hasta 50 por request)
 */
export async function getArtistsBatch(
  artistIds: string[]
): Promise<SpotifyArtist[]> {
  if (artistIds.length === 0) return [];

  // Spotify permite hasta 50 IDs por request
  const batchSize = 50;
  const batches: string[][] = [];

  for (let i = 0; i < artistIds.length; i += batchSize) {
    batches.push(artistIds.slice(i, i + batchSize));
  }

  const allArtists: SpotifyArtist[] = [];

  for (const batch of batches) {
    const response = await query<SpotifyArtistsResponse>(Endpoints.spotify.artists.several(), {
      params: {
        ids: batch.join(","),
      },
    });

    if (response.data?.artists) {
      allArtists.push(...response.data.artists);
    }

    // Pequeña pausa para no saturar la API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return allArtists;
}

/**
 * Cuenta y calcula porcentajes de géneros
 */
function calculateGenrePercentages(
  genreCounts: Map<string, number>,
  total: number
): GenreCount[] {
  const genres: GenreCount[] = [];

  genreCounts.forEach((count, genre) => {
    genres.push({
      genre,
      count,
      percentage: (count / total) * 100,
    });
  });

  // Ordenar por count descendente
  return genres.sort((a, b) => b.count - a.count);
}

/**
 * Analiza los géneros de un año específico
 */
export async function analyzeGenresByYear(
  year: number,
  trackLimit: number = 50
): Promise<YearGenreData> {
  console.log(`\n📊 Analizando géneros del año ${year}...`);

  // Paso 1: Buscar tracks del año
  const tracks = await searchTracksByYear(year, trackLimit);
  console.log(`✅ Encontrados ${tracks.length} tracks`);

  if (tracks.length === 0) {
    return {
      year,
      totalTracks: 0,
      genres: [],
      topGenres: [],
    };
  }

  // Paso 2: Extraer IDs únicos de artistas
  const artistIds = new Set<string>();
  tracks.forEach((track) => {
    track.artists.forEach((artist) => {
      artistIds.add(artist.id);
    });
  });

  console.log(`🎤 Obteniendo info de ${artistIds.size} artistas...`);

  // Paso 3: Obtener información de artistas
  const artists = await getArtistsBatch(Array.from(artistIds));
  console.log(`✅ Información obtenida de ${artists.length} artistas`);

  // Crear un mapa de artista ID -> géneros
  const artistGenresMap = new Map<string, string[]>();
  artists.forEach((artist) => {
    artistGenresMap.set(artist.id, artist.genres);
  });

  // Paso 4: Contar géneros (cada track cuenta una vez por cada género de sus artistas)
  const genreCounts = new Map<string, number>();

  tracks.forEach((track) => {
    const trackGenres = new Set<string>();

    // Recopilar todos los géneros de los artistas del track
    track.artists.forEach((artist) => {
      const genres = artistGenresMap.get(artist.id) || [];
      genres.forEach((genre) => trackGenres.add(genre));
    });

    // Contar cada género único del track
    trackGenres.forEach((genre) => {
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
    });
  });

  // Paso 5: Calcular porcentajes
  const genres = calculateGenrePercentages(genreCounts, tracks.length);
  const topGenres = genres.slice(0, 10); // Top 10 géneros

  console.log(`🎵 Total de géneros únicos: ${genres.length}`);
  console.log(`🏆 Top 3 géneros:`);
  topGenres.slice(0, 3).forEach((g, i) => {
    console.log(`   ${i + 1}. ${g.genre}: ${g.percentage.toFixed(1)}%`);
  });

  return {
    year,
    totalTracks: tracks.length,
    genres,
    topGenres,
  };
}

/**
 * Analiza múltiples años
 */
export async function analyzeGenresByYears(
  years: number[],
  trackLimit: number = 50
): Promise<YearGenreData[]> {
  const results: YearGenreData[] = [];

  for (const year of years) {
    const data = await analyzeGenresByYear(year, trackLimit);
    results.push(data);

    // Pausa entre años para no saturar la API
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return results;
}

/**
 * Formatea los resultados para mostrar
 */
export function formatGenreAnalysis(data: YearGenreData): string {
  let output = `\n═══════════════════════════════════════\n`;
  output += `📅 AÑO ${data.year}\n`;
  output += `═══════════════════════════════════════\n`;
  output += `Total de tracks analizados: ${data.totalTracks}\n`;
  output += `Géneros únicos encontrados: ${data.genres.length}\n\n`;
  output += `🏆 TOP 10 GÉNEROS:\n`;
  output += `───────────────────────────────────────\n`;

  data.topGenres.forEach((genre, index) => {
    const bar = "█".repeat(Math.round(genre.percentage / 2));
    output += `${(index + 1).toString().padStart(2)}. ${genre.genre.padEnd(30)} ${genre.percentage.toFixed(1)}% ${bar}\n`;
  });

  return output;
}

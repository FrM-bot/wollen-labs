export const Routes = {
  api: {
    token: `/api/token`,
    logout: `/api/auth/logout`,
    auth: {
      login: (returnTo?: string) => `/api/auth/login${returnTo ? `?returnTo=${returnTo}` : ''}`,
      callback: `/api/auth/callback`,
    },
    albums: {
      several: () => `/api/albums`,
      details: (id: string) => `/api/albums/${id}`,
    },
    artists: {
      topArtists: '/api/artists/top',
      details: (id: string) => `/api/artists/${id}`,
    },
    tracks: {
      topTracks: '/api/tracks/top',
      details: (id: string) => `/api/tracks/${id}`,
    },
    genres: {
      analyze: '/api/genres/analyze',
    },
    search: {
      artists: '/api/search/artists',
    },
  },
  client: {
    home: "/",
    albums: {
      details: (id: string) => `/albums/${id}`,
    },
    artists: {
      details: (id: string) => `/artists/${id}`,
    },
    tracks: {
      details: (id: string) => `/tracks/${id}`,
    },
  },
} as const

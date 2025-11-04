export const Endpoints = {
  spotify: {
    albums: {
      details: (id: string) => `/albums/${id}`,
      several: () => `/albums`,
    },
    artists: {
      details: (id: string) => `/artists/${id}`,
      several: () => `/artists`,
      topTracks: (id: string) => `/artists/${id}/top-tracks`,
    },
    tracks: {
      audioAnalysis: (id: string) => `/audio-analysis/${id}`,
      audioFeatures: (id: string) => `/audio-features/${id}`,
      details: (id: string) => `/tracks/${id}`,
    },
    search: '/search',
  },
  lastfm: {
    tracks: {
      topTracks: () => ``,
    },
    artists: {
      topArtists: () => ``,
    }
  }
} as const

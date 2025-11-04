export const enum CookieNames {
    accessToken = "access_token",
    userAccessToken = "user_access_token",
    refreshToken = "refresh_token"
}

export const SPOTIFY_SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read',
    'user-follow-read', // Read followed artists
].join(' ')
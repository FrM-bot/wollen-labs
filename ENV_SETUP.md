# Environment Variables Setup

Add these variables to your `.env.local` file:

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

# OAuth Redirect URI (must match Spotify Dashboard settings)
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback

# API URL
API_URL=https://api.spotify.com/v1
```

## Spotify Dashboard Setup

1. Go to https://developer.spotify.com/dashboard
2. Create or select your application
3. Add `http://localhost:3000/api/auth/callback` to **Redirect URIs**
4. Copy your Client ID and Client Secret to `.env.local`

## OAuth Scopes

The application requests these scopes:
- `user-read-private` - Read user profile data
- `user-read-email` - Read user email
- `user-top-read` - Read user's top artists and tracks
- `user-read-recently-played` - Read recently played tracks
- `user-library-read` - Read user's saved content

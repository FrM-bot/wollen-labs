import type { z } from 'zod'
import { object, string } from 'zod'

const EnvSchema = object({
  SPOTIFY_CLIENT_SECRET: string({
    message: 'SPOTIFY_CLIENT_SECRET must be a string',
  }).min(1, {
    message: 'SPOTIFY_CLIENT_SECRET is required',
  }),
  SPOTIFY_CLIENT_ID: string({
    message: 'SPOTIFY_CLIENT_ID must be a string',
  }).min(1, {
    message: 'SPOTIFY_CLIENT_ID is required',
  }),
  SPOTIFY_REDIRECT_URI: string({
    message: 'SPOTIFY_REDIRECT_URI must be a string',
  }).min(1, {
    message: 'SPOTIFY_REDIRECT_URI is required',
  }),
  API_URL: string({
    message: 'API_URL must be a string',
  }).min(1, {
    message: 'API_URL is required',
  }),
  LAST_FM_API_KEY: string({
    message: 'LAST_FM_API_KEY must be a string',
  }).min(1, {
    message: 'LAST_FM_API_KEY is required',
  }),
  LAST_FM_API_SECRET: string({
    message: 'LAST_FM_API_SECRET must be a string',
  }).min(1, {
    message: 'LAST_FM_API_SECRET is required',
  }),
})

type Env = z.infer<typeof EnvSchema>

let envResult: Env

try {
  envResult = EnvSchema.parse({
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    API_URL: process.env.API_URL,
    LAST_FM_API_KEY: process.env.LAST_FM_API_KEY,
    LAST_FM_API_SECRET: process.env.LAST_FM_API_SECRET,
  })
} catch (error) {
  console.error(error)
  throw new Error(`Error validating environment variables: ${error}`)
}

export const env = {
  SPOTIFY_CLIENT_SECRET: envResult.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_CLIENT_ID: envResult.SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI: envResult.SPOTIFY_REDIRECT_URI,
  API_URL: envResult.API_URL,
  LAST_FM_API_KEY: envResult.LAST_FM_API_KEY,
  LAST_FM_API_SECRET: envResult.LAST_FM_API_SECRET,
}

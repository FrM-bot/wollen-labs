import type { z } from 'zod'
import { object, string } from 'zod'

const EnvSchema = object({
  NEXT_PUBLIC_APP_DOMAIN: string({
    message: 'NEXT_PUBLIC_APP_DOMAIN must be a string',
  }).min(1, {
    message: 'NEXT_PUBLIC_APP_DOMAIN is required',
  })
})

type Env = z.infer<typeof EnvSchema>

let envResult: Env

try {
  envResult = EnvSchema.parse({
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  })
} catch (error) {
  console.error(error)
  throw new Error(`Error validating environment variables: ${error}`)
}

export const env = {
  NEXT_PUBLIC_APP_DOMAIN: envResult.NEXT_PUBLIC_APP_DOMAIN,
}

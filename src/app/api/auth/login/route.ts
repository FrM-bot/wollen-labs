import { env } from "@/config/env.server";
import { SPOTIFY_SCOPES } from "@/constants";
import { generateRandomString } from "@/lib/utils";
import { cookies } from "next/headers";
import { authQuery } from "@/lib/query-spotify";
import { AccessTokenDTOIn } from "@/types/in/access-token";
import { CookieNames } from "@/constants";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();
  const { data, status } = await authQuery<AccessTokenDTOIn>("/token");

  const state = generateRandomString(16);

  const params = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: env.SPOTIFY_REDIRECT_URI,
    scope: SPOTIFY_SCOPES,
    state, // Store return URL in state
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  if (data) {
    cookieStore.set(CookieNames.accessToken, data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.expires_in,
      path: "/",
    });

    return redirect(authUrl);
  }
  return new Response(
    JSON.stringify({ error: "Error getting access token", data: null, status }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

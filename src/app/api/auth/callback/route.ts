import { env } from "@/config/env.server";
import { CookieNames } from "@/constants";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { Routes } from "@/lib/routes";
import { redirect } from "next/navigation";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return redirect(`/?error=${error}`);
  }

  if (!code) {
    return redirect("/?error=no_code");
  }

  if (!state) {
    return redirect("/?error=state_mismatch");
  }

  try {
    const basicAuth = Buffer.from(
      `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");
    
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: env.SPOTIFY_REDIRECT_URI,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange failed:", errorData);
      return redirect("/?error=token_exchange_failed");
    }

    const tokenData: SpotifyTokenResponse = await tokenResponse.json();

    // Set cookies
    const cookieStore = await cookies();
    
    cookieStore.set(CookieNames.userAccessToken, tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in,
      path: "/",
    });

    cookieStore.set(CookieNames.refreshToken, tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return redirect("/?error=callback_failed");
  }

  // Redirect outside try-catch to avoid catching NEXT_REDIRECT error
  redirect(Routes.client.home);
}

import { env } from "@/config/env.server";
import { getAppToken, getUserToken } from "./auth";

const SPOTIFY_API_ENDPOINT = "https://api.spotify.com/v1";

type QueryOptions = {
  params?: Record<string, string>;
  headers?: Record<string, string>;
  useUserToken?: boolean; // Flag to use user OAuth token instead of app token
};

export const query = async <T>(path: string, options?: QueryOptions) => {
  const userToken = await getUserToken();
  const appToken = await getAppToken();
  const token = options?.useUserToken ? userToken : appToken;

  const url = new URL(`${SPOTIFY_API_ENDPOINT}${path}`);

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
  }

  const defaultFetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
      ...options?.headers,
    },
    credentials: "include",
  };

  return fetch(url, defaultFetchOptions)
    .then(async (res) => {
      const data = await res.json()
      return {
        status: res.status,
        error: null,
        data: data as T,
      };
    })
    .catch((err) => ({
      status: 500,
      error: err,
      data: null,
    }));
};

const SPOTIFY_ACCOUNT_API_ENDPOINT = "https://accounts.spotify.com/api";

export const authQuery = async <T>(path: string) => {
  const url = `${SPOTIFY_ACCOUNT_API_ENDPOINT}${path}`;
  return fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.SPOTIFY_CLIENT_ID,
      client_secret: env.SPOTIFY_CLIENT_SECRET,
    }),
  })
    .then(async (res) => ({
      status: res.status,
      error: null,
      data: (await res.json()) as T,
    }))
    .catch((err) => ({
      status: 500,
      error: err,
      data: null,
    }));
};

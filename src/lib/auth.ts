import { CookieNames } from "@/constants";
import { cookies } from "next/headers";

export async function getUserToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const userToken = cookieStore.get(CookieNames.userAccessToken);
  return userToken?.value || null;
}

export async function getAppToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const appToken = cookieStore.get(CookieNames.accessToken);
  return appToken?.value || null;
}

export async function isAuthenticated(): Promise<boolean> {
  const userToken = await getUserToken();
  return !!userToken;
}

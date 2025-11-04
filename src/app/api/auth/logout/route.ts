import { cookies } from "next/headers";
import { CookieNames } from "@/constants";
import { redirect } from "next/navigation";
import { Routes } from "@/lib/routes";

export async function GET() {
  const cookieStore = await cookies();

  // Eliminar todas las cookies de autenticación
  cookieStore.delete(CookieNames.accessToken);
  cookieStore.delete(CookieNames.userAccessToken);
  cookieStore.delete(CookieNames.refreshToken);

  // Redirigir a la página de inicio
  return redirect(Routes.client.home);
}

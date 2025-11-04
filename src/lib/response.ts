import { ResponseDTO } from "@/types/utils";
import { Error } from "@/types/utils";

export function createResponse<T>(
  data: T | null,
  error: Error | null = null,
  status: number
): Response {
  const body: ResponseDTO<T> = {
    data,
    error,
    status,
  };

  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
  });
}


import { analyzeGenresByYears } from "@/lib/genre-analysis";
import { createResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Obtener años del query string (ej: ?years=2000,2010,2020)
    const yearsParam = searchParams.get("years");
    const limitParam = searchParams.get("limit");

    // Valores por defecto
    const defaultYears = [2000, 2010, 2020, 2024];
    const defaultLimit = 50;

    // Parsear años
    const years = yearsParam
      ? yearsParam.split(",").map(Number).filter((y) => !isNaN(y) && y > 1900 && y <= new Date().getFullYear())
      : defaultYears;

    // Parsear limit
    const limit = limitParam
      ? Math.min(Math.max(parseInt(limitParam), 1), 50) // Entre 1 y 50
      : defaultLimit;

    if (years.length === 0) {
      return createResponse(
        null,
        { message: "No se proporcionaron años válidos", status: 400 },
        400
      );
    }

    // Realizar el análisis
    const results = await analyzeGenresByYears(years, limit);

    return createResponse(results, null, 200);
  } catch (error) {
    console.error("Error en análisis de géneros:", error);
    return createResponse(
      null,
      { message: "Error al analizar géneros", status: 500 },
      500
    );
  }
}

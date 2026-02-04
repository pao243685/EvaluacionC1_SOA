
"use server";

import { pool } from "../../../../lib/db";
import { Report1Schema } from "./schema";

export interface LibroPrestadoFrecuente {
   libro_id: number;
   libro_titulo: string;
   total_prestados: number;
   prestados_rank: number;
}

export async function getLibrosPrestadosFrecuentes(rawParams: unknown): Promise<{
  ok: boolean;
  data?: LibroPrestadoFrecuente[];
  error?: string;
}> {
  try {

    const { page, limit } = Report1Schema.parse(rawParams);

    const offset = (page - 1) * limit;

    const params: number[] = [limit, offset];

    const q = `
      SELECT *
      FROM vw_most_borrowed_books
      LIMIT $1 OFFSET $2;
    `;

    const result = await pool.query<LibroPrestadoFrecuente>(q, params);

    return { ok: true, data: result.rows };
    } catch (err) {
    console.error("Error cargando libros:", err);
    return { ok: false, error: "Error cargando libros frecuentes" };
  }
}

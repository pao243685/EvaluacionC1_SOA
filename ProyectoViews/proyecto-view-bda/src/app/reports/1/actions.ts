"use server";

import { pool } from "../../../../lib/db";
import { Report1Schema } from "./schema";

export interface LibroPrestadoFrecuente {
  libro_id: number;
  libro_autor: string;
  libro_titulo: string;
  total_prestados: number;
  prestados_rank: number;
}

export async function getLibrosPrestadosFrecuentes(rawParams: unknown) {
  try {
    const { page, limit, search } = Report1Schema.parse(rawParams);

    const offset = (page - 1) * limit;

    const params: (string | number)[] = [limit, offset];

    let q = `
      SELECT *
      FROM vw_most_borrowed_books
    `;

    if (search && search.trim() !== "") {
      q += `
        WHERE libro_titulo ILIKE $3
           OR libro_autor ILIKE $3
      `;
      params.push(`%${search}%`);
    }

    q += ` 
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query<LibroPrestadoFrecuente>(q, params);

    return { ok: true, data: result.rows };

  } catch (err) {
    console.error("Error cargando libros:", err);
    return { ok: false, error: "Error cargando libros frecuentes" };
  }
}

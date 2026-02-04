"use server";

import { pool } from "../../../../lib/db";
import { Report3Schema } from "./schema";

export interface ResumenMultas {
  usuario_id: number;
  mes: string;
  total_multas: number;
  pagadas: number;
  pendientes: number;
}

export async function getResumenMultas(rawParams: unknown) {
  try {
    const { page, limit } = Report3Schema.parse(rawParams);

    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const params: (string|number)[] = [];

    const whereSQL = whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

    params.push(limit);
    params.push(offset);

    const q = `
      SELECT *
      FROM vw_fines_summary
      LIMIT $${params.length - 1} OFFSET $${params.length};
    `;

    const result = await pool.query<ResumenMultas>(q, params);

    return { ok: true, data: result.rows };

  } catch (err) {
    console.error("Error al mostrar resumen de multas", err);
    return { ok: false, error: "Error en resumen de multas" };
  }
}

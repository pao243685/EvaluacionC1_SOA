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
    const { page, limit, fromDate, toDate } = Report3Schema.parse(rawParams);

    const offset = (page - 1) * limit;

    const params: (string | number)[] = [limit, offset];
    const whereClauses: string[] = [];

    if (fromDate) {
      params.push(fromDate);
      whereClauses.push(`mes >= $${params.length}`);
    }

    if (toDate) {
      params.push(toDate);
      whereClauses.push(`mes <= $${params.length}`);
    }

    const whereSQL =
      whereClauses.length > 0
        ? `WHERE ${whereClauses.join(" AND ")}`
        : "";

    const q = `
      SELECT *
      FROM vw_fines_summary
      ${whereSQL}
      ORDER BY mes
      LIMIT $1 OFFSET $2;
    `;

    const result = await pool.query<ResumenMultas>(q, params);

    const rows = result.rows.map((r) => ({
      ...r,
      mes: new Date(r.mes).toISOString().split("T")[0],
    }));

    return { ok: true, data: rows };

  } catch (err) {
    console.error("Error al mostrar resumen de multas", err);
    return { ok: false, error: "Error en resumen de multas" };
  }
}

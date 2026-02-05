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

export async function getResumenMultas(rawParams: unknown): Promise<{
  ok: boolean;
  data?: ResumenMultas[];
  error?: string;
}> {
  try {
    const { page, limit } = Report3Schema.parse(rawParams);

    const offset = (page - 1) * limit;

    const params: number[] = [limit, offset];


    const q = `
      SELECT *
      FROM vw_fines_summary
      LIMIT $1 OFFSET $2;
    `;

    const result = await pool.query<ResumenMultas>(q, params);

    const rows: ResumenMultas[] = result.rows.map((r: ResumenMultas) => ({
      ...r,
      mes: new Date(r.mes).toISOString().split('T')[0],
    }));

    return { ok: true, data: rows };

  } catch (err) {
    console.error("Error al mostrar resumen de multas", err);
    return { ok: false, error: "Error en resumen de multas" };
  }
}

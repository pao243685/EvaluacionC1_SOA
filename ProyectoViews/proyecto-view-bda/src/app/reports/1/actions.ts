
"use server";

import { pool } from "../../../../lib/db";

export interface UsuarioFrecuente {
  usuario_id: number;
  usuario_nombre: string;
  total_ordenes: number;
  total_gastado: number;
  promedio_por_orden: number;
  ranking_por_gasto: number;
}

export async function getUsuariosFrecuentes(): Promise<{
  ok: boolean;
  data?: UsuarioFrecuente[];
  error?: string;
}> {
  try {
    const q = `
      SELECT *
      FROM vw_ranking_usuarios_por_gasto
      ORDER BY total_gastado DESC
      LIMIT 20;
    `;

    const result = await pool.query<UsuarioFrecuente>(q);

    return { ok: true, data: result.rows };
    } catch (err) {
    console.error("Error fetching usuarios frecuentes:", err);
    return { ok: false, error: "Error fetching usuarios frecuentes" };
  }
}

"use server";

import { pool } from "../../../../lib/db";

export interface CategoriaVenta {
  nombre_categoria: string;
  total_ventas: number;
}

export async function getCategoriasConMasVentas(): Promise<{
  ok: boolean;
  data?: CategoriaVenta[];
    error?: string;
}> {
  try {
    const q = `
      SELECT *
      FROM vw_categorias_con_mas_ventas
      ORDER BY total_ventas DESC
      LIMIT 20;
    `;

    const result = await pool.query<CategoriaVenta>(q);

    return { ok: true, data: result.rows };
    } catch (err) {
    console.error("Error al mostrar categorias con mas ventas:", err);
    return { ok: false, error: "Error en categorias con mas ventas" };
  }
}
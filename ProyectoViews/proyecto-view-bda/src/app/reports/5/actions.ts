"use server";

import { pool } from "../../../../lib/db";
import { Report5Schema } from "./schema";

export interface InventarioPorCategoria {
  categoria: string;
  total_libros: number;
  total_copias: number;
  copias_disponibles: number;
  copias_prestadas: number;
  copias_perdidas: number;
}

export async function getInventarioPorCategoria(rawParams: unknown): Promise<{
    ok: boolean;
    data?:InventarioPorCategoria[];
    error?:string;
}>{
  try{
     const { nivelVentas } = Report5Schema.parse(rawParams);

    let whereSQL = "";
    const params: string[] = [];

    if (nivelVentas) {
      params.push(nivelVentas);
      whereSQL = "WHERE nivel_ventas = $1";
    }
    const q = `SELECT * FROM
    vw_inventory_health
    ${whereSQL};`;

    const result = await pool.query<InventarioPorCategoria>(q, params);

    return {ok: true, data: result.rows};
  } catch (err) {
    console.error("Error al mostrar inventario por categoria", err);
    return { ok: false, error: "Error en inventario por categoria"};
  }
}
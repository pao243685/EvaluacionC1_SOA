"use server";

import { pool } from "../../../../lib/db";

export interface ProductoMasVendido {
  categoria: string;
  producto: string;
  total_unidades: number;
  total_ventas: number;
}

export async function getProductosMasVendidos(): Promise<{
    ok: boolean;
    data?:ProductoMasVendido[];
    error?:string;
}>{
  try{
    const q = `SELECT * FROM
    vw_productos_mas_vendidos_por_categoria
    ORDER BY total_unidades DESC
    LIMIT 10;`;
    
    const result = await pool.query<ProductoMasVendido>(q);

    return {ok: true, data: result.rows};
  } catch (err) {
    console.error("Error al mostrar productos mas vendidos", err);
    return { ok: false, error: "Error en productos mas vendidos"};
  }
}
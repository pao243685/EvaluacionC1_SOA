"use server";

import { pool } from "../../../../lib/db";

export interface MiembroActivo {
  id_miembro: number;
  nombre_miembro: string;
  total_prestamos: number;
  total_multas: number;
  prestamos_atrasados: number;
  tasa_atraso: number;
}


export async function getMiembrosActivos(): Promise<{
    ok: boolean;
    data?:MiembroActivo[];
    error?:string;
}>{
  try{
    const q = `SELECT * FROM
    vw_member_activity;`;

    const result = await pool.query<MiembroActivo>(q);
    return {ok: true, data: result.rows};
  } catch (err) {
    console.error("Error al mostrar miembros activos", err);
    return { ok: false, error: "Error en miembros activos"};
  }
}
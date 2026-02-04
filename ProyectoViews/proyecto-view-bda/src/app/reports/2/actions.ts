"use server";

import { pool } from "../../../../lib/db";
import { Report2Schema } from "./schema";

export interface PrestamoVencido {
  loan_id: number;
  member_id: number;
  member_name: string;
  copy_barcode: string;
  book_titulo: string;
  loaned_at: string;
  due_at: string;
  dias_retraso: number;
  monto_sugerido: number;
}

export async function getPrestamosVencidos(rawParams: unknown): Promise<{
  ok: boolean;
  data?: PrestamoVencido[];
  error?: string;
}> {
  try {
    const { page, limit } = Report2Schema.parse(rawParams);

    const offset = (page - 1) * limit;

    const params: number[] = [limit, offset];

    const q = `
      SELECT *
      FROM vw_overdue_loans
      LIMIT $1 OFFSET $2;
    `;

    const result = await pool.query<PrestamoVencido>(q, params);

    return { ok: true, data: result.rows };
  } catch (err) {
    console.error("Error al mostrar prestamos vencidos:", err);
    return { ok: false, error: "Error al mostrar prestamos vencidos" };
  }
}
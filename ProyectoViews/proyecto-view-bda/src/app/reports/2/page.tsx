import { getPrestamosVencidos } from "./actions";
import { Report2Schema } from "./schema";

interface Reporte2PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Reporte2Page({ searchParams }: Reporte2PageProps) {
  const params = Report2Schema.parse(await searchParams);

  const { ok, data, error } = await getPrestamosVencidos(params);
  if (!ok || !data) return <div>Error: {error}</div>;

  const totalPrestamosVencidos = data.length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Reporte 2 - Prestamos vencidos con dias de retraso y monto sugerido
      </h1>
      <p className="text-gray-600">
        Prestamos vencidos con dias de retraso y monto sugerido
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className=" p-4 rounded">
          <h3 className="text-lg font-semibold">
            KPI: Total Prestamos Vencidos {totalPrestamosVencidos}
          </h3>
          
        </div>
      </div>

      <form method="get" className="mt-6 p-4 border rounded bg-gray-50">
        <p className="font-semibold mb-3">Paginación:</p>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex flex-col">
            <label htmlFor="page" className="text-sm mb-1">
              Página:
            </label>
            <input
              id="page"
              name="page"
              type="number"
              min="1"
              defaultValue={params.page}
              placeholder="Página"
              className="px-3 py-2 border rounded w-24"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="limit" className="text-sm mb-1">
              Límite:
            </label>
            <input
              id="limit"
              name="limit"
              type="number"
              min="5"
              max="50"
              defaultValue={params.limit}
              placeholder="Límite"
              className="px-3 py-2 border rounded w-24"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="minDays" className="text-sm mb-1">Minimo de dias de retraso:</label>
            <input
              id="minDays"
              name="minDays"
              type="number"
              min="1"
              defaultValue={params.minDays}
              placeholder="Días mínimos de retraso"
              className="px-3 py-2 border rounded w-24"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-auto"
          >
            Aplicar
          </button>
        </div>
      </form>

      <table className="mt-6 border-collapse border w-full">
        <thead>
          <tr className="bg-green-200">
            <th className="border px-4 py-2">Prestamo ID</th>
            <th className="border px-4 py-2">Miembro ID</th>
            <th className="border px-4 py-2">Miembro Nombre</th>
            <th className="border px-4 py-2">Copia Codigo de Barras</th>
            <th className="border px-4 py-2">Titulo del Libro</th>
            <th className="border px-4 py-2">Fecha de Prestamo</th>
            <th className="border px-4 py-2">Fecha de Vencimiento</th>
            <th className="border px-4 py-2">Dias de Retraso</th>
            <th className="border px-4 py-2">Monto Sugerido</th>
          </tr>
        </thead>

        <tbody>
          {data!.map((c) => (
            <tr key={c.loan_id}>
              <td className="border px-4 py-2">{c.loan_id}</td>
              <td className="border px-4 py-2">{c.member_id}</td>
              <td className="border px-4 py-2">{c.member_name}</td>
              <td className="border px-4 py-2">{c.copy_barcode}</td>
              <td className="border px-4 py-2">{c.book_titulo}</td>
              <td className="border px-4 py-2">{ c.loaned_at}</td>
              <td className="border px-4 py-2">{c.due_at}</td>
              <td className="border px-4 py-2">{c.dias_retraso}</td>
              <td className="border px-4 py-2">${c.monto_sugerido.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { getLibrosPrestadosFrecuentes } from "./actions";
import { Report1Schema } from "./schema";

interface Reporte1PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Reporte1Page({ searchParams }: Reporte1PageProps) {
  const rawParams = await searchParams;

  const parsed = Report1Schema.safeParse(rawParams);

  if (!parsed.success) {
    return <div>Error en parámetros</div>;
  }

  const { ok, data, error } = await getLibrosPrestadosFrecuentes(parsed.data);

  if (!ok || !data) return <div>Error: {error}</div>;

  const totalLibros = data.length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Reporte 1 - Libros más prestados</h1>
      <p className="text-gray-600">Ranking de Libros más prestados</p>

      <h3 className="text-xl font-semibold mt-4">
        KPI: Total libros prestados: {totalLibros}
      </h3>

      <form method="get" className="mt-6 p-4 border rounded bg-gray-50">
        <p className="font-semibold mb-3">Filtros:</p>

        <div className="flex gap-6 flex-wrap items-end">

          <div className="flex flex-col">
            <label htmlFor="page" className="text-sm mb-1">Página:</label>
            <input
              id="page"
              name="page"
              type="number"
              min="1"
              defaultValue={parsed.data.page}
              className="px-3 py-2 border rounded w-24"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="limit" className="text-sm mb-1">Límite:</label>
            <input
              id="limit"
              name="limit"
              type="number"
              min="5"
              max="50"
              defaultValue={parsed.data.limit}
              className="px-3 py-2 border rounded w-24"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="search" className="text-sm mb-1">Buscar:</label>
            <input
              id="search"
              name="search"
              type="text"
              defaultValue={parsed.data.search ?? ""}
              placeholder="Título o autor"
              className="px-3 py-2 border rounded w-48"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Aplicar
          </button>
        </div>
      </form>

      <table className="mt-6 border-collapse border w-full">
        <thead>
          <tr className="bg-green-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Título</th>
            <th className="border px-4 py-2">Autor</th>
            <th className="border px-4 py-2">Total Prestados</th>
            <th className="border px-4 py-2">Ranking</th>
          </tr>
        </thead>

        <tbody>
          {data.map((u) => (
            <tr key={u.libro_id} className="hover:bg-green-100">
              <td className="border px-4 py-2">{u.libro_id}</td>
              <td className="border px-4 py-2">{u.libro_titulo}</td>
              <td className="border px-4 py-2">{u.libro_autor}</td>
              <td className="border px-4 py-2">{u.total_prestados}</td>
              <td className="border px-4 py-2">{u.prestados_rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

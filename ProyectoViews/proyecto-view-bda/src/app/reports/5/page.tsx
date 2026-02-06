
import { getInventarioPorCategoria } from "./actions";
import { Report5Schema } from "./schema";

interface Reporte5PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Reporte5Page({ searchParams }: Reporte5PageProps) {
  const params = Report5Schema.parse(await searchParams);

  const { ok, data, error } = await getInventarioPorCategoria(params);
  if (!ok || !data) return <div>Error: {error}</div>;

  const totalCopias = data.reduce((acc, row) => acc + Number(row.total_copias), 0);
  const totalLibros = data.reduce((acc, row) => acc + Number(row.total_libros), 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Reporte 5 - Inventario por categoría
      </h1>
      <p className="text-gray-600">
        Lista de categorías con su inventario total, copias disponibles, prestadas y perdidas.
      </p>

      <h3 className="text-xl font-semibold mt-4">
        KPI: Total Libros: {totalLibros}  |  Total Copias: {totalCopias} 
      </h3>

      <table className="mt-6 border-collapse border w-full">
        <thead>
          <tr className="bg-green-200">
            <th className="border px-4 py-2">Categoría</th>
            <th className="border px-4 py-2">Total Libros</th>
            <th className="border px-4 py-2">Total Copias</th>
            <th className="border px-4 py-2">Copias Disponibles</th>
            <th className="border px-4 py-2">Copias Prestadas</th>
            <th className="border px-4 py-2">Copias Perdidas</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={3} className="border px-4 py-2 text-center text-gray-500">
                No se encontraron categorías con el nivel seleccionado
              </td>
            </tr>
          ) : (
            data.map((p) => (
              <tr key={p.categoria}>
                <td className="border px-4 py-2">{p.categoria}</td>
                <td className="border px-4 py-2">{p.total_libros}</td>
                <td className="border px-4 py-2">{p.total_copias}</td>
                <td className="border px-4 py-2">{p.copias_disponibles}</td>
                <td className="border px-4 py-2">{p.copias_prestadas}</td>
                <td className="border px-4 py-2">{p.copias_perdidas}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
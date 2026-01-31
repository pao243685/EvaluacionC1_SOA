import {getCategoriasConMasVentas} from './actions';

export default async function Reporte2Page() {
  const { ok, data, error } = await getCategoriasConMasVentas();
    if (!ok) return <div>Error: {error}</div>;

    const totalVentas = data!.reduce(
      (acc, row) => acc + Number(row.total_ventas),
      0
    );

    return (
        <div className="p-8">
        <h1 className="text-2xl font-bold">Categorías con más ventas</h1>
        <p className="text-gray-600">Ranking de categorías con mayores ventas.</p>
        <h3 className="text-xl font-semibold mt-4">
          KPI: Total de ventas acumuladas: ${totalVentas}
        </h3> 

        <table className="mt-6 border-collapse border w-full">
          <thead>
            <tr className="bg-gray-200">
                <th className="border px-4 py-2">Categoría</th> 
                <th className="border px-4 py-2">Total Ventas</th>
            </tr>
          </thead>

            <tbody>
                {data!.map((c) => (
                    <tr key={c.nombre_categoria}>
                        <td className="border px-4 py-2">{c.nombre_categoria}</td>
                        <td className="border px-4 py-2">{c.total_ventas}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
}
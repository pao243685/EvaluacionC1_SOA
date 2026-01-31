import { getProductosMasVendidos } from "./actions";

export default async function Reporte3Page(){
    const { ok, data, error } = await getProductosMasVendidos();
    if (!ok) return <div>Error: {error}</div>;

    const totalProductos = data!.reduce(
        (acc,row) => acc + Number(row.total_unidades),
        0
    );

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold"> Productos  mas vendidos por categoria</h1>
            <p className="text-gray-600"> Productos mas vendidos </p>
            <h3 className="text-xl font-semibold mt-4">
                KPI: Total de productos vendidos: {totalProductos}
            </h3>

            <table className="mt-6 border-collapse border w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Producto</th>
                        <th className="border px-4 py-2">Categoría</th>
                        <th className="border px-4 py-2">Unidades Vendidas</th>
                        <th className="border px-4 py-2">Ventas Totales</th>
                    </tr>
                </thead>

                <tbody>
                    {data!.map((p) => (
                        <tr key={p.categoria + p.producto}>
                            <td className="border px-4 py-2">{p.producto}</td>
                            <td className="border px-4 py-2">{p.categoria}</td>
                            <td className="border px-4 py-2">{p.total_unidades}</td>
                            <td className="border px-4 py-2">{p.total_ventas}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
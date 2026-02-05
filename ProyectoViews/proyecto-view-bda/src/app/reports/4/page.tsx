import { getMiembrosActivos } from "./actions";

export default async function Reporte4Page(){
    const { ok, data, error } = await getMiembrosActivos();
    if (!ok) return <div>Error: {error}</div>;

    const totalMiembrosActivos = data!.length;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold"> Reporte 4 - Miembros activos</h1>
            <p className="text-gray-600"> Lista de miembros activos con sus estadísticas </p>
            <div className="mt-4 p-4 rounded w-max">
                <h3 className="text-lg font-semibold"> KPI: Total Miembros Activos:  {totalMiembrosActivos}</h3>
                
            </div>
            <table className="mt-6 border-collapse border w-full">
                <thead>
                    <tr className="bg-green-200">
                        <th className="border px-4 py-2">miembro_id</th>
                        <th className="border px-4 py-2">Nombre Miembro</th>
                        <th className="border px-4 py-2">Total Prestamos</th>
                        <th className="border px-4 py-2">Total Multas</th>
                        <th className="border px-4 py-2">Prestamos Atrasados</th>
                        <th className="border px-4 py-2">Tasa de Atraso</th>
                    </tr>
                </thead>
                <tbody>
                    {data!.map((p) => (
                        <tr key={p.id_miembro}>
                            <td className="border px-4 py-2">{p.id_miembro}</td>
                            <td className="border px-4 py-2">{p.nombre_miembro}</td>
                            <td className="border px-4 py-2">{p.total_prestamos}</td>
                            <td className="border px-4 py-2">{p.total_multas}</td>
                            <td className="border px-4 py-2">{p.prestamos_atrasados}</td>
                            <td className="border px-4 py-2">{p.tasa_atraso}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
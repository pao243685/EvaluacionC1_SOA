export default function Home() {
  const reports = [
    { id: 1, name: "Libros mas prestados" },
    { id: 2, name: "Prestamos vencidos con dias de retraso y monto sugerido" },
    { id: 3, name: "Resumen mensual de multas pagadas y pendientes" },
    { id: 4, name: "Socios activos y tasa de atraso" },
    { id: 5, name: "Salud de inventario por categoria de libro" },
  ];

  return (
    <main className="p-4 bg-green-50 min-h-screen">
      <nav className="text-xl text-white font-semibold bg-green-700 filter saturate-30 p-4 text-center">Dashboard</nav>
      <p className="text-gray-700 mb-6 p-4">Selecciona un reporte para visualizar datos.</p>

      <ul className="space-y-3 p-4">
        <li className=" text-xl font-semibold text-center w-200 p-2 ml-70">Reportes</li>
        {reports.map((r) => (
          <li key={r.id}>
            <a className="text-white text-center mb-10 bg-green-600 filter saturate-30 p-2 block w-200 ml-80" href={`/reports/${r.id}`}>
              {r.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

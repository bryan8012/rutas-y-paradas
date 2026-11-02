"use client";

export default function AsignacionPage() {
  return (
    <main className="min-h-screen bg-[#071016] text-slate-100 p-8">
      <h1 className="text-3xl font-black mb-1">Asignación Operativa</h1>
      <p className="text-slate-400 text-sm mb-8">Configuración de rutas, vehículos y conductores para el servicio nocturno.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Izquierda: Formulario */}
        <section className="border border-slate-700 p-6 rounded-xl bg-[#101b24]">
          <h2 className="font-bold mb-6">Configurar Nueva Asignación</h2>
          <div className="space-y-4">
            <select className="w-full bg-slate-950 p-3 rounded border border-slate-700">
              <option>Seleccione Ruta</option>
            </select>
            <select className="w-full bg-slate-950 p-3 rounded border border-slate-700">
              <option>Seleccione Vehículo</option>
            </select>
            <select className="w-full bg-slate-950 p-3 rounded border border-slate-700">
              <option>Seleccione Conductor</option>
            </select>
            <button className="w-full bg-emerald-500 text-slate-950 py-3 rounded font-bold hover:bg-emerald-400">
              Configurar Asignación
            </button>
          </div>
        </section>

        {/* Columna Derecha: Reglas */}
        <aside className="border border-slate-700 p-6 rounded-xl bg-[#101b24]">
          <h3 className="font-bold mb-4">Reglas de Asignación</h3>
          <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
            <li>La unidad debe estar disponible.</li>
            <li>El conductor debe tener licencia vigente.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
export default function CheckInPage() {
  return (
    <main className="min-h-screen bg-[#0b1120] text-white p-4 sm:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Cabecera */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Registro de Check-in</h1>
          <p className="text-slate-400 mt-2">Gestiona el ingreso y registro de pasajeros en tiempo real.</p>
        </div>

        {/* Formulario Estilizado */}
        <div className="rounded-xl border border-slate-700 bg-[#111827] p-6 sm:p-8 shadow-xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">ID de Pasajero / Rut</label>
                <input 
                  type="text" 
                  placeholder="Ej: 12345678-9" 
                  className="w-full bg-[#0b1120] border border-slate-700 p-3 rounded-lg text-white focus:border-[#0e7490] focus:ring-1 focus:ring-[#0e7490] outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Ruta Asignada</label>
                <select className="w-full bg-[#0b1120] border border-slate-700 p-3 rounded-lg text-white focus:border-[#0e7490] focus:ring-1 focus:ring-[#0e7490] outline-none transition">
                  <option>Seleccione ruta...</option>
                  <option>Ruta Nocturna A</option>
                  <option>Ruta Diurna B</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#0e7490] hover:bg-[#155e75] text-white font-bold py-3 rounded-lg transition-all shadow-lg mt-2"
            >
              Confirmar Registro
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useActionState } from "react";
import { crearAsignacion } from "./actions";

export default function AsignacionForm({ rutas, vehiculos, usuarios }: any) {
  const [state, action] = useActionState(crearAsignacion, null);

  return (
    <form action={action} className="space-y-5">
      {state?.error && <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-lg text-sm">{state.error}</div>}
      {state?.success && <div className="bg-green-900/30 border border-green-700 text-green-200 p-3 rounded-lg text-sm">Asignación creada con éxito.</div>}

      <select name="rutaId" className="w-full bg-[#0B1120] border border-gray-700 p-3 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition" required>
        <option value="">Seleccione Ruta</option>
        {rutas?.map((r: any) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
      </select>

      <select name="vehiculoId" className="w-full bg-[#0B1120] border border-gray-700 p-3 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition" required>
        <option value="">Seleccione Vehículo</option>
        {vehiculos?.map((v: any) => <option key={v.id} value={v.id}>{v.placa}</option>)}
      </select>

      <select name="conductorId" className="w-full bg-[#0B1120] border border-gray-700 p-3 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition" required>
        <option value="">Seleccione Conductor</option>
        {usuarios?.map((u: any) => <option key={u.id} value={u.id}>{u.nombre}</option>)}
      </select>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all">
        Confirmar Asignación
      </button>
    </form>
  );
}
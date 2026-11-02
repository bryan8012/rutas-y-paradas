"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegistroUsuarioPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CONDUCTOR");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    setError("");

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo registrar el usuario.");
        return;
      }

      setMensaje("¡Usuario registrado con éxito!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Error de red al intentar registrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#071016] flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-[#0a161d] p-8 rounded-[30px] border border-slate-800 shadow-2xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 font-black text-[#071016] text-sm transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
          >
            ← Regresar al Dashboard
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
            🔄
          </div>
          <h1 className="text-xl font-black text-white">Registro de usuario</h1>
          <p className="text-slate-400 text-xs mt-1">Crea credenciales y asigna un rol operativo en SmartRoute.</p>
        </div>

        {mensaje && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs text-center font-medium">
            {mensaje}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs text-center font-medium">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Nombre Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full bg-[#071016] border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Correo institucional</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joaquinzelayab@hotmail.com"
              className="w-full bg-[#071016] border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#071016] border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Rol en el Sistema</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#071016] border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="CONDUCTOR">Conductor</option>
              <option value="COORDINADOR">Coordinador</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-400/20 mt-2"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta →"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            ¿Ya tienes acceso?{" "}
            <Link href="/login" className="text-emerald-400 font-bold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
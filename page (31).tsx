"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ APUNTANDO A LA NUEVA RUTA LIMPIA SIN CONFLICTOS
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo iniciar sesión.");
        return;
      }

      // Redirigir al dashboard principal tras iniciar sesión exitosamente
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Error de red al intentar iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#071016] flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-[#0a161d] p-8 rounded-[30px] border border-slate-800 shadow-2xl">
        <div className="mb-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 font-black text-[#071016] text-sm transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
          >
            ← Ir a Registro
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
            🔐
          </div>
          <h1 className="text-xl font-black text-white">Iniciar Sesión</h1>
          <p className="text-slate-400 text-xs mt-1">Accede a tu cuenta en SmartRoute.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs text-center font-medium">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Correo institucional</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-400/20 mt-2"
          >
            {loading ? "Iniciando sesión..." : "Ingresar →"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-emerald-400 font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
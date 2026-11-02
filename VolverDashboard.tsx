import Link from "next/link";

export default function VolverDashboard() {
  return (
    <div className="mb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-[#00ff88] rounded-xl hover:bg-[#00e67a] transition-all shadow-lg shadow-emerald-500/10"
      >
        {/* Icono de flecha hacia atrás */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-4 h-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Regresar al Dashboard
      </Link>
    </div>
  );
}
import { useState } from 'react';
import { User, Mail, Lock, Briefcase } from 'lucide-react';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0B1212] p-4">
      <div className="w-full max-w-sm p-8 bg-[#121A1A] border border-[#1E2929] rounded-3xl shadow-2xl">
        {/* Logo y Encabezado */}
        <div className="text-center mb-8">
          <div className="text-[#00F5D4] text-4xl mb-2 flex justify-center">🚌</div>
          <h2 className="text-white text-xl font-bold">TransExpress</h2>
          <p className="text-[#00F5D4] text-xs font-bold tracking-[0.2em]">SMARTROUTE</p>
        </div>

        {/* Formulario */}
        <form className="space-y-4">
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input type="text" className="w-full bg-[#0B1212] border border-[#1E2929] rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-[#00F5D4] outline-none" placeholder="Ej. Juan Pérez" />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Correo Institucional</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input type="email" className="w-full bg-[#0B1212] border border-[#1E2929] rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-[#00F5D4] outline-none" placeholder="empleado@trans-express.com" />
            </div>
          </div>

          {/* ID Empleado */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">ID de Empleado</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-gray-500" size={18} />
              <input type="text" className="w-full bg-[#0B1212] border border-[#1E2929] rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-[#00F5D4] outline-none" placeholder="Ej. 849201" />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input type="password" className="w-full bg-[#0B1212] border border-[#1E2929] rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-[#00F5D4] outline-none" placeholder="••••••••" />
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input type="password" className="w-full bg-[#0B1212] border border-[#1E2929] rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-[#00F5D4] outline-none" placeholder="Confirmar Contraseña" />
            </div>
          </div>

          {/* Checkbox Términos */}
          <div className="flex items-center gap-2">
            <input type="checkbox" className="accent-[#00F5D4]" />
            <span className="text-xs text-gray-400">Acepto los Términos y Condiciones</span>
          </div>

          <button className="w-full bg-[#00F5D4] text-[#0B1212] font-bold py-3 rounded-xl mt-2 hover:opacity-90 transition-opacity">
            Registrarse →
          </button>
        </form>
      </div>
    </div>
  );
}
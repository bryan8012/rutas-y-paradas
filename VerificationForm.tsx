import { useState } from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function VerificationForm() {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0B1212] p-4">
      <div className="w-full max-w-sm p-8 bg-[#121A1A] border border-[#1E2929] rounded-3xl shadow-2xl text-center">
        {/* Icono de Seguridad */}
        <div className="text-[#00F5D4] text-5xl mb-4 flex justify-center">
          <ShieldCheck size={48} />
        </div>
        
        <h2 className="text-white text-xl font-bold mb-2">Verificación de Seguridad</h2>
        <p className="text-gray-400 text-xs mb-6 px-4">
          Hemos enviado un código de 6 dígitos a su correo institucional<br />
          <span className="text-white font-semibold">empleado@trans-express.com</span>
        </p>

        {/* Inputs del Código */}
        <div className="flex justify-center gap-2 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-10 h-12 bg-[#0B1212] border border-[#1E2929] rounded-lg text-center text-white text-xl focus:border-[#00F5D4] outline-none"
            />
          ))}
        </div>

        {/* Botón Verificar */}
        <button className="w-full bg-[#00F5D4] text-[#0B1212] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity mb-4">
          Verificar
        </button>

        {/* Reenviar y Volver */}
        <p className="text-xs text-gray-400 mb-6">
          ¿No recibiste el código? <button className="text-[#00F5D4] font-bold">Reenviar</button>
        </p>

        <button className="flex items-center justify-center gap-2 text-gray-500 text-sm hover:text-white mx-auto">
          <ArrowLeft size={16} /> Volver al inicio de sesión
        </button>

        <div className="mt-8 text-[10px] text-gray-700">
          TRANSEXPRESS SMARTROUTE
        </div>
      </div>
    </div>
  );
}
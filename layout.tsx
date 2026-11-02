import type { Metadata } from "next";
import "./globals.css";

import Providers from "./providers";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "TransExpress SmartRoute",
  description: "Sistema de gestión operativa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          {/* Botón global de tema */}
          <div className="fixed top-4 right-4 z-[9999]">
            <ThemeToggle />
          </div>

          {children}
        </Providers>
      </body>
    </html>
  );
}
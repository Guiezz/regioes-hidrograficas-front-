import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/main-layout";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plano de Recursos Hídricos",
  description: "Dashboard de Gestão de Recursos Hídricos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

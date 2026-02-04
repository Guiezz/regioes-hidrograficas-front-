"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  TableProperties,
  BarChart3,
  Droplets,
  Workflow,
  Building2,
  Activity,
  Waves,
  Scale,
  ClipboardList,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Identificação",
    icon: FileText,
    href: "/identificacao",
    color: "text-violet-500",
  },
  {
    label: "Metodologia",
    icon: Workflow,
    href: "/metodologia",
    color: "text-emerald-500",
  },
  {
    label: "Infraestrutura Hídrica",
    icon: Building2,
    href: "/infraestrutura",
    color: "text-amber-600",
  },
  {
    label: "Demanda Hídrica",
    icon: Activity,
    href: "/demandas",
    color: "text-rose-600",
  },
  {
    label: "Oferta Hídrica",
    icon: Waves,
    href: "/oferta",
    color: "text-cyan-600",
  },
  {
    label: "Balanço Hídrico",
    icon: Scale,
    href: "/balanco",
    color: "text-blue-700",
  },
  {
    label: "Matriz de Ação",
    icon: TableProperties,
    href: "/matriz",
    color: "text-pink-700",
  },
  {
    label: "Planos de Ação",
    icon: ClipboardList,
    href: "/planos",
    color: "text-emerald-600",
  },
  {
    label: "Monitoramento", // Adicionei a rota de monitoramento aqui se já existir no menu
    icon: Activity, // Ou outro ícone como Target
    href: "/monitoramento",
    color: "text-green-500",
  },
  {
    label: "Indicadores", // Mudou de Dashboard
    icon: LayoutDashboard, // Pode manter ou usar PieChart/BarChart3
    href: "/indicadores", // Apontando para a nova página
    color: "text-violet-500", // Combinando com a cor da página nova
  },
  {
    label: "Prognóstico",
    icon: BarChart3,
    href: "/prognostico",
    color: "text-orange-700",
  },
];

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  isMobile?: boolean;
}

export function Sidebar({
  className,
  collapsed = false,
  isMobile = false,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white transition-all duration-300",
        className,
      )}
    >
      <div className="px-3 py-2 flex-1">
        {/* LOGO */}
        <Link
          href="/"
          className={cn(
            "flex items-center mb-14 transition-all",
            collapsed && !isMobile ? "justify-center pl-0" : "pl-3",
          )}
          title="Sistema de Informações de Gestão de Recursos Hídricos" // Nome completo ao passar o mouse
        >
          <div className="relative h-8 w-8">
            <Droplets className="h-8 w-8 text-blue-400" />
          </div>
          {/* Esconde o texto se estiver colapsado (e não for mobile) */}
          {(!collapsed || isMobile) && (
            <div className="flex flex-col ml-4 transition-opacity duration-300">
              <h1 className="text-2xl font-bold whitespace-nowrap leading-none">
                SIG<span className="text-blue-400">RH</span>
              </h1>
              <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-medium mt-1">
                Sistema de Informações de Gestão das Regiões Hidrográficas
              </span>
            </div>
          )}
        </Link>

        {/* MENU */}
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400",
                collapsed && !isMobile ? "justify-center" : "justify-start",
              )}
              title={collapsed ? route.label : undefined}
            >
              <div className="flex items-center">
                <route.icon
                  className={cn(
                    "h-5 w-5",
                    route.color,
                    !collapsed || isMobile ? "mr-3" : "mr-0",
                  )}
                />
                {(!collapsed || isMobile) && (
                  <span className="truncate">{route.label}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER DA SIDEBAR */}
      {(!collapsed || isMobile) && (
        <div className="px-3 py-2">
          <div className="bg-slate-800 rounded-lg p-3 text-xs text-zinc-400 text-center whitespace-nowrap overflow-hidden text-ellipsis">
            Versão 1.0.0
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  Droplets,
  LayoutDashboard,
  FileText,
  Workflow,
  Activity,
  Scale,
  ClipboardList,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* SEÇÃO HERO - O QUE É O SISTEMA */}
      <section className="relative py-20 lg:py-32 px-6 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge
              variant="outline"
              className="px-4 py-1.5 border-blue-200 text-blue-700 bg-blue-50 animate-fade-in"
            >
              Plataforma Oficial de Gestão Hídrica
            </Badge>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl">
              Gestão Inteligente de{" "}
              <span className="text-blue-600">Recursos Hídricos</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
              O <strong>SIGRH</strong> é o Sistema de Informações de Gestão das
              Regiões Hidrográficas, projetado para centralizar o monitoramento,
              planejamento estratégico e a tomada de decisão sustentável sobre o
              uso da água.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 text-lg rounded-full shadow-lg shadow-blue-200"
              >
                <Link href="/indicadores" className="flex items-center gap-2">
                  Acessar Indicadores <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 h-14 text-lg rounded-full border-slate-200"
              >
                <Link href="/metodologia">Conhecer Metodologia</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Elemento Visual de Fundo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />
      </section>

      {/* SEÇÃO DE FUNCIONALIDADES */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Funcionalidades do Sistema
            </h2>
            <p className="text-slate-500 max-w-xl">
              Explore os módulos integrados para uma visão 360º da saúde hídrica
              regional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<LayoutDashboard className="text-violet-500" />}
              title="Dashboard de Indicadores"
              description="Visualização gráfica do desempenho global e execução de metas nas bacias hidrográficas."
              href="/indicadores"
            />
            <FeatureCard
              icon={<Scale className="text-blue-700" />}
              title="Balanço Hídrico"
              description="Análise técnica comparativa entre a oferta disponível e a demanda consumida."
              href="/balanco"
            />
            <FeatureCard
              icon={<ClipboardList className="text-emerald-600" />}
              title="Planos de Ação"
              description="Monitoramento detalhado das iniciativas propostas e cronogramas de execução."
              href="/planos"
            />
            <FeatureCard
              icon={<FileText className="text-amber-600" />}
              title="Identificação e Cadastro"
              description="Base de dados centralizada com as características geográficas e socioeconômicas."
              href="/identificacao"
            />
            <FeatureCard
              icon={<Workflow className="text-emerald-500" />}
              title="Metodologia Aplicada"
              description="Acesso aos critérios técnicos e normativos utilizados no cálculo dos indicadores."
              href="/metodologia"
            />
            <FeatureCard
              icon={<Activity className="text-rose-600" />}
              title="Monitoramento"
              description="Acompanhamento contínuo das variações hídricas e alertas de criticidade."
              href="/monitoramento"
            />
          </div>
        </div>
      </section>

      {/* FOOTER BREVE */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Droplets className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-slate-900 uppercase tracking-widest text-sm">
            SIGRH
          </span>
        </div>
        <p className="text-slate-400 text-xs uppercase tracking-tighter">
          Plano de Recursos Hídricos
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group p-8 bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center justify-between">
        {title}
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </Link>
  );
}

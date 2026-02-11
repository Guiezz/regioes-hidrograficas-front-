"use client";

import { useEffect, useState } from "react";
// 1. Troca de useSearchParams para useReservoir
import { useReservoir } from "@/context/ReservoirContext";
import Image from "next/image";
import { getSections } from "@/services/api";
import { Loader2, MapPin } from "lucide-react";

interface Section {
  id: number;
  number: string;
  title: string;
  content: string;
  level: number;
  image?: string;
}

export default function MetodologiaPage() {
  // 2. Acesso ao Contexto Global
  const { selectedReservoir } = useReservoir();

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Só busca se houver um reservatório selecionado
      if (!selectedReservoir) return;

      setLoading(true);
      try {
        // 3. Usa o ID dinâmico do reservatório selecionado
        const data = await getSections(selectedReservoir.id);

        // Filtra capitulo 2 (Metodologia)
        const metodologiaSections = data
          .filter((s: Section) => s.number.startsWith("2"))
          .sort((a: Section, b: Section) =>
            a.number.localeCompare(b.number, undefined, { numeric: true }),
          );

        setSections(metodologiaSections);
      } catch (error) {
        console.error("Erro ao carregar textos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedReservoir]); // 4. Dependência atualizada

  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => (
      <p
        key={index}
        className="mb-8 text-slate-600 text-justify leading-[1.8] text-[1.1rem] font-light"
      >
        {line}
      </p>
    ));
  };

  const getImageUrl = (imageName: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "http://localhost:8080";
    return `${baseUrl}/assets/${imageName}`;
  };

  // Função getBasinName removida

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
            Processando Metodologia
          </span>
        </div>
      </div>
    );
  }

  const mainTitle = sections.find((s) => s.level === 1);
  const otherSections = sections.filter((s) => s.level > 1);

  return (
    <div className="min-h-screen bg-white selection:bg-sky-100 selection:text-sky-900">
      <div className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        {/* Cabeçalho Editorial */}
        <header className="mb-32 space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-sky-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600">
              Processo de Trabalho
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[0.95]">
              Metodologia Aplicada
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-sky-500" />
              <span className="text-sm tracking-wide">
                {/* 5. Nome dinâmico */}
                {selectedReservoir?.name
                  ? `Região Hidrográfica do ${selectedReservoir.name}`
                  : "Carregando..."}
              </span>
            </div>
          </div>

          {mainTitle?.content && (
            <div className="max-w-3xl text-xl md:text-2xl text-slate-500 font-light text-justify leading-relaxed">
              {renderContent(mainTitle.content)}
            </div>
          )}
        </header>

        {/* Timeline de Atividades */}
        <div className="space-y-15 relative">
          {/* Linha da Timeline (opcional, visualmente discreta) */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 ml-2.75 hidden md:block" />

          {otherSections.map((section) => {
            const isLevel2 = section.level === 2;

            return (
              <section
                key={section.id}
                className="relative pl-0 md:pl-12 group"
              >
                {/* Indicador Lateral para Desktop */}
                <div
                  className={`absolute left-0 top-2 hidden md:flex items-center justify-center w-5.5 h-5.5 rounded-full border-2 bg-white transition-colors duration-500 z-10 ${
                    isLevel2
                      ? "border-sky-500"
                      : "border-slate-200 group-hover:border-sky-300"
                  }`}
                />

                <div className="flex flex-col gap-8">
                  {/* Título da Seção/Fase */}
                  <header className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold tracking-widest uppercase ${
                          isLevel2 ? "text-sky-600" : "text-slate-400"
                        }`}
                      >
                        Etapa {section.number}
                      </span>
                    </div>
                    <h2
                      className={`${
                        isLevel2
                          ? "text-3xl md:text-4xl"
                          : "text-2xl md:text-3xl"
                      } font-bold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors`}
                    >
                      {section.title}
                    </h2>
                  </header>

                  {/* Imagem com tratamento editorial */}
                  {section.image && (
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <Image
                        src={getImageUrl(section.image)}
                        alt={section.title}
                        width={1200}
                        height={600}
                        className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter italic">
                            Diagrama Técnico
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Conteúdo Textual */}
                  {section.content && (
                    <div
                      className={`max-w-3xl ${isLevel2 ? "bg-slate-50/50 p-8 rounded-2xl text-justify border border-slate-100" : ""}`}
                    >
                      {renderContent(section.content)}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer Minimalista */}
        <footer className="mt-10 pt-8 border-t border-slate-200 flex flex-col items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-sky-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400"></p>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
// 1. Troca de useSearchParams para useReservoir
import { useReservoir } from "@/context/ReservoirContext";
import Image from "next/image";
import { getSections } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowRightLeft, AlertCircle, MapPin } from "lucide-react";

interface Section {
  id: number;
  number: string;
  title: string;
  content: string;
  level: number;
  image?: string;
}

export default function BalancoPage() {
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
        // 3. Busca dinâmica pelo ID do contexto
        const data = await getSections(selectedReservoir.id);

        // Filtra apenas o capítulo 6 (Balanço Hídrico) e ordena
        const balancoSections = data
          .filter((s: Section) => s.number.startsWith("6"))
          .sort((a: Section, b: Section) =>
            a.number.localeCompare(b.number, undefined, { numeric: true }),
          );

        setSections(balancoSections);
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
        className="mb-6 text-slate-600 leading-[1.8] text-[1rem] md:text-[1.1rem] font-light text-justify [hyphens:auto]"
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

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-200" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase italic">
            Cruzando Dados de Balanço
          </span>
        </div>
      </div>
    );
  }

  const mainTitle = sections.find((s) => s.level === 1);
  const tabs = sections.filter((s) => s.level === 2);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-20 lg:py-32">
        {/* Header Editorial */}
        <header className="mb-20 space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-sky-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600">
              Sustentabilidade Hídrica
            </span>
          </div>

          <div className="space-y-6">
            {/* Título responsivo */}
            <h1 className="text-4xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[0.95]">
              Balanço Hídrico
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm tracking-wide">
                {selectedReservoir?.name
                  ? `Região Hidrográfica do ${selectedReservoir.name}`
                  : "Carregando..."}
              </span>
            </div>
          </div>

          {mainTitle?.content && (
            <div className="max-w-3xl pt-8 border-t border-slate-100">
              <div className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed text-justify">
                {renderContent(mainTitle.content)}
              </div>
            </div>
          )}
        </header>

        {tabs.length > 0 ? (
          <Tabs
            defaultValue={tabs[0].number}
            className="w-full space-y-12 md:space-y-16"
          >
            <div className="sticky top-4 z-20 w-full flex justify-start md:justify-center overflow-x-auto pb-4 -mb-4">
              <TabsList className="bg-slate-100/80 backdrop-blur-md p-1 rounded-full border border-slate-200 shadow-sm h-auto inline-flex min-w-max mb-10">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.number}
                    className="rounded-full px-6 md:px-10 py-2.5 text-xs md:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                  >
                    Cenário {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map((tab) => {
              let children = sections.filter(
                (s) => s.level === 3 && s.number.startsWith(tab.number),
              );
              if (children.length === 0) {
                children = sections.filter(
                  (s) => s.level === 4 && s.number.startsWith(tab.number),
                );
              }

              return (
                <TabsContent
                  key={tab.id}
                  value={tab.number}
                  className="space-y-16 md:space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700 focus-visible:outline-none"
                >
                  {/* Artigo Principal do Cenário */}
                  <article className="space-y-8 md:space-y-12">
                    {tab.image && (
                      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                        <Image
                          src={getImageUrl(tab.image)}
                          alt={tab.title}
                          width={1200}
                          height={600}
                          className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                          unoptimized
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest border border-blue-100">
                          Matriz de Balanço
                        </div>
                      </div>
                    )}

                    <div className="max-w-4xl border-l-2 border-blue-100 pl-6 md:pl-8 italic">
                      {renderContent(tab.content)}
                    </div>
                  </article>

                  {/* Detalhamento de Resultados (Nível 3/4) */}
                  {children.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="group p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500"
                        >
                          <header className="mb-6 space-y-2">
                            <div className="flex items-center gap-2">
                              {child.title.toLowerCase().includes("déficit") ||
                              child.title.toLowerCase().includes("crítico") ? (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              ) : (
                                <ArrowRightLeft className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                              {child.title}
                            </h3>
                          </header>

                          <div className="text-slate-600">
                            {renderContent(child.content)}
                          </div>

                          {child.image && (
                            <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                              <Image
                                src={getImageUrl(child.image)}
                                alt={child.title}
                                width={600}
                                height={400}
                                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                                unoptimized
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        ) : (
          /* Estado vazio caso não haja seções do capítulo 6 */
          <div className="text-center py-20 text-slate-400">
            <p>Nenhum dado de balanço hídrico encontrado para esta bacia.</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 pt-8 border-t border-slate-200 flex flex-col items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-sky-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400"></p>
        </footer>
      </div>
    </div>
  );
}

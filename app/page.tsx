import { ElectoralDashboard } from "@/components/electoral/ElectoralDashboard";

export default function Home() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
        <ElectoralDashboard />

        <footer className="mt-16 pb-12 border-t border-outline-variant/10 pt-8 flex flex-col items-center gap-3 text-center">
          <p className="font-label text-sm text-on-surface-variant/80 tracking-wide">
            Adaptado por <span className="text-primary font-bold">ELVERANTONY</span> para visualizar la diferencia real entre Aliaga y Sánchez.
          </p>
          <p className="font-label text-[11px] text-on-surface-variant/50 uppercase tracking-[0.2em]">
            Basado en el proyecto original de <a href="https://github.com/CrimsonShadowLR" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-primary transition-colors underline decoration-primary/20 underline-offset-4">CrimsonShadowLR</a>
          </p>
        </footer>
      </div>
    </main>
  );
}

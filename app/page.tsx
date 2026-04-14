import { ElectoralDashboard } from "@/components/electoral/ElectoralDashboard";

export default function Home() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
        <ElectoralDashboard />
      </div>
    </main>
  );
}

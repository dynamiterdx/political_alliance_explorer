import { getActiveWorldState } from '@/lib/redis';
import { WorldMap } from '@/components/WorldMap';

export const revalidate = 10; // Revalidate every 10 seconds

export default async function Home() {
  const worldState = await getActiveWorldState();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans">

      {/* Top Navigation / Ticker */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          <h1 className="text-xl font-bold tracking-tight text-white">GeoSight <span className="text-emerald-400 font-mono text-xs ml-2 uppercase px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">{worldState?.freshness_status || 'LIVE'}</span></h1>
        </div>

        <div className="text-sm text-slate-400 font-mono">
          Global Threat Level: <span className="text-amber-400 font-bold">ELEVATED</span>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 flex overflow-hidden">

        {/* Left Sidebar: Active Conflicts / Situations */}
        <aside className="w-96 border-r border-slate-800 bg-slate-900/30 overflow-y-auto flex flex-col z-10 shadow-[5px_0_20px_rgba(0,0,0,0.5)]">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 sticky top-0">
            <h2 className="text-sm font-semibold text-slate-300 uppercase letter tracking-wider">Active Situations</h2>
            <p className="text-xs text-slate-500 mt-1">Updated {new Date(worldState?.last_scan_time || Date.now()).toLocaleTimeString()}</p>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {worldState?.situations?.length > 0 ? (
              worldState?.situations?.map((sit: any) => (
                <div key={sit.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-all hover:bg-slate-800/60 hover:border-slate-700 cursor-pointer">
                  <div className={`absolute top-0 left-0 w-1 h-full ${sit.intensity_score >= 8 ? 'bg-red-500' : sit.intensity_score >= 5 ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">{sit.type}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${sit.trend_direction === 'escalating' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {sit.trend_direction}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mt-2 line-clamp-2">{sit.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3">{sit.summary}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 text-center py-8">No active situations detected.</div>
            )}
          </div>
        </aside>

        {/* Center: Interactive World Map View */}
        <section className="flex-1 relative bg-slate-950 flex flex-col p-4">
          <WorldMap situations={worldState?.situations || []} />
        </section>

      </main>
    </div>
  );
}

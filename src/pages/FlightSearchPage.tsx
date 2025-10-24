import { FlightSearchHero } from "@/components/feature/flightSearch/FlightSearchHero";

function FlightSearchPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#050613] via-[#0b1530] to-[#050613] px-4 py-20 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(168,85,247,0.12),_transparent_60%)]" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(rgba(148,163,184,0.18)_1px,_transparent_1px)] [background-size:34px_34px]" />
        <div className="absolute -inset-1/2 animate-[spin_60s_linear_infinite] bg-[conic-gradient(from_210deg,_rgba(59,130,246,0.28),_rgba(236,72,153,0.16),_rgba(14,165,233,0.15),_transparent_70%)] blur-[220px] opacity-[0.35]" />
        <div className="absolute left-1/2 top-[-16rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-sky-400/25 blur-[170px]" />
        <div className="absolute bottom-[-12rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-[160px]" />
        <div className="absolute bottom-[-10rem] right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-purple-500/25 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_65%)]" />
        <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle,_rgba(2,132,199,0.35)_0,_rgba(2,132,199,0)_55%)]" />
      </div>

      <div className="relative w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-[2.75rem] border border-white/15 bg-white/10 shadow-[0_35px_120px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-70" />
          <div className="absolute -right-20 top-12 h-56 w-56 rounded-full bg-sky-400/20 blur-[140px]" />
          <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-[150px]" />
          <div className="relative z-10 rounded-[2.75rem] border border-white/10 bg-slate-900/70">
            <FlightSearchHero />
          </div>
        </div>
      </div>
    </main>
  );
}

export default FlightSearchPage;

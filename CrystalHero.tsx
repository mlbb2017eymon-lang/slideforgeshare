export default function CrystalHero() {
  return (
    <div className="relative mx-auto h-[260px] w-full max-w-[760px] [perspective:900px] sm:h-[400px]">
      <div className="ring outer" />
      <div className="ring" />
      <div className="crystal" />
      <div className="crystal-shard" />
      <div className="crystal-shard b" />

      <div className="glass-card absolute left-0 top-[4%] hidden w-[176px] -rotate-[7deg] rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-left shadow-2xl shadow-black/45 backdrop-blur-xl sm:block">
        <div className="mini-mountain" />
        <p className="mt-2 text-[11px] font-semibold leading-snug text-white/90">
          The Future of Artificial Intelligence
        </p>
      </div>

      <div className="glass-card absolute right-0 top-0 hidden w-[176px] rotate-[6deg] rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-left shadow-2xl shadow-black/45 backdrop-blur-xl sm:block">
        <div className="mini-chart">
          <span style={{ height: "40%" }} />
          <span style={{ height: "65%" }} />
          <span style={{ height: "50%" }} />
          <span style={{ height: "85%" }} />
          <span style={{ height: "60%" }} />
        </div>
        <p className="mt-2 text-[11px] font-semibold leading-snug text-white/90">
          Business Growth Strategy
        </p>
      </div>

      <div className="glass-card absolute bottom-[4%] right-[4%] hidden w-[150px] -rotate-[5deg] rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-left shadow-2xl shadow-black/45 backdrop-blur-xl sm:block">
        <div className="h-[60px] rounded-lg bg-gradient-to-br from-secondary to-primary opacity-80" />
        <p className="mt-2 text-[11px] font-semibold leading-snug text-white/90">
          Better Together
        </p>
      </div>

      <div className="glass-card absolute bottom-0 left-[4%] hidden w-[150px] rotate-[8deg] rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-left shadow-2xl shadow-black/45 backdrop-blur-xl sm:block">
        <p className="text-[11px] font-semibold leading-snug text-white/90">
          Q3 Roadmap
        </p>
        <p className="mt-1 text-[10px] text-white/40">4 milestones · Q3–Q4</p>
      </div>

      <div className="mini-badge absolute left-[20%] top-[-2%] hidden sm:block">
        ✦ AI Visuals
      </div>
      <div className="mini-badge absolute bottom-[8%] right-[16%] hidden sm:block">
        ◈ 6 slides
      </div>

      <div className="absolute bottom-[18%] left-[6%] hidden rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-emerald-400 backdrop-blur-xl sm:block">
        ↑ 246%
      </div>
    </div>
  );
}

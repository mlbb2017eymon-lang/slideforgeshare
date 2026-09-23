"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Deck = {
  prompt: string;
  slides: { label: string; title: string; accent: string }[];
};

const DECKS: Deck[] = [
  {
    prompt: "Q3 growth results for the board",
    slides: [
      { label: "Overview", title: "Q3 beat plan by 18%", accent: "from-violet-500/30 to-blue-500/20" },
      { label: "Revenue", title: "New markets drove $2.1M", accent: "from-blue-500/30 to-cyan-400/15" },
      { label: "Next steps", title: "Scale the EU rollout", accent: "from-fuchsia-500/25 to-violet-500/15" },
    ],
  },
  {
    prompt: "Pitch deck for a climate tech startup",
    slides: [
      { label: "Problem", title: "Grids waste 30% of solar output", accent: "from-emerald-500/25 to-blue-500/15" },
      { label: "Solution", title: "Predictive load balancing", accent: "from-blue-500/30 to-violet-500/20" },
      { label: "Ask", title: "Raising a $4M seed round", accent: "from-violet-500/30 to-fuchsia-500/15" },
    ],
  },
  {
    prompt: "Onboarding guide for new hires",
    slides: [
      { label: "Welcome", title: "Your first two weeks", accent: "from-violet-500/25 to-blue-500/20" },
      { label: "Tools", title: "Everything you'll need, day one", accent: "from-cyan-400/20 to-blue-500/25" },
      { label: "Culture", title: "How we make decisions", accent: "from-fuchsia-500/20 to-violet-500/20" },
    ],
  },
];

const TYPE_SPEED = 38;
const HOLD_AFTER_TYPE = 550;
const HOLD_FULL_DECK = 2600;

export default function DeckPreview() {
  const [deckIndex, setDeckIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "building" | "done">("typing");

  const deck = DECKS[deckIndex];

  useEffect(() => {
    setTyped("");
    setPhase("typing");

    let i = 0;
    const prompt = deck.prompt;

    const typeTimer = window.setInterval(() => {
      i += 1;
      setTyped(prompt.slice(0, i));

      if (i >= prompt.length) {
        window.clearInterval(typeTimer);

        window.setTimeout(() => {
          setPhase("building");

          window.setTimeout(() => {
            setPhase("done");
          }, 700);
        }, HOLD_AFTER_TYPE);
      }
    }, TYPE_SPEED);

    return () => window.clearInterval(typeTimer);
  }, [deckIndex, deck.prompt]);

  useEffect(() => {
    if (phase !== "done") return;

    const next = window.setTimeout(() => {
      setDeckIndex((value) => (value + 1) % DECKS.length);
    }, HOLD_FULL_DECK);

    return () => window.clearTimeout(next);
  }, [phase]);

  return (
    <div className="relative w-full rounded-[28px] border border-white/10 bg-white/[0.02] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
        <p className="min-w-0 flex-1 truncate text-[13px] text-white/70">
          {typed}
          <span className="ml-px inline-block h-[1em] w-[1.5px] translate-y-[1px] bg-violet-300/80 align-middle" />
        </p>
        <span className="shrink-0 font-[family-name:var(--font-geist-mono)] text-[10px] text-white/25">
          6 slides
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {deck.slides.map((slide, index) => (
          <motion.div
            key={`${deckIndex}-${index}`}
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={
              phase === "typing"
                ? { opacity: 0, y: 14, scale: 0.94 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={{
              duration: 0.45,
              delay: phase === "building" ? index * 0.12 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${slide.accent} p-2.5`}
          >
            <p className="text-[8px] font-medium uppercase tracking-wide text-white/50">
              {slide.label}
            </p>
            <p className="mt-1.5 text-[10px] font-semibold leading-tight text-white/90">
              {slide.title}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === "done" && (
          <motion.div
            key={`ready-${deckIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex items-center gap-2 text-[11px] text-white/35"
          >
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            Ready to edit and export
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

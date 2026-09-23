"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Templates", href: "#templates" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#how" },
];

export default function LandingNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(
    null
  );

  function handleEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const container = containerRef.current;
    if (!container) return;

    const itemRect = e.currentTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setIndicator({
      left: itemRect.left - containerRect.left,
      width: itemRect.width,
    });
  }

  return (
    <div className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-2 shadow-lg shadow-black/35 backdrop-blur-xl">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-accent text-[13px] font-bold text-black"
        >
          S
        </Link>

        <div
          ref={containerRef}
          onMouseLeave={() => setIndicator(null)}
          className="relative mx-1 hidden items-center sm:flex"
        >
          {indicator && (
            <motion.div
              className="absolute top-0 h-full rounded-full bg-white/8"
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}

          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={handleEnter}
              className="relative z-10 px-4 py-2 text-[13px] text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href="/login?next=/workspace"
          className="hidden rounded-full px-3.5 py-2 text-[13px] text-white/60 transition hover:text-white sm:block"
        >
          Sign in
        </Link>

        <Link
          href="/login?next=/workspace"
          className="ml-1 rounded-full bg-gradient-to-br from-primary to-accent px-4 py-2 text-[13px] font-semibold text-white transition hover:brightness-110"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}

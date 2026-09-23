"use client";

import { useEffect, useState } from "react";

type Star = {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  delay: number;
};

type Particle = {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
};

const COLORS = [
  "rgba(132,57,252,0.9)",
  "rgba(21,173,254,0.9)",
  "rgba(249,111,181,0.9)",
];

export default function Starfield({
  starCount = 140,
  particleCount = 22,
}: {
  starCount?: number;
  particleCount?: number;
}) {
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: starCount }, (_, id) => ({
        id,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() < 0.8 ? 1 : Math.random() < 0.95 ? 2 : 3,
        opacity: 0.25 + Math.random() * 0.6,
        twinkle: Math.random() < 0.3,
        delay: Math.random() * 3,
      }))
    );

    setParticles(
      Array.from({ length: particleCount }, (_, id) => ({
        id,
        left: Math.random() * 100,
        top: 40 + Math.random() * 55,
        size: 2 + Math.random() * 3,
        color: COLORS[id % COLORS.length],
        duration: 5 + Math.random() * 6,
        delay: Math.random() * 6,
      }))
    );
  }, [starCount, particleCount]);

  return (
    <>
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star${star.twinkle ? " twinkle" : ""}`}
            style={
              {
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                "--base-op": star.opacity,
                animationDelay: star.twinkle ? `${star.delay}s` : undefined,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, ${p.color}, transparent 70%)`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}

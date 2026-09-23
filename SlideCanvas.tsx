"use client";

import type { SlideElement, SlideSpec } from "@/lib/presentation/types";

type Props = { slide: SlideSpec; onChange: (slide: SlideSpec) => void };

const frame = (el: SlideElement) => ({ left: `${el.x}%`, top: `${el.y}%`, width: `${el.width}%`, height: `${el.height}%` });

export default function SlideCanvas({ slide, onChange }: Props) {
  function updateElement(id: string, patch: Partial<SlideElement>) {
    onChange({ ...slide, elements: slide.elements.map(el => el.id === id ? ({ ...el, ...patch } as SlideElement) : el) });
  }
  const titleEl = slide.elements.find(e => e.type === "text" && e.role === "heading");
  const imageEls = slide.elements.filter(e => e.type === "image");

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#090b12] shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(139,92,246,.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,.12),transparent_30%),linear-gradient(135deg,#0a0d16,#08090d)]" />
      {imageEls.map((el) => el.src ? <img key={el.id} src={el.src} alt="" className={`absolute z-0 object-cover ${el.fit === "contain" ? "object-contain" : "object-cover"}`} style={frame(el)} /> : null)}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/15 to-black/55" />

      {slide.elements.map((el) => {
        const style = frame(el);
        if (el.type === "image") {
          return <div key={el.id} className="absolute z-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]" style={style}>
            {el.src ? <img src={el.src} alt="" className={`h-full w-full ${el.fit === "contain" ? "object-contain" : "object-cover"}`} /> : <div className="flex h-full items-center justify-center p-3 text-center text-[10px] text-white/35">AI visual<br/>generating…</div>}
          </div>;
        }
        if (el.type === "text") return <textarea key={el.id} value={el.text} onChange={e => updateElement(el.id, { text: e.target.value })} className={`absolute z-30 resize-none rounded-xl border border-transparent bg-transparent p-1 outline-none focus:border-white/15 focus:bg-black/20 ${el.role === "heading" ? "text-[clamp(18px,3.2vw,50px)] font-bold leading-tight" : el.role === "label" ? "text-[clamp(7px,1vw,13px)] uppercase tracking-[.18em] text-violet-200" : "text-[clamp(8px,1vw,15px)] text-white/75"}`} style={style} />;
        if (el.type === "stat") return <div key={el.id} className="absolute z-20 rounded-2xl border border-white/10 bg-white/[.06] p-4 backdrop-blur-xl" style={style}><div className="text-[clamp(18px,3vw,42px)] font-black">{el.value}</div><div className="text-[clamp(7px,1vw,13px)] text-white/55">{el.label}</div>{el.change && <div className="mt-2 text-[10px] text-emerald-300">{el.change}</div>}</div>;
        if (el.type === "quote") return <div key={el.id} className="absolute z-20 flex flex-col justify-center rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl" style={style}><div className="text-[clamp(12px,1.7vw,25px)] font-medium leading-snug">“{el.quote}”</div><div className="mt-3 text-[10px] text-white/45">{el.author || el.source || ""}</div></div>;
        if (el.type === "cards") return <div key={el.id} className="absolute z-20 grid gap-2" style={{...style, gridTemplateColumns:`repeat(${Math.min(el.items.length,3)},minmax(0,1fr))`}}>{el.items.map((item,i)=><div key={i} className="rounded-xl border border-white/10 bg-white/[.06] p-3 backdrop-blur-xl"><div className="mb-1 text-[clamp(8px,1vw,13px)] font-semibold">{item.icon ? `${item.icon} ` : ""}{item.title}</div><div className="text-[clamp(7px,.85vw,11px)] leading-snug text-white/50">{item.body}</div></div>)}</div>;
        if (el.type === "comparison") return <div key={el.id} className="absolute z-20 overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl" style={style}><div className="grid grid-cols-2 border-b border-white/10 text-[10px] font-bold"><div className="p-2">{el.leftTitle}</div><div className="border-l border-white/10 p-2">{el.rightTitle}</div></div>{el.rows.map((r,i)=><div key={i} className="grid grid-cols-[.8fr_1fr_1fr] border-b border-white/5 text-[8px]"><div className="p-2 text-white/40">{r.label}</div><div className="border-l border-white/5 p-2 text-white/70">{r.left}</div><div className="border-l border-white/5 p-2 text-white/70">{r.right}</div></div>)}</div>;
        if (el.type === "table") return <div key={el.id} className="absolute z-20 overflow-hidden rounded-2xl border border-white/10 bg-black/35 text-[8px] backdrop-blur-xl" style={style}><div className="grid" style={{gridTemplateColumns:`repeat(${el.columns.length},1fr)`}}>{el.columns.map((c,i)=><div key={i} className="border-b border-white/10 p-2 font-semibold">{c}</div>)}{el.rows.flatMap((row,ri)=>row.map((cell,ci)=><div key={`${ri}-${ci}`} className="border-b border-white/5 p-2 text-white/60">{cell}</div>))}</div></div>;
        if (el.type === "chart") { const max=Math.max(...el.values,1); return <div key={el.id} className="absolute z-20 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-xl" style={style}><div className="mb-2 text-[9px] font-semibold text-white/60">{el.title}</div><div className="flex h-[calc(100%-20px)] items-end gap-1">{el.values.map((v,i)=><div key={i} className="flex h-full flex-1 flex-col justify-end"><div className="rounded-t bg-violet-400/70" style={{height:`${(v/max)*88}%`}}/><div className="mt-1 truncate text-center text-[6px] text-white/35">{el.labels[i]}</div></div>)}</div></div> }
        if (el.type === "diagram") return <div key={el.id} className="absolute z-20 rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-xl" style={style}><div className="mb-3 text-[9px] font-semibold text-white/55">{el.title || el.kind}</div><div className="flex h-[calc(100%-20px)] flex-wrap items-center justify-center gap-2">{el.nodes.map((n,i)=><div key={n.id} className="rounded-xl border border-violet-300/20 bg-violet-400/10 px-3 py-2 text-center text-[8px] text-white/80"><div>{n.label}</div>{i < el.nodes.length-1 && <span className="text-violet-300/60">↓</span>}</div>)}</div></div>;
        if (el.type === "timeline") return <div key={el.id} className="absolute z-20 rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl" style={style}><div className="flex h-full items-center gap-2">{el.items.map((it,i)=><div key={i} className="min-w-0 flex-1"><div className="mb-2 h-1 rounded bg-violet-400/70"/><div className="text-[8px] text-violet-200">{it.date}</div><div className="mt-1 text-[9px] font-semibold">{it.title}</div><div className="mt-1 text-[7px] text-white/40">{it.description}</div></div>)}</div></div>;
        if (el.type === "process") return <div key={el.id} className="absolute z-20 grid gap-2" style={{...style, gridTemplateColumns:`repeat(${Math.min(el.steps.length,4)},1fr)`}}>{el.steps.map((s,i)=><div key={i} className="rounded-xl border border-white/10 bg-white/[.05] p-3"><div className="mb-1 text-[8px] text-violet-300">0{i+1}</div><div className="text-[9px] font-semibold">{s.title}</div><div className="mt-1 text-[7px] text-white/40">{s.description}</div></div>)}</div>;
        if (el.type === "roadmap") return <div key={el.id} className="absolute z-20 grid gap-2" style={{...style, gridTemplateColumns:`repeat(${Math.min(el.phases.length,4)},1fr)`}}>{el.phases.map((p,i)=><div key={i} className="rounded-xl border border-white/10 bg-white/[.05] p-3"><div className="text-[8px] font-semibold">{p.title}</div><div className="text-[7px] text-violet-300">{p.timeframe}</div><ul className="mt-2 space-y-1 text-[7px] text-white/45">{p.items.map((x,j)=><li key={j}>• {x}</li>)}</ul></div>)}</div>;
        if (el.type === "shape") return <div key={el.id} className={`${el.shape === "circle" ? "rounded-full" : "rounded-2xl"} absolute z-10 border border-white/10 bg-white/[.04]`} style={style} />;
        return null;
      })}

      {!titleEl && <div className="absolute left-[7%] top-[7%] z-30 text-[clamp(18px,3.2vw,50px)] font-bold">{slide.title}</div>}
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-black/30 px-2 py-1 text-[7px] uppercase tracking-wider text-white/25">{slide.layout} · editable</div>
    </div>
  );
}

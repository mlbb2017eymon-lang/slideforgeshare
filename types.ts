export type PresentationElementType =
  | "text" | "image" | "chart" | "table" | "diagram" | "stat"
  | "timeline" | "quote" | "cards" | "comparison" | "process" | "roadmap" | "shape";

export type ChartKind = "bar" | "line" | "area" | "donut" | "pie" | "radar" | "scatter";
export type DiagramKind = "flow" | "cycle" | "funnel" | "pyramid" | "matrix" | "swot" | "org";
export type LayoutKind =
  | "hero" | "focus" | "split" | "image-left" | "image-right" | "grid" | "dashboard"
  | "timeline" | "comparison" | "quote" | "minimal" | "data" | "closing" | "process" | "roadmap";

export type ElementFrame = { id: string; x: number; y: number; width: number; height: number };

export type SlideElement =
  | (ElementFrame & { type: "text"; text: string; role?: "heading" | "body" | "label" })
  | (ElementFrame & { type: "image"; prompt: string; src?: string; fit?: "cover" | "contain" })
  | (ElementFrame & { type: "chart"; kind: ChartKind; title?: string; labels: string[]; values: number[]; unit?: string })
  | (ElementFrame & { type: "table"; columns: string[]; rows: string[][] })
  | (ElementFrame & { type: "diagram"; kind: DiagramKind; title?: string; nodes: { id: string; label: string; description?: string }[]; edges: { from: string; to: string }[] })
  | (ElementFrame & { type: "stat"; value: string; label: string; change?: string })
  | (ElementFrame & { type: "timeline"; items: { date: string; title: string; description?: string }[] })
  | (ElementFrame & { type: "quote"; quote: string; author?: string; source?: string })
  | (ElementFrame & { type: "cards"; items: { title: string; body: string; icon?: string }[] })
  | (ElementFrame & { type: "comparison"; leftTitle: string; rightTitle: string; rows: { label: string; left: string; right: string }[] })
  | (ElementFrame & { type: "process"; steps: { title: string; description?: string }[] })
  | (ElementFrame & { type: "roadmap"; phases: { title: string; timeframe?: string; items: string[] }[] })
  | (ElementFrame & { type: "shape"; shape: "card" | "circle" | "line" });

export type SlideSpec = {
  title: string;
  subtitle: string;
  bullets: string[];
  visual: string;
  layout: LayoutKind;
  purpose: string;
  elements: SlideElement[];
  speakerNotes?: string;
};

export type Presentation = {
  title: string;
  description: string;
  topic: string;
  language: string;
  styleId: string;
  presentationType: string;
  slides: SlideSpec[];
};

export type StylePreset = {
  id: string; name: string; family: string; variant: string; description: string;
  colors: { background: string; surface: string; primary: string; accent: string; text: string; muted: string };
  typography: { heading: string; body: string; weight: "soft" | "balanced" | "bold" };
  radius: "sharp" | "soft" | "rounded" | "pill";
  density: "airy" | "balanced" | "dense";
  visualTreatment: string; chartTreatment: string; preferredLayouts: LayoutKind[];
};

export type PresentationType = { id: string; name: string; description: string; preferredElements: PresentationElementType[] };

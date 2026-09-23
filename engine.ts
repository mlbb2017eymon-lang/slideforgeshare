import type {
  PresentationElementType,
  PresentationType,
  StylePreset,
} from "./types";

export const PRESENTATION_TYPES: PresentationType[] = [
  {
    id: "auto",
    name: "Auto",
    description: "Let SlideForge choose the structure from the topic.",
    preferredElements: ["text", "image", "stat", "chart", "diagram", "cards", "process"],
  },
  {
    id: "business",
    name: "Business",
    description: "Clear strategy, decisions and measurable outcomes.",
    preferredElements: ["stat", "chart", "table", "comparison", "roadmap", "process"],
  },
  {
    id: "pitch",
    name: "Pitch Deck",
    description: "Investor-oriented narrative from problem to traction to ask.",
    preferredElements: ["stat", "chart", "comparison", "roadmap", "image", "cards"],
  },
  {
    id: "report",
    name: "Report",
    description: "Evidence-heavy presentation for findings and recommendations.",
    preferredElements: ["chart", "table", "stat", "comparison", "diagram", "quote"],
  },
  {
    id: "research",
    name: "Research",
    description: "Structured scientific or academic storytelling.",
    preferredElements: ["chart", "table", "diagram", "process", "timeline", "quote"],
  },
  {
    id: "education",
    name: "Education",
    description: "Explain concepts progressively and visually.",
    preferredElements: ["diagram", "process", "timeline", "cards", "image", "comparison"],
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Campaign, audience and positioning focused.",
    preferredElements: ["image", "stat", "comparison", "cards", "chart", "quote"],
  },
  {
    id: "product",
    name: "Product Launch",
    description: "Product story, features, differentiation and roadmap.",
    preferredElements: ["image", "cards", "comparison", "stat", "roadmap", "process"],
  },
  {
    id: "lesson",
    name: "Lesson",
    description: "Classroom-friendly progression with examples and recap.",
    preferredElements: ["diagram", "process", "cards", "timeline", "quote", "image"],
  },
  {
    id: "conference",
    name: "Conference",
    description: "High-impact speaker deck with visual pacing.",
    preferredElements: ["image", "stat", "quote", "diagram", "cards"],
  },
];

const ELEMENT_BY_TOPIC: Record<string, PresentationElementType[]> = {
  business: ["stat", "chart", "comparison", "table", "roadmap"],
  finance: ["chart", "table", "stat", "comparison"],
  technology: ["diagram", "image", "chart", "process", "cards"],
  ai: ["diagram", "image", "stat", "process", "comparison"],
  science: ["chart", "diagram", "table", "process", "timeline"],
  medical: ["diagram", "stat", "process", "image", "chart"],
  education: ["diagram", "process", "timeline", "cards", "image"],
  marketing: ["image", "stat", "comparison", "chart", "cards"],
  startup: ["stat", "chart", "roadmap", "comparison", "image"],
  history: ["timeline", "image", "quote", "comparison", "cards"],
  product: ["image", "cards", "comparison", "roadmap", "stat"],
};

export function chooseElementTypes(
  presentationType: string,
  topicTags: string[],
  style: StylePreset
): PresentationElementType[] {
  const result: PresentationElementType[] = [];
  const add = (items: PresentationElementType[]) => {
    for (const item of items) {
      if (!result.includes(item)) result.push(item);
    }
  };

  const type = PRESENTATION_TYPES.find((item) => item.id === presentationType);
  if (type) add(type.preferredElements);

  for (const tag of topicTags) {
    add(ELEMENT_BY_TOPIC[tag.toLowerCase()] ?? []);
  }

  // Style can bias the visual system without overriding topic needs.
  if (style.family === "editorial" || style.family === "luxury") {
    add(["quote", "image"]);
  }
  if (style.family === "3d" || style.family === "futuristic") {
    add(["image", "cards"]);
  }

  return result.slice(0, 8);
}

export function chooseLayout(
  slidePurpose: string,
  preferredLayouts: StylePreset["preferredLayouts"]
) {
  const purpose = slidePurpose.toLowerCase();

  if (purpose.includes("data") || purpose.includes("metric")) {
    return "data" as const;
  }
  if (purpose.includes("compare")) {
    return "comparison" as const;
  }
  if (purpose.includes("timeline") || purpose.includes("roadmap")) {
    return "timeline" as const;
  }
  if (purpose.includes("quote")) {
    return "quote" as const;
  }

  return preferredLayouts[0] ?? "focus";
}

export function findStylePreset(styleId: string, presets: StylePreset[]): StylePreset {
  const needle = styleId.trim().toLowerCase();
  return presets.find((s) => s.id.toLowerCase() === needle)
    ?? presets.find((s) => s.name.toLowerCase() === needle)
    ?? presets.find((s) => s.family.toLowerCase() === needle)
    ?? presets.find((s) => s.family === "minimal")
    ?? presets[0];
}

export function normalizeLayout(value: unknown, fallback: import("./types").LayoutKind = "focus") {
  const allowed = ["hero","focus","split","image-left","image-right","grid","dashboard","timeline","comparison","quote","minimal","data","closing","process","roadmap"] as const;
  return allowed.includes(String(value) as (typeof allowed)[number]) ? String(value) as (typeof allowed)[number] : fallback;
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CLOUDFLARE_MODEL =
  "@cf/black-forest-labs/flux-1-schnell";

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function POST(request: Request) {
  try {
    const accountId =
      process.env.CLOUDFLARE_ACCOUNT_ID;

    const apiToken =
      process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId) {
      return NextResponse.json(
        {
          error:
            "CLOUDFLARE_ACCOUNT_ID is missing in .env.local",
        },
        { status: 500 }
      );
    }

    if (!apiToken) {
      return NextResponse.json(
        {
          error:
            "CLOUDFLARE_API_TOKEN is missing in .env.local",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const title = clean(body?.title, 120);
    const subtitle = clean(body?.subtitle, 160);
    const visual = clean(body?.visual, 900);
    const style = clean(body?.style, 100) || "Modern";

    if (!visual) {
      return NextResponse.json(
        {
          error: "Visual prompt is required",
        },
        { status: 400 }
      );
    }

    const prompt = `
Create a premium cinematic presentation image.

MAIN SCENE:
${visual}

PRESENTATION CONTEXT:
${title}

${subtitle}

VISUAL STYLE:
${style}

QUALITY:
cinematic photography,
premium editorial visual,
photorealistic,
high detail,
sharp subject,
strong depth,
dramatic but natural lighting,
rich vivid colors,
high contrast,
professional art direction,
clean composition,
modern technology presentation aesthetic.

COMPOSITION:
widescreen presentation composition,
clear focal point,
subject positioned intelligently,
balanced visual hierarchy,
some clean negative space,
strong foreground and background depth.

IMPORTANT:
The generated image must contain ONLY the visual scene.

DO NOT include:
text,
letters,
words,
numbers,
logos,
captions,
subtitles,
watermarks,
UI,
interface,
charts,
diagrams,
infographics,
frames,
borders,
presentation templates.

Do not render any written information inside the image.
`;

    const finalPrompt = prompt.slice(0, 2048);

    console.log(
      `[SlideForge] Generating image: ${title}`
    );

    const endpoint =
      `https://api.cloudflare.com/client/v4/accounts/` +
      `${accountId}/ai/run/${CLOUDFLARE_MODEL}`;

    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        prompt: finalPrompt,
        steps: 8,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "[SlideForge] Cloudflare error:",
        data
      );

      return NextResponse.json(
        {
          error:
            data?.errors?.[0]?.message ||
            data?.error ||
            "Cloudflare image generation failed",
        },
        {
          status: response.status,
        }
      );
    }

    if (!data?.success) {
      console.error(
        "[SlideForge] Cloudflare unsuccessful response:",
        data
      );

      return NextResponse.json(
        {
          error:
            data?.errors?.[0]?.message ||
            "Cloudflare returned an unsuccessful response",
        },
        {
          status: 500,
        }
      );
    }

    const image = data?.result?.image;

    if (
      typeof image !== "string" ||
      image.length < 100
    ) {
      console.error(
        "[SlideForge] Invalid Cloudflare image:",
        data
      );

      return NextResponse.json(
        {
          error:
            "Cloudflare returned an invalid image",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      `[SlideForge] Image generated successfully: ${title}`
    );

    return NextResponse.json(
      {
        success: true,

        image:
          `data:image/jpeg;base64,${image}`,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "[SlideForge] Image generation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate image",
      },
      {
        status: 500,
      }
    );
  }
}
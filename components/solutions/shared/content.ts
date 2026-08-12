import {
  resolveBlockTranslation,
  type ContentBlock,
  type Locale,
} from "@/lib/content/blocks";
import type {
  ContentSection,
  LocalizedText,
  ResolvedBlock,
} from "./types";

function toText(
  block: ContentBlock,
  locale: Locale,
): LocalizedText {
  const t = resolveBlockTranslation(block, locale);
  return {
    heading: t?.heading ?? null,
    body: t?.body ?? null,
    bodyHtml: t?.bodyHtml ?? null,
    listItems: t?.listItems ?? [],
    links: t?.links ?? [],
    ctaLabel: t?.ctaLabel ?? null,
    ctaUrl: t?.ctaUrl ?? null,
    imageAlts: t?.imageAlts ?? [],
  };
}

export function resolve(
  block: ContentBlock,
  locale: Locale,
): ResolvedBlock {
  return { block, text: toText(block, locale) };
}

export function resolveAll(
  blocks: ContentBlock[],
  locale: Locale,
): ResolvedBlock[] {
  return blocks.map((b) => resolve(b, locale));
}

/** Split page into sequential content sections keyed by headings. */
export function sectionize(
  blocks: ContentBlock[],
  locale: Locale,
): ContentSection[] {
  const sections: ContentSection[] = [];
  let current: ContentSection = emptySection();

  const push = () => {
    if (hasContent(current)) sections.push(current);
    current = emptySection();
  };

  for (const block of blocks) {
    const r = resolve(block, locale);
    if (block.type === "heading" || block.type === "hero") {
      if (hasContent(current)) push();
      current.heading = r;
      continue;
    }
    if (block.type === "richText") current.bodies.push(r);
    else if (block.type === "image" || block.type === "imageTextRow")
      current.images.push(r);
    else if (block.type === "videoEmbed") current.videos.push(r);
    else if (block.type === "featureCard") current.features.push(r);
    else if (block.type === "statCounter") current.stats.push(r);
    else if (block.type === "iconList") current.list = r;
    else if (block.type === "ctaButton" || block.type === "dualCta")
      current.ctas.push(r);
    else if (block.type === "gallery") current.gallery = r;
    else if (block.type === "formEmbed") current.form = r;
    else if (block.type === "slides") current.images.push(r);
  }
  push();
  return sections;
}

function emptySection(): ContentSection {
  return {
    heading: null,
    bodies: [],
    images: [],
    videos: [],
    features: [],
    stats: [],
    list: null,
    ctas: [],
    gallery: null,
    form: null,
  };
}

function hasContent(s: ContentSection): boolean {
  return Boolean(
    s.heading ||
      s.bodies.length ||
      s.images.length ||
      s.videos.length ||
      s.features.length ||
      s.stats.length ||
      s.list ||
      s.ctas.length ||
      s.gallery ||
      s.form,
  );
}

export function firstImageSrc(blocks: ContentBlock[]): string | null {
  for (const b of blocks) {
    if (b.images[0]?.src) return b.images[0].src;
    if (b.layout.image) return b.layout.image;
  }
  return null;
}

export function allImages(blocks: ContentBlock[]): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    for (const img of b.images) {
      if (img.src) out.push(img.src);
    }
    if (b.layout.image) out.push(b.layout.image);
  }
  return out;
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function bodyText(r: ResolvedBlock | null | undefined): string {
  if (!r) return "";
  return r.text.body || stripHtml(r.text.bodyHtml) || "";
}

export function headingText(r: ResolvedBlock | null | undefined): string {
  return r?.text.heading?.trim() || "";
}

export function imageSrc(r: ResolvedBlock | null | undefined): string | null {
  if (!r) return null;
  return r.block.images[0]?.src || r.block.layout.image || null;
}

export function imageAlt(
  r: ResolvedBlock | null | undefined,
  fallback = "",
): string {
  return r?.text.imageAlts[0] || fallback;
}

/**
 * Step 3 — Merge per-locale raw JSON into one file per page.
 *
 * Usage: npm run merge:pages
 *
 * Reads:  front/data/raw/{locale}/{slug}.json
 * Writes: front/data/pages/{slug}.json
 *         front/data/pages/_merge-report.json
 *
 * Alignment: English (or longest available locale) is the reference skeleton.
 * A locale is included on a block only when its widgetType at that index matches.
 * Missing/divergent locales are omitted from that block's translations (no invented copy).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(ROOT, "data", "raw");
const OUT_DIR = path.join(ROOT, "data", "pages");

const LOCALES = ["da", "en", "de", "fr", "nl", "nb", "sv", "tr"] as const;
type Locale = (typeof LOCALES)[number];

// ---------------------------------------------------------------------------
// Raw types
// ---------------------------------------------------------------------------

interface RawImage {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
}

interface RawVideo {
  src: string;
  provider: string;
  poster: string | null;
  lightbox: boolean;
}

interface RawLink {
  label: string;
  href: string;
}

interface RawBlock {
  id: string;
  order: number;
  sectionIndex: number;
  elementorId: string | null;
  widgetType: string;
  classes: string[];
  heading: string | null;
  bodyHtml: string | null;
  bodyText: string | null;
  images: RawImage[];
  videos?: RawVideo[];
  links: RawLink[];
  listItems: string[];
  statValue: string | null;
  layout: {
    columnCount: number;
    columnIndex: number;
    imagePosition: "left" | "right" | "none" | "full" | null;
    sectionClasses: string[];
    isFullWidth: boolean;
    reverseMobile: boolean;
  };
}

interface RawPage {
  id: number;
  slug: string;
  canonicalSlug: string;
  locale: string;
  title: string;
  link: string;
  pageKind: string;
  translations: Record<string, number>;
  excerpt: string | null;
  seo: { title: string | null; description: string | null };
  modified: string | null;
  blocks: RawBlock[];
}

// ---------------------------------------------------------------------------
// Merged output types
// ---------------------------------------------------------------------------

type BlockType =
  | "hero"
  | "heading"
  | "richText"
  | "image"
  | "imageTextRow"
  | "featureCard"
  | "featureCardGrid"
  | "statCounter"
  | "statGrid"
  | "iconList"
  | "ctaButton"
  | "dualCta"
  | "videoEmbed"
  | "logoGrid"
  | "teamMember"
  | "testimonial"
  | "faqAccordion"
  | "timeline"
  | "formEmbed"
  | "gallery"
  | "mapEmbed"
  | "blogPosts"
  | "slides"
  | "socialIcons"
  | "spacer"
  | "unknown";

interface BlockTranslation {
  heading: string | null;
  body: string | null;
  bodyHtml: string | null;
  listItems: string[];
  links: RawLink[];
  ctaLabel: string | null;
  ctaUrl: string | null;
  imageAlts: string[];
}

interface MergedBlock {
  id: string;
  type: BlockType;
  order: number;
  sectionIndex: number;
  widgetType: string;
  layout: {
    imagePosition: "left" | "right" | "none" | "full" | null;
    columnCount: number;
    columnIndex: number;
    isFullWidth: boolean;
    reverseMobile: boolean;
    image: string | null;
  };
  images: Array<{
    src: string;
    width: number | null;
    height: number | null;
  }>;
  videos: RawVideo[];
  statValue: string | null;
  translations: Partial<Record<Locale, BlockTranslation>>;
}

interface MergedPage {
  slug: string;
  pageKind: string;
  titles: Partial<Record<Locale, string>>;
  seo: Partial<Record<Locale, { title: string | null; description: string | null }>>;
  links: Partial<Record<Locale, string>>;
  blocks: MergedBlock[];
}

interface MergeWarning {
  slug: string;
  locale: string;
  blockId?: string;
  order?: number;
  reason: string;
  detail?: string;
}

interface MergeReport {
  mergedAt: string;
  pageCount: number;
  blockCount: number;
  warnings: MergeWarning[];
  pages: Array<{
    slug: string;
    pageKind: string;
    locales: string[];
    blockCount: number;
    warningCount: number;
  }>;
}

// ---------------------------------------------------------------------------
// Widget → taxonomy type (widget-level; mirrors analyze-blocks.ts)
// ---------------------------------------------------------------------------

function baseWidget(widgetType: string): string {
  return widgetType.replace(/\.default$/, "").replace(/\..*$/, "");
}

function mapWidgetType(widgetType: string): BlockType {
  const w = baseWidget(widgetType);
  const direct: Record<string, BlockType> = {
    counter: "statCounter",
    "icon-list": "iconList",
    video: "videoEmbed",
    "eael-sticky-video": "videoEmbed",
    "eael-creative-button": "ctaButton",
    button: "ctaButton",
    "elementskit-dual-button": "dualCta",
    "eael-team-member": "teamMember",
    "elementskit-testimonial": "testimonial",
    "eael-adv-accordion": "faqAccordion",
    "elementskit-image-accordion": "faqAccordion",
    "eael-post-timeline": "timeline",
    "eael-feature-list": "iconList",
    "eael-fluentform": "formEmbed",
    "eael-filterable-gallery": "gallery",
    google_maps: "mapEmbed",
    "elementskit-blog-posts": "blogPosts",
    "eael-post-grid": "blogPosts",
    slides: "slides",
    "elementskit-client-logo": "logoGrid",
    "social-icons": "socialIcons",
    spacer: "spacer",
    shortcode: "unknown",
    "eael-login-register": "formEmbed",
    "eael-info-box": "featureCard",
    "icon-box": "featureCard",
    "elementskit-icon-box": "featureCard",
    heading: "heading",
    "elementskit-heading": "heading",
    "eael-dual-color-header": "heading",
    "text-editor": "richText",
    image: "image",
  };
  return direct[w] || "unknown";
}

function toTranslation(block: RawBlock): BlockTranslation {
  const primaryLink = block.links[0] || null;
  return {
    heading: block.heading,
    body: block.bodyText,
    bodyHtml: block.bodyHtml,
    listItems: block.listItems,
    links: block.links,
    ctaLabel: primaryLink?.label || null,
    ctaUrl: primaryLink?.href || null,
    imageAlts: block.images.map((img) => img.alt || ""),
  };
}

function translationIsEmpty(t: BlockTranslation): boolean {
  return (
    !t.heading &&
    !t.body &&
    !t.bodyHtml &&
    t.listItems.length === 0 &&
    t.links.length === 0 &&
    !t.ctaLabel &&
    t.imageAlts.every((a) => !a)
  );
}


// ---------------------------------------------------------------------------
// Load raw pages grouped by canonical slug
// ---------------------------------------------------------------------------

function loadRawBySlug(): Map<string, Map<Locale, RawPage>> {
  const bySlug = new Map<string, Map<Locale, RawPage>>();

  for (const locale of LOCALES) {
    const dir = path.join(RAW_DIR, locale);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const page = JSON.parse(
        fs.readFileSync(path.join(dir, file), "utf8"),
      ) as RawPage;
      const slug = page.canonicalSlug || file.replace(/\.json$/, "");
      if (!bySlug.has(slug)) bySlug.set(slug, new Map());
      bySlug.get(slug)!.set(locale, page);
    }
  }
  return bySlug;
}

function pickReferenceLocale(locales: Map<Locale, RawPage>): Locale {
  if (locales.has("en")) return "en";
  let best: Locale = [...locales.keys()][0];
  let bestLen = -1;
  for (const [loc, page] of locales) {
    if (page.blocks.length > bestLen) {
      best = loc;
      bestLen = page.blocks.length;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Merge one slug
// ---------------------------------------------------------------------------

function mergeSlug(
  slug: string,
  locales: Map<Locale, RawPage>,
  warnings: MergeWarning[],
): MergedPage {
  const refLocale = pickReferenceLocale(locales);
  const refPage = locales.get(refLocale)!;
  const presentLocales = [...locales.keys()].sort();

  // Length mismatches
  for (const [loc, page] of locales) {
    if (loc === refLocale) continue;
    if (page.blocks.length !== refPage.blocks.length) {
      warnings.push({
        slug,
        locale: loc,
        reason: "block_count_mismatch",
        detail: `${loc}=${page.blocks.length} vs ${refLocale}=${refPage.blocks.length}`,
      });
    }
  }

  const blocks: MergedBlock[] = refPage.blocks.map((refBlock, index) => {
    const type = mapWidgetType(refBlock.widgetType);
    const translations: Partial<Record<Locale, BlockTranslation>> = {};

    for (const [loc, page] of locales) {
      const candidate = page.blocks[index];
      if (!candidate) {
        warnings.push({
          slug,
          locale: loc,
          blockId: refBlock.id,
          order: index,
          reason: "missing_block",
          detail: `no block at order ${index} (ref widgetType=${refBlock.widgetType})`,
        });
        continue;
      }
      if (candidate.widgetType !== refBlock.widgetType) {
        warnings.push({
          slug,
          locale: loc,
          blockId: refBlock.id,
          order: index,
          reason: "widget_type_mismatch",
          detail: `${loc}=${candidate.widgetType} vs ${refLocale}=${refBlock.widgetType}`,
        });
        continue;
      }
      const t = toTranslation(candidate);
      // Always include matching locales even if empty (spacer etc.) — but skip
      // truly empty rich content on non-spacer only when everything is null?
      // Plan: include all matching locales. Include even empty for structural parity.
      if (translationIsEmpty(t) && type !== "spacer" && type !== "unknown") {
        // Still include — empty body on an image block is normal
      }
      translations[loc] = t;
    }


    // Prefer media from ref; fall back to first locale that has media if ref is empty
    let images = refBlock.images.map(({ src, width, height }) => ({
      src,
      width,
      height,
    }));
    let videos = [...(refBlock.videos || [])];
    let statValue = refBlock.statValue;

    if (images.length === 0) {
      for (const [loc, page] of locales) {
        const b = page.blocks[index];
        if (b?.widgetType === refBlock.widgetType && b.images.length > 0) {
          images = b.images.map(({ src, width, height }) => ({
            src,
            width,
            height,
          }));
          // copy alts into that locale if missing
          if (translations[loc]) {
            translations[loc]!.imageAlts = b.images.map((i) => i.alt || "");
          }
          break;
        }
      }
    }
    if (videos.length === 0) {
      for (const [, page] of locales) {
        const b = page.blocks[index];
        if (b?.widgetType === refBlock.widgetType && (b.videos?.length || 0) > 0) {
          videos = [...(b.videos || [])];
          break;
        }
      }
    }
    if (!statValue) {
      for (const [, page] of locales) {
        const b = page.blocks[index];
        if (b?.widgetType === refBlock.widgetType && b.statValue) {
          statValue = b.statValue;
          break;
        }
      }
    }

    return {
      id: refBlock.id,
      type,
      order: index,
      sectionIndex: refBlock.sectionIndex,
      widgetType: refBlock.widgetType,
      layout: {
        imagePosition: refBlock.layout.imagePosition,
        columnCount: refBlock.layout.columnCount,
        columnIndex: refBlock.layout.columnIndex,
        isFullWidth: refBlock.layout.isFullWidth,
        reverseMobile: refBlock.layout.reverseMobile,
        image: images[0]?.src || videos[0]?.poster || null,
      },
      images,
      videos,
      statValue,
      translations,
    };
  });

  // Warn about trailing extra blocks in non-ref locales
  for (const [loc, page] of locales) {
    if (loc === refLocale) continue;
    if (page.blocks.length > refPage.blocks.length) {
      warnings.push({
        slug,
        locale: loc,
        reason: "extra_blocks",
        detail: `${page.blocks.length - refPage.blocks.length} trailing block(s) ignored`,
      });
    }
  }

  const titles: MergedPage["titles"] = {};
  const seo: MergedPage["seo"] = {};
  const links: MergedPage["links"] = {};
  for (const [loc, page] of locales) {
    titles[loc] = page.title;
    seo[loc] = page.seo;
    links[loc] = page.link;
  }

  return {
    slug,
    pageKind: refPage.pageKind,
    titles,
    seo,
    links,
    blocks,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("=== Merge raw locales → data/pages ===\n");

  if (!fs.existsSync(RAW_DIR)) {
    console.error(`Missing ${RAW_DIR}. Run npm run extract:legacy first.`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  // Clear previous page JSON (keep nothing stale)
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.endsWith(".json")) fs.unlinkSync(path.join(OUT_DIR, f));
  }

  const bySlug = loadRawBySlug();
  const warnings: MergeWarning[] = [];
  const pageSummaries: MergeReport["pages"] = [];
  let blockCount = 0;

  const slugs = [...bySlug.keys()].sort();
  for (const slug of slugs) {
    const locales = bySlug.get(slug)!;
    const merged = mergeSlug(slug, locales, warnings);
    const pageWarnings = warnings.filter((w) => w.slug === slug);
    blockCount += merged.blocks.length;

    const outPath = path.join(OUT_DIR, `${slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(merged, null, 2));
    pageSummaries.push({
      slug,
      pageKind: merged.pageKind,
      locales: [...locales.keys()].sort(),
      blockCount: merged.blocks.length,
      warningCount: pageWarnings.length,
    });
    console.log(
      `  ✓ ${slug} (${merged.blocks.length} blocks, ${locales.size} locales, ${pageWarnings.length} warnings)`,
    );
  }

  const report: MergeReport = {
    mergedAt: new Date().toISOString(),
    pageCount: slugs.length,
    blockCount,
    warnings,
    pages: pageSummaries,
  };
  fs.writeFileSync(
    path.join(OUT_DIR, "_merge-report.json"),
    JSON.stringify(report, null, 2),
  );

  console.log("\n=== Done ===");
  console.log(`Pages: ${slugs.length}`);
  console.log(`Blocks: ${blockCount}`);
  console.log(`Warnings: ${warnings.length}`);
  const byReason = new Map<string, number>();
  for (const w of warnings) {
    byReason.set(w.reason, (byReason.get(w.reason) || 0) + 1);
  }
  for (const [r, n] of [...byReason.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${n}  ${r}`);
  }
  console.log(`Report: ${path.join(OUT_DIR, "_merge-report.json")}`);
}

main();

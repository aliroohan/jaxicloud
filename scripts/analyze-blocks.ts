/**
 * Step 2 — Analyze raw extracted blocks and propose an empirical block taxonomy.
 *
 * Usage: npm run analyze:blocks
 *
 * Reads:  front/data/raw/{locale}/*.json
 * Writes: front/data/raw/_widget-stats.json
 *         front/docs/block-taxonomy.md
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(ROOT, "data", "raw");
const DOCS_DIR = path.join(ROOT, "docs");
const LOCALES = ["da", "en", "de", "fr", "nl", "nb", "sv", "tr"];

// ---------------------------------------------------------------------------
// Types (mirror extract-legacy output)
// ---------------------------------------------------------------------------

interface WpImage {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
}

interface WpLink {
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
  images: WpImage[];
  videos?: Array<{
    src: string;
    provider: string;
    poster: string | null;
    lightbox: boolean;
  }>;
  links: WpLink[];
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
  blocks: RawBlock[];
  meta: { widgetCount: number; sectionCount: number; htmlBytes: number };
}

type ProposedType =
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

interface TaxonomyEntry {
  type: ProposedType;
  description: string;
  sourceWidgets: string[];
  occurrenceCount: number;
  pages: string[];
  example: Record<string, unknown> | null;
  openQuestions: string[];
}

// ---------------------------------------------------------------------------
// Load all raw pages (prefer EN for taxonomy examples, count all locales)
// ---------------------------------------------------------------------------

function loadRawPages(): RawPage[] {
  const pages: RawPage[] = [];
  for (const locale of LOCALES) {
    const dir = path.join(RAW_DIR, locale);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const raw = JSON.parse(
        fs.readFileSync(path.join(dir, file), "utf8"),
      ) as RawPage;
      pages.push(raw);
    }
  }
  return pages;
}

function baseWidget(widgetType: string): string {
  return widgetType.replace(/\.default$/, "").replace(/\..*$/, "");
}

// ---------------------------------------------------------------------------
// Section-aware grouping for semantic candidates
// ---------------------------------------------------------------------------

interface SectionGroup {
  pageKey: string;
  locale: string;
  canonicalSlug: string;
  pageKind: string;
  sectionIndex: number;
  blocks: RawBlock[];
}

function groupBySection(pages: RawPage[]): SectionGroup[] {
  const groups: SectionGroup[] = [];
  for (const page of pages) {
    const bySection = new Map<number, RawBlock[]>();
    for (const b of page.blocks) {
      const list = bySection.get(b.sectionIndex) || [];
      list.push(b);
      bySection.set(b.sectionIndex, list);
    }
    for (const [sectionIndex, blocks] of bySection) {
      groups.push({
        pageKey: `${page.locale}/${page.canonicalSlug}`,
        locale: page.locale,
        canonicalSlug: page.canonicalSlug,
        pageKind: page.pageKind,
        sectionIndex,
        blocks: blocks.sort((a, b) => a.order - b.order),
      });
    }
  }
  return groups;
}

/**
 * Propose a semantic type for a single widget, optionally using section context.
 * Taxonomy naming happens HERE (Step 2), not in extraction.
 */
function proposeTypeForWidget(
  block: RawBlock,
  sectionBlocks: RawBlock[],
): ProposedType {
  const w = baseWidget(block.widgetType);

  // Direct widget → type mappings (always observed as these widgets)
  const direct: Record<string, ProposedType> = {
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
  };

  if (direct[w]) return direct[w];

  // Info / icon boxes → feature cards
  if (
    w === "eael-info-box" ||
    w === "icon-box" ||
    w === "elementskit-icon-box"
  ) {
    return "featureCard";
  }

  // Headings
  if (
    w === "heading" ||
    w === "elementskit-heading" ||
    w === "eael-dual-color-header"
  ) {
    // First section + has links nearby → hero candidate handled at section level;
    // at widget level still "heading"
    return "heading";
  }

  // Text
  if (w === "text-editor") return "richText";

  // Image — may be part of imageTextRow at section level
  if (w === "image") return "image";

  return "unknown";
}

/**
 * Propose section-level composite types when widgets co-occur.
 */
function proposeSectionComposites(section: SectionGroup): Array<{
  type: ProposedType;
  blocks: RawBlock[];
  reason: string;
}> {
  const composites: Array<{
    type: ProposedType;
    blocks: RawBlock[];
    reason: string;
  }> = [];

  const bases = section.blocks.map((b) => baseWidget(b.widgetType));
  const counts = new Map<string, number>();
  for (const b of bases) counts.set(b, (counts.get(b) || 0) + 1);

  const has = (w: string) => (counts.get(w) || 0) > 0;
  const count = (w: string) => counts.get(w) || 0;

  // statGrid: 2+ counters in same section
  if (count("counter") >= 2) {
    composites.push({
      type: "statGrid",
      blocks: section.blocks.filter((b) => baseWidget(b.widgetType) === "counter"),
      reason: `${count("counter")} counter widgets in section ${section.sectionIndex}`,
    });
  }

  // featureCardGrid: 2+ info/icon boxes
  const cardWidgets = section.blocks.filter((b) =>
    ["eael-info-box", "icon-box", "elementskit-icon-box"].includes(
      baseWidget(b.widgetType),
    ),
  );
  if (cardWidgets.length >= 2) {
    composites.push({
      type: "featureCardGrid",
      blocks: cardWidgets,
      reason: `${cardWidgets.length} info/icon-box widgets in section ${section.sectionIndex}`,
    });
  }

  // imageTextRow: image + (heading|text) in a 2-col section
  const images = section.blocks.filter((b) => baseWidget(b.widgetType) === "image");
  const texts = section.blocks.filter((b) =>
    ["heading", "text-editor", "elementskit-heading", "eael-dual-color-header"].includes(
      baseWidget(b.widgetType),
    ),
  );
  const colCount = Math.max(
    ...section.blocks.map((b) => b.layout.columnCount),
    1,
  );
  if (images.length >= 1 && texts.length >= 1 && colCount >= 2) {
    composites.push({
      type: "imageTextRow",
      blocks: [...images, ...texts],
      reason: `image + text in ${colCount}-column section`,
    });
  }

  // hero: section 0 with heading + (image|video|button) on solution/marketing pages
  if (section.sectionIndex === 0) {
    const hasHeading = section.blocks.some((b) =>
      ["heading", "elementskit-heading", "eael-dual-color-header"].includes(
        baseWidget(b.widgetType),
      ),
    );
    const hasMediaOrCta = section.blocks.some((b) =>
      ["image", "video", "eael-creative-button", "button", "slides"].includes(
        baseWidget(b.widgetType),
      ),
    );
    if (hasHeading && (hasMediaOrCta || section.blocks.length >= 2)) {
      composites.push({
        type: "hero",
        blocks: section.blocks,
        reason: "first section with heading + media/CTA",
      });
    } else if (hasHeading && section.blocks.length === 1) {
      // Solo heading in first section still often acts as hero title band
      composites.push({
        type: "hero",
        blocks: section.blocks,
        reason: "first-section heading band",
      });
    }
  }

  // logoGrid already mapped from elementskit-client-logo; if multiple images-only section
  if (
    !has("elementskit-client-logo") &&
    count("image") >= 3 &&
    texts.length === 0 &&
    cardWidgets.length === 0
  ) {
    composites.push({
      type: "logoGrid",
      blocks: images,
      reason: `${count("image")} images with no text — likely logo strip`,
    });
  }

  return composites;
}

// ---------------------------------------------------------------------------
// Build taxonomy
// ---------------------------------------------------------------------------

function buildTaxonomy(pages: RawPage[]): {
  widgetStats: Record<string, number>;
  widgetByPageKind: Record<string, Record<string, number>>;
  taxonomy: TaxonomyEntry[];
  compositeStats: Record<string, { count: number; pages: Set<string> }>;
  enExamples: Map<ProposedType, { page: RawPage; block: RawBlock; extra?: Record<string, unknown> }>;
} {
  const widgetStats: Record<string, number> = {};
  const widgetByPageKind: Record<string, Record<string, number>> = {};
  const typeCounts = new Map<
    ProposedType,
    { count: number; pages: Set<string>; widgets: Set<string> }
  >();
  const compositeStats: Record<string, { count: number; pages: Set<string> }> = {};
  const enExamples = new Map<
    ProposedType,
    { page: RawPage; block: RawBlock; extra?: Record<string, unknown> }
  >();

  function bumpType(
    type: ProposedType,
    pageKey: string,
    widgetType: string,
  ) {
    const entry = typeCounts.get(type) || {
      count: 0,
      pages: new Set<string>(),
      widgets: new Set<string>(),
    };
    entry.count += 1;
    entry.pages.add(pageKey);
    entry.widgets.add(widgetType);
    typeCounts.set(type, entry);
  }

  // Widget-level counts (all locales)
  for (const page of pages) {
    const pageKey = `${page.locale}/${page.canonicalSlug}`;
    for (const block of page.blocks) {
      const wt = block.widgetType;
      widgetStats[wt] = (widgetStats[wt] || 0) + 1;
      if (!widgetByPageKind[page.pageKind]) widgetByPageKind[page.pageKind] = {};
      widgetByPageKind[page.pageKind][wt] =
        (widgetByPageKind[page.pageKind][wt] || 0) + 1;

      const proposed = proposeTypeForWidget(block, page.blocks);
      bumpType(proposed, pageKey, wt);

      // Keep EN examples
      if (page.locale === "en" && !enExamples.has(proposed)) {
        enExamples.set(proposed, { page, block });
      }
    }
  }

  // Section composites (EN only for cleaner page lists; count all locales)
  const sections = groupBySection(pages);
  for (const section of sections) {
    const composites = proposeSectionComposites(section);
    for (const c of composites) {
      if (!compositeStats[c.type]) {
        compositeStats[c.type] = { count: 0, pages: new Set() };
      }
      compositeStats[c.type].count += 1;
      compositeStats[c.type].pages.add(section.pageKey);

      // Also register composite as a taxonomy type with occurrence
      bumpType(c.type, section.pageKey, c.blocks.map((b) => b.widgetType).join("+"));

      if (
        section.locale === "en" &&
        !enExamples.has(c.type) &&
        c.blocks.length > 0
      ) {
        enExamples.set(c.type, {
          page: pages.find(
            (p) =>
              p.locale === section.locale &&
              p.canonicalSlug === section.canonicalSlug,
          )!,
          block: c.blocks[0],
          extra: {
            _composite: true,
            _reason: c.reason,
            _memberBlockIds: c.blocks.map((b) => b.id),
            _memberWidgetTypes: c.blocks.map((b) => b.widgetType),
          },
        });
      }
    }
  }

  // Build taxonomy entries — only types with count > 0
  const descriptions: Record<ProposedType, string> = {
    hero: "Opening band of a page — typically the first section with a heading plus optional image, video, or CTA.",
    heading: "Standalone title/subtitle widget (Elementor heading / ElementsKit heading / dual-color header).",
    richText: "Body copy from a text-editor widget.",
    image: "Standalone image widget (may later fold into imageTextRow).",
    imageTextRow: "Two-column section pairing an image with heading and/or body text.",
    featureCard: "Single info/icon box with title, text, optional icon/image and link.",
    featureCardGrid: "Section containing 2+ feature cards side by side.",
    statCounter: "Single animated/static number counter with optional label.",
    statGrid: "Section containing 2+ counters.",
    iconList: "Bullet/icon list (icon-list or eael-feature-list).",
    ctaButton: "Single call-to-action button (creative-button or native button).",
    dualCta: "Paired primary/secondary CTA buttons (ElementsKit dual button).",
    videoEmbed: "Embedded video player (Elementor video or sticky video).",
    logoGrid: "Client/partner logo strip (ElementsKit client logos, or image-only multi-image sections).",
    teamMember: "Team member card (EAEL team member).",
    testimonial: "Testimonial / quote card (ElementsKit testimonial).",
    faqAccordion: "Accordion / FAQ (EAEL accordion or ElementsKit image accordion).",
    timeline: "Vertical/horizontal timeline (EAEL post timeline).",
    formEmbed: "Embedded form (Fluent Forms / login-register).",
    gallery: "Filterable image gallery.",
    mapEmbed: "Google Maps embed.",
    blogPosts: "Blog/post grid or listing widget.",
    slides: "Carousel / slider.",
    socialIcons: "Social media icon links.",
    spacer: "Vertical spacing widget with no content.",
    unknown: "Widget type observed but not yet mapped to a semantic block.",
  };

  const openQuestions: Partial<Record<ProposedType, string[]>> = {
    hero: [
      "Should a first-section heading-only band count as hero, or stay as heading?",
      "Homepage heroes are outliers (1.5MB markup) — may need a dedicated homepage type later.",
    ],
    imageTextRow: [
      "Should heading+text+image merge into one block at merge time, or stay as sibling widgets with a section wrapper?",
    ],
    featureCardGrid: [
      "Prefer one featureCardGrid block vs N featureCard children under a section?",
    ],
    logoGrid: [
      "Image-only multi-image heuristic may false-positive on photo galleries — verify against elementskit-client-logo pages.",
    ],
    unknown: [
      "shortcode widgets need manual inspection to see what they render.",
    ],
  };

  const taxonomy: TaxonomyEntry[] = [];
  for (const [type, data] of [...typeCounts.entries()].sort(
    (a, b) => b[1].count - a[1].count,
  )) {
    if (data.count === 0) continue;
    const exampleSrc = enExamples.get(type);
    let example: Record<string, unknown> | null = null;
    if (exampleSrc) {
      example = {
        id: exampleSrc.block.id,
        // Proposed type (not in raw — preview of Step 3 shape)
        type,
        order: exampleSrc.block.order,
        layout: {
          imagePosition: exampleSrc.block.layout.imagePosition,
          columnCount: exampleSrc.block.layout.columnCount,
          columnIndex: exampleSrc.block.layout.columnIndex,
          isFullWidth: exampleSrc.block.layout.isFullWidth,
          reverseMobile: exampleSrc.block.layout.reverseMobile,
          image: exampleSrc.block.images[0]?.src || null,
        },
        // Non-translatable
        images: exampleSrc.block.images,
        videos: exampleSrc.block.videos || [],
        links: exampleSrc.block.links.map((l) => ({
          ...l,
          // label is translatable — shown here for context
        })),
        listItems: exampleSrc.block.listItems,
        statValue: exampleSrc.block.statValue,
        // Source provenance
        _source: {
          widgetType: exampleSrc.block.widgetType,
          page: `${exampleSrc.page.locale}/${exampleSrc.page.canonicalSlug}`,
          pageUrl: exampleSrc.page.link,
          elementorId: exampleSrc.block.elementorId,
        },
        // Preview of translations shape (EN only for the example)
        translations: {
          en: {
            heading: exampleSrc.block.heading,
            body: exampleSrc.block.bodyText,
            bodyHtml: exampleSrc.block.bodyHtml,
            ctaLabel: exampleSrc.block.links[0]?.label || null,
            ctaUrl: exampleSrc.block.links[0]?.href || null,
          },
        },
        ...(exampleSrc.extra || {}),
      };
    }

    taxonomy.push({
      type,
      description: descriptions[type],
      sourceWidgets: [...data.widgets].sort(),
      occurrenceCount: data.count,
      pages: [...data.pages].sort().slice(0, 40), // cap list length
      example,
      openQuestions: openQuestions[type] || [],
    });
  }

  return { widgetStats, widgetByPageKind, taxonomy, compositeStats, enExamples };
}

// ---------------------------------------------------------------------------
// Markdown emitter
// ---------------------------------------------------------------------------

function emitMarkdown(
  taxonomy: TaxonomyEntry[],
  widgetStats: Record<string, number>,
  compositeStats: Record<string, { count: number; pages: Set<string> }>,
  pageCount: number,
  enPageCount: number,
): string {
  const lines: string[] = [];
  lines.push("# Block Taxonomy (derived from legacy scrape)");
  lines.push("");
  lines.push(
    `> Auto-generated by \`scripts/analyze-blocks.ts\` on ${new Date().toISOString()}.`,
  );
  lines.push(
    `> Based on **${pageCount}** raw page files (${enPageCount} English). Only types **actually observed** in the data are listed — nothing speculative.`,
  );
  lines.push("");
  lines.push("## How to read this");
  lines.push("");
  lines.push(
    "- **Widget-level types** map 1:1 (or N:1) from Elementor `data-widget_type` values.",
  );
  lines.push(
    "- **Composite types** (`hero`, `imageTextRow`, `featureCardGrid`, `statGrid`, …) are proposed from section co-occurrence patterns. They are candidates for how Step 3 should merge sibling widgets — open questions call out ambiguity.",
  );
  lines.push(
    "- Example payloads preview the Step 3 shape (`type`, `layout`, `translations`) but are lifted from real scraped blocks.",
  );
  lines.push("");
  lines.push("## Raw Elementor widget frequency (all locales)");
  lines.push("");
  lines.push("| Count | Widget type |");
  lines.push("|------:|-------------|");
  for (const [wt, n] of Object.entries(widgetStats).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${n} | \`${wt}\` |`);
  }
  lines.push("");
  lines.push("## Composite section patterns (observed)");
  lines.push("");
  lines.push("| Count | Pages (sample) | Composite type |");
  lines.push("|------:|----------------|----------------|");
  for (const [type, data] of Object.entries(compositeStats).sort(
    (a, b) => b[1].count - a[1].count,
  )) {
    const sample = [...data.pages].slice(0, 5).join(", ");
    lines.push(`| ${data.count} | ${sample} | \`${type}\` |`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Proposed block types");
  lines.push("");

  for (const entry of taxonomy) {
    lines.push(`### \`${entry.type}\``);
    lines.push("");
    lines.push(entry.description);
    lines.push("");
    lines.push(`- **Occurrences:** ${entry.occurrenceCount}`);
    lines.push(
      `- **Source widgets:** ${entry.sourceWidgets.map((w) => `\`${w}\``).join(", ") || "_composite_"}`,
    );
    lines.push(
      `- **Seen on (sample):** ${entry.pages.slice(0, 12).join(", ")}${entry.pages.length > 12 ? `, … (+${entry.pages.length - 12})` : ""}`,
    );
    if (entry.openQuestions.length) {
      lines.push(`- **Open questions:**`);
      for (const q of entry.openQuestions) lines.push(`  - ${q}`);
    }
    lines.push("");
    if (entry.example) {
      lines.push("**Example payload (from scraped data):**");
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(entry.example, null, 2));
      lines.push("```");
      lines.push("");
    } else {
      lines.push("_No English example available (type only seen in other locales)._");
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("");
  lines.push("## Next step");
  lines.push("");
  lines.push(
    "Review this taxonomy and the raw JSON under `data/raw/`. Once approved, Step 3 will merge per-locale raw files into `data/pages/{slug}.json` using these type names, and Step 4 will generate the Zod discriminated union + `BlockRenderer`.",
  );
  lines.push("");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("=== Analyze blocks → taxonomy ===\n");

  if (!fs.existsSync(RAW_DIR)) {
    console.error(`No raw data at ${RAW_DIR}. Run npm run extract:legacy first.`);
    process.exit(1);
  }

  const pages = loadRawPages();
  console.log(`Loaded ${pages.length} raw pages`);
  const enPages = pages.filter((p) => p.locale === "en");
  console.log(`  English: ${enPages.length}`);

  const { widgetStats, widgetByPageKind, taxonomy, compositeStats } =
    buildTaxonomy(pages);

  // Write widget stats
  const statsPath = path.join(RAW_DIR, "_widget-stats.json");
  const statsOut = {
    generatedAt: new Date().toISOString(),
    pageCount: pages.length,
    enPageCount: enPages.length,
    widgetFrequency: widgetStats,
    widgetByPageKind,
    compositeFrequency: Object.fromEntries(
      Object.entries(compositeStats).map(([k, v]) => [
        k,
        { count: v.count, pageCount: v.pages.size, pages: [...v.pages].sort() },
      ]),
    ),
    proposedTypes: taxonomy.map((t) => ({
      type: t.type,
      occurrenceCount: t.occurrenceCount,
      sourceWidgets: t.sourceWidgets,
      pageCount: t.pages.length,
    })),
  };
  fs.writeFileSync(statsPath, JSON.stringify(statsOut, null, 2));
  console.log(`Wrote ${statsPath}`);

  // Write taxonomy markdown
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  const md = emitMarkdown(
    taxonomy,
    widgetStats,
    compositeStats,
    pages.length,
    enPages.length,
  );
  const mdPath = path.join(DOCS_DIR, "block-taxonomy.md");
  fs.writeFileSync(mdPath, md);
  console.log(`Wrote ${mdPath}`);
  console.log(`\nProposed ${taxonomy.length} block types:`);
  for (const t of taxonomy) {
    console.log(`  ${t.occurrenceCount.toString().padStart(5)}  ${t.type}`);
  }
}

main();

/**
 * Step 1 — Extract legacy WordPress/Elementor pages into unclassified block JSON.
 *
 * Usage: npm run extract:legacy
 *
 * Writes:
 *   front/data/raw/{locale}/{canonicalSlug}.json
 *   front/data/raw/_report.json
 */

import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data", "raw");

const BASE = "https://www.jaxicloud.com";
const LOCALES = ["da", "en", "de", "fr", "nl", "nb", "sv", "tr"] as const;
type Locale = (typeof LOCALES)[number];

const CONCURRENCY = 3;
const DELAY_MS = 150;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PageKind = "solution" | "marketing" | "legal" | "blog" | "system";

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

interface WpVideo {
  src: string;
  provider: "hosted" | "youtube" | "vimeo" | "unknown";
  poster: string | null;
  lightbox: boolean;
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
  videos: WpVideo[];
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
  pageKind: PageKind;
  translations: Record<string, number>;
  excerpt: string | null;
  seo: {
    title: string | null;
    description: string | null;
  };
  modified: string | null;
  blocks: RawBlock[];
  meta: {
    widgetCount: number;
    sectionCount: number;
    htmlBytes: number;
  };
}

interface WpPage {
  id: number;
  slug: string;
  title: { rendered: string };
  link: string;
  lang?: string;
  translations?: Record<string, number>;
  content: { rendered: string };
  excerpt: { rendered: string };
  yoast_head_json?: {
    title?: string;
    description?: string;
  };
  date?: string;
  modified?: string;
}

interface Failure {
  pageId: number | null;
  url: string | null;
  locale: string | null;
  slug: string | null;
  error: string;
}

interface Report {
  extractedAt: string;
  totalRestPages: number;
  totalSitemapUrls: number;
  written: number;
  failures: Failure[];
  sitemapOnly: string[];
  restOnly: string[];
  incompleteGroups: Array<{
    canonicalSlug: string;
    present: string[];
    missing: string[];
  }>;
  outliers: Array<{
    canonicalSlug: string;
    locale: string;
    htmlBytes: number;
    reason: string;
  }>;
  pageKindCounts: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "JaxiCloud-LegacyExtractor/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchJson<T>(url: string): Promise<{ data: T; headers: Headers }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "JaxiCloud-LegacyExtractor/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function cleanText(text: string | null | undefined): string {
  if (!text) return "";
  return decodeHtmlEntities(text).replace(/\s+/g, " ").trim();
}

function classList(el: Element | null | undefined): string[] {
  if (!el?.attribs?.class) return [];
  return el.attribs.class.split(/\s+/).filter(Boolean);
}

function hasClass(el: Element, name: string): boolean {
  return classList(el).includes(name);
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

async function fetchSitemapUrls(): Promise<string[]> {
  const urls = new Set<string>();
  const indexXml = await fetchText(`${BASE}/sitemap_index.xml`);
  const childLocs = [...indexXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  for (const child of childLocs) {
    try {
      const xml = await fetchText(child);
      for (const m of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
        urls.add(m[1]);
      }
    } catch (err) {
      console.warn(`Failed to fetch sitemap child ${child}:`, (err as Error).message);
    }
  }
  return [...urls];
}

// ---------------------------------------------------------------------------
// WP REST pagination
// ---------------------------------------------------------------------------

async function fetchAllPages(): Promise<WpPage[]> {
  const pages: WpPage[] = [];
  let page = 1;
  let totalPages = 1;

  const fields =
    "id,slug,title,link,lang,translations,content,excerpt,yoast_head_json,date,modified";

  while (page <= totalPages) {
    const url = `${BASE}/wp-json/wp/v2/pages?per_page=100&page=${page}&_fields=${fields}`;
    console.log(`Fetching REST page ${page}/${totalPages}…`);
    const { data, headers } = await fetchJson<WpPage[]>(url);
    pages.push(...data);

    const totalHeader = headers.get("x-wp-totalpages");
    if (totalHeader) totalPages = Number(totalHeader);
    page += 1;
    await sleep(DELAY_MS);
  }

  return pages;
}

// ---------------------------------------------------------------------------
// Canonical slug + page kind
// ---------------------------------------------------------------------------

const LOCALE_SUFFIXES: Array<{ locale: Locale; patterns: RegExp[] }> = [
  { locale: "da", patterns: [/-da$/] },
  { locale: "de", patterns: [/-de$/] },
  { locale: "fr", patterns: [/-fr$/] },
  { locale: "nl", patterns: [/-hl$/, /-nl$/] },
  { locale: "nb", patterns: [/-no$/, /-nb$/] },
  { locale: "sv", patterns: [/-sv$/] },
  { locale: "tr", patterns: [/-tur$/, /-tr$/] },
  { locale: "en", patterns: [/-en$/] },
];

function stripLocaleSuffix(slug: string): string {
  let s = slug;
  // Strip numeric duplicate suffixes like -2 after locale
  for (const { patterns } of LOCALE_SUFFIXES) {
    for (const p of patterns) {
      if (p.test(s)) {
        s = s.replace(p, "");
        break;
      }
    }
  }
  // Strip trailing -2 etc. (WordPress duplicate slug)
  s = s.replace(/-\d+$/, "");
  return s || slug;
}

function deriveCanonicalSlug(
  pagesById: Map<number, WpPage>,
  translationIds: Record<string, number>,
): string {
  const enId = translationIds.en;
  if (enId && pagesById.has(enId)) {
    return stripLocaleSuffix(pagesById.get(enId)!.slug);
  }
  const daId = translationIds.da;
  if (daId && pagesById.has(daId)) {
    return stripLocaleSuffix(pagesById.get(daId)!.slug);
  }
  // Fall back to any available page
  for (const id of Object.values(translationIds)) {
    const p = pagesById.get(id);
    if (p) return stripLocaleSuffix(p.slug);
  }
  return "unknown";
}

const SOLUTION_SLUGS = new Set([
  "dashcam",
  "dashcam-bus-truck",
  "nimbus",
  "tpms-solutions",
  "tpms-ebs-cooling-fuel-monitoring",
  "cooling-monitoring",
  "safe-start",
  "safe-start-en",
  "tacho-live",
  "click-connect",
  "hecterra-agriculture",
  "constractor",
  "lorry",
  "eco-drive",
  "fuel-management-system",
  "logistics-delivery-system",
  "logistics-delivery-system-2",
  "leasing-control",
  "fleetrun-fleet-volunteer",
  "e-drivers-book",
  "opening-detection-of-truck-side-panels",
  "registration-of-truck-door-opening",
  "temperature-monitoring-work",
  "geolocation-of-construction-tools",
  "transport-telematics",
  "wia-tag",
  "wia-tag-en",
  "jaxicloud-platform",
  "jaxicloud-platform-en",
]);

const LEGAL_SLUGS = new Set([
  "privacy-policy",
  "data-protection",
  "data-protection-strategy-for-jaxicloud-fleet-management",
  "jaxicloud-gdpr-cyber-compliance",
]);

const MARKETING_SLUGS = new Set([
  "home",
  "home-en",
  "homepage",
  "about-us",
  "contact",
  "contact-2",
  "services",
  "overview",
  "our-team",
  "applications",
  "faq",
  "product-video",
  "news",
  "event-list",
  "upcoming-events",
  "aom-os",
]);

function classifyPageKind(canonicalSlug: string, title: string): PageKind {
  const slug = canonicalSlug.toLowerCase();
  const t = title.toLowerCase();

  if (LEGAL_SLUGS.has(slug) || /privacy|gdpr|data-protection|cookie/.test(slug)) {
    return "legal";
  }
  if (
    MARKETING_SLUGS.has(slug) ||
    /^(home|about|contact|services|team|faq|news|event)/.test(slug)
  ) {
    return "marketing";
  }
  if (SOLUTION_SLUGS.has(slug) || /solution|monitor|telematics|dashcam|tpms|nimbus|tacho|fleet/.test(slug)) {
    return "solution";
  }
  if (/blog|post|article/.test(slug) || /blog|article/.test(t)) {
    return "blog";
  }
  // Default: if it looks like a product/feature page, treat as solution
  if (slug.includes("-") && !MARKETING_SLUGS.has(slug)) {
    return "solution";
  }
  return "system";
}

function inferLocale(page: WpPage): Locale | "unknown" {
  if (page.lang && LOCALES.includes(page.lang as Locale)) {
    return page.lang as Locale;
  }
  // Infer from URL path
  try {
    const u = new URL(page.link);
    const seg = u.pathname.split("/").filter(Boolean)[0];
    if (seg && LOCALES.includes(seg as Locale)) return seg as Locale;
    // Danish pages often have no locale prefix and end with -da
    if (/-da\/?$/.test(u.pathname) || page.slug.endsWith("-da")) return "da";
  } catch {
    /* ignore */
  }
  return "unknown";
}

// ---------------------------------------------------------------------------
// Elementor HTML walker
// ---------------------------------------------------------------------------

function isElement(node: AnyNode | null | undefined): node is Element {
  return !!node && node.type === "tag";
}

function extractImages($: cheerio.CheerioAPI, $el: cheerio.Cheerio<Element>): WpImage[] {
  const images: WpImage[] = [];
  $el.find("img").each((_, img) => {
    const $img = $(img);
    const src =
      $img.attr("data-src") ||
      $img.attr("data-lazy-src") ||
      $img.attr("src") ||
      "";
    if (!src || src.startsWith("data:")) return;
    const widthAttr = $img.attr("width");
    const heightAttr = $img.attr("height");
    images.push({
      src: src.startsWith("//") ? `https:${src}` : src,
      alt: cleanText($img.attr("alt") || ""),
      width: widthAttr ? Number(widthAttr) || null : null,
      height: heightAttr ? Number(heightAttr) || null : null,
    });
  });
  // Also pick up background images from style attrs on the widget itself
  const style = $el.attr("style") || "";
  const bgMatch = style.match(/url\(['"]?(https?:\/\/[^'")\s]+)/);
  if (bgMatch) {
    images.push({ src: bgMatch[1], alt: "", width: null, height: null });
  }
  return images;
}

function extractLinks($: cheerio.CheerioAPI, $el: cheerio.Cheerio<Element>): WpLink[] {
  const links: WpLink[] = [];
  const seen = new Set<string>();
  $el.find("a[href]").each((_, a) => {
    const $a = $(a);
    const href = ($a.attr("href") || "").trim();
    if (!href || href === "#" || href.startsWith("javascript:")) return;
    const label = cleanText($a.text());
    const key = `${href}::${label}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ label, href });
  });
  return links;
}

function normalizeMediaUrl(src: string): string {
  const s = src.trim();
  if (!s) return "";
  if (s.startsWith("//")) return `https:${s}`;
  return s;
}

function inferVideoProvider(src: string, hint?: string | null): WpVideo["provider"] {
  const h = (hint || "").toLowerCase();
  if (h === "youtube" || /youtube\.com|youtu\.be/.test(src)) return "youtube";
  if (h === "vimeo" || /vimeo\.com/.test(src)) return "vimeo";
  if (h === "hosted" || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(src) || /wixstatic\.com\/video/.test(src)) {
    return "hosted";
  }
  return "unknown";
}

function pushVideo(
  videos: WpVideo[],
  seen: Set<string>,
  src: string,
  opts: { provider?: string | null; poster?: string | null; lightbox?: boolean } = {},
) {
  const url = normalizeMediaUrl(src);
  if (!url || url.startsWith("data:")) return;
  if (seen.has(url)) return;
  seen.add(url);
  videos.push({
    src: url,
    provider: inferVideoProvider(url, opts.provider),
    poster: opts.poster ? normalizeMediaUrl(opts.poster) : null,
    lightbox: !!opts.lightbox,
  });
}

/**
 * Elementor videos store URLs in several places depending on mode:
 * - inline hosted: <video src="…"> / <source src="…">
 * - lightbox hosted: data-elementor-lightbox='{"url":"…"}'
 * - youtube/vimeo: data-settings youtube_url / vimeo_url, or iframe src
 */
function extractVideos($: cheerio.CheerioAPI, $el: cheerio.Cheerio<Element>): WpVideo[] {
  const videos: WpVideo[] = [];
  const seen = new Set<string>();

  // 1. Inline <video src> and <source src>
  $el.find("video").each((_, v) => {
    const $v = $(v);
    const poster = $v.attr("poster") || null;
    const src = $v.attr("src") || "";
    if (src) pushVideo(videos, seen, src, { provider: "hosted", poster });
    $v.find("source[src]").each((_, s) => {
      pushVideo(videos, seen, $(s).attr("src") || "", {
        provider: "hosted",
        poster,
      });
    });
  });

  // 2. Lightbox JSON on overlay / wrapper
  $el.find("[data-elementor-lightbox]").each((_, node) => {
    const raw = $(node).attr("data-elementor-lightbox") || "";
    try {
      const data = JSON.parse(raw) as {
        type?: string;
        videoType?: string;
        url?: string;
      };
      if (data.url) {
        pushVideo(videos, seen, data.url, {
          provider: data.videoType || null,
          lightbox: true,
        });
      }
    } catch {
      // Elementor sometimes double-encodes; try a loose url extract
      const m = raw.match(/"url"\s*:\s*"([^"]+)"/);
      if (m) {
        pushVideo(videos, seen, m[1].replace(/\\\//g, "/"), { lightbox: true });
      }
    }
  });

  // 3. data-settings on the widget root (youtube_url / vimeo_url / hosted_url)
  const settingsRaw = $el.attr("data-settings") || "";
  if (settingsRaw) {
    try {
      const settings = JSON.parse(settingsRaw) as Record<string, unknown>;
      const videoType =
        typeof settings.video_type === "string" ? settings.video_type : null;
      for (const key of ["hosted_url", "youtube_url", "vimeo_url", "external_url"]) {
        const val = settings[key];
        if (typeof val === "string" && val) {
          pushVideo(videos, seen, val, { provider: videoType || key.replace(/_url$/, "") });
        }
      }
      // overlay poster from settings
      const overlay = settings.image_overlay as { url?: string } | undefined;
      if (overlay?.url && videos.length > 0 && !videos[0].poster) {
        videos[0].poster = normalizeMediaUrl(overlay.url);
      }
    } catch {
      /* ignore malformed settings */
    }
  }

  // 4. iframe embeds (youtube/vimeo)
  $el.find("iframe[src]").each((_, iframe) => {
    const src = $(iframe).attr("src") || "";
    if (/youtube|youtu\.be|vimeo|player\./i.test(src)) {
      pushVideo(videos, seen, src, {
        provider: /vimeo/i.test(src) ? "vimeo" : "youtube",
      });
    }
  });

  // 5. EAEL sticky video / misc data-src attributes
  $el.find("[data-src], [data-video-url], [data-url]").each((_, node) => {
    const $n = $(node);
    const src =
      $n.attr("data-video-url") ||
      $n.attr("data-url") ||
      $n.attr("data-src") ||
      "";
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(src) || /youtube|vimeo|wixstatic\.com\/video/i.test(src)) {
      pushVideo(videos, seen, src);
    }
  });

  return videos;
}

function extractListItems($: cheerio.CheerioAPI, $el: cheerio.Cheerio<Element>): string[] {
  const items: string[] = [];
  $el.find("li").each((_, li) => {
    const text = cleanText($(li).text());
    if (text) items.push(text);
  });
  return items;
}

function extractHeading($: cheerio.CheerioAPI, $el: cheerio.Cheerio<Element>): string | null {
  // Prefer Elementor heading widgets / title classes
  const selectors = [
    ".elementor-heading-title",
    ".eael-infobox-title",
    ".elementskit-info-box-title",
    ".elementskit-section-title",
    ".eael-dual-header .title",
    ".eael-dual-header .second-title",
    ".elementor-icon-box-title",
    ".ekit-wid-con .elementskit-info-box-title",
    "h1, h2, h3, h4, h5, h6",
  ];
  for (const sel of selectors) {
    const $h = $el.find(sel).first();
    if ($h.length) {
      const t = cleanText($h.text());
      if (t) return t;
    }
  }
  return null;
}

function extractBody($: cheerio.CheerioAPI, $el: cheerio.Cheerio<Element>): {
  bodyHtml: string | null;
  bodyText: string | null;
} {
  const selectors = [
    ".elementor-text-editor",
    ".eael-infobox-text",
    ".elementskit-info-box-content",
    ".elementor-icon-box-description",
    ".elementor-widget-container > p",
    ".eael-creative-button-description",
  ];
  for (const sel of selectors) {
    const $b = $el.find(sel).first();
    if ($b.length) {
      const html = $b.html()?.trim() || null;
      const text = cleanText($b.text());
      if (html || text) return { bodyHtml: html, bodyText: text || null };
    }
  }
  // Fallback: collect paragraphs inside the widget, excluding headings
  const $clone = $el.clone();
  $clone.find("h1,h2,h3,h4,h5,h6,script,style,noscript").remove();
  const paras = $clone.find("p");
  if (paras.length) {
    const html = paras
      .map((_, p) => $.html(p))
      .get()
      .join("");
    const text = cleanText(paras.text());
    if (text) return { bodyHtml: html || null, bodyText: text };
  }
  return { bodyHtml: null, bodyText: null };
}

function extractStatValue($: cheerio.CheerioAPI, $el: cheerio.Cheerio<Element>): string | null {
  const selectors = [
    ".elementor-counter-number",
    ".elementor-counter-number-prefix",
    ".elementor-counter-number-suffix",
    ".eael-counter-number",
  ];
  // Prefer the number itself
  const $num = $el.find(".elementor-counter-number, .eael-counter-number").first();
  if ($num.length) {
    const prefix = cleanText($el.find(".elementor-counter-number-prefix").first().text());
    const num =
      $num.attr("data-to-value") ||
      $num.attr("data-target") ||
      cleanText($num.text());
    const suffix = cleanText($el.find(".elementor-counter-number-suffix").first().text());
    return `${prefix}${num}${suffix}` || null;
  }
  for (const sel of selectors) {
    const t = cleanText($el.find(sel).first().text());
    if (t) return t;
  }
  return null;
}

function inferImagePosition(
  columnIndex: number,
  columnCount: number,
  hasImage: boolean,
  sectionClasses: string[],
): "left" | "right" | "none" | "full" | null {
  if (!hasImage) return "none";
  if (columnCount <= 1) return "full";
  // Image in first column → left; last column → right
  if (columnIndex === 0) return "left";
  if (columnIndex === columnCount - 1) return "right";
  if (sectionClasses.includes("elementor-reverse-mobile")) {
    // Reverse often means image is visually on the opposite side on desktop
    return columnIndex === 0 ? "right" : "left";
  }
  return null;
}

function findAncestorSection($: cheerio.CheerioAPI, el: Element): Element | null {
  let cur: Element | null = el;
  while (cur) {
    const type = cur.attribs?.["data-element_type"];
    if (type === "section" || type === "container") {
      // Prefer top-level parent sections
      const classes = classList(cur);
      if (
        classes.includes("elementor-top-section") ||
        classes.includes("e-con-parent") ||
        classes.includes("e-parent")
      ) {
        return cur;
      }
    }
    const parent = cur.parent;
    cur = isElement(parent) ? parent : null;
  }
  // Fallback: nearest section/container
  cur = el;
  while (cur) {
    const type = cur.attribs?.["data-element_type"];
    if (type === "section" || type === "container") return cur;
    const parent = cur.parent;
    cur = isElement(parent) ? parent : null;
  }
  return null;
}

function findColumnContext(
  $: cheerio.CheerioAPI,
  el: Element,
): { columnIndex: number; columnCount: number; columnEl: Element | null } {
  let cur: Element | null = el;
  while (cur) {
    const type = cur.attribs?.["data-element_type"];
    if (type === "column" || (type === "container" && hasClass(cur, "e-child"))) {
      const parent = cur.parent;
      if (isElement(parent)) {
        const siblings = $(parent)
          .children()
          .toArray()
          .filter(
            (c) =>
              isElement(c) &&
              (c.attribs?.["data-element_type"] === "column" ||
                (c.attribs?.["data-element_type"] === "container" &&
                  hasClass(c, "e-child"))),
          ) as Element[];
        const idx = siblings.indexOf(cur);
        return {
          columnIndex: idx >= 0 ? idx : 0,
          columnCount: Math.max(siblings.length, 1),
          columnEl: cur,
        };
      }
    }
    const parent = cur.parent;
    cur = isElement(parent) ? parent : null;
  }
  return { columnIndex: 0, columnCount: 1, columnEl: null };
}

function parseElementorHtml(html: string): { blocks: RawBlock[]; sectionCount: number } {
  const $ = cheerio.load(html, { xml: false });

  // Collect top-level sections/containers for indexing
  const topSections = $(
    '.elementor > [data-element_type="section"], .elementor > [data-element_type="container"], [data-elementor-type] > [data-element_type="section"], [data-elementor-type] > [data-element_type="container"]',
  ).toArray() as Element[];

  // Fallback: any top-ish sections
  const sectionEls =
    topSections.length > 0
      ? topSections
      : ($('[data-element_type="section"].elementor-top-section, [data-element_type="container"].e-parent').toArray() as Element[]);

  const sectionIndexMap = new Map<Element, number>();
  sectionEls.forEach((el, i) => sectionIndexMap.set(el, i));

  const widgets = $(
    '[data-element_type="widget"][data-widget_type]',
  ).toArray() as Element[];

  const blocks: RawBlock[] = [];
  let order = 0;

  for (const widget of widgets) {
    const $w = $(widget);
    const widgetType = widget.attribs["data-widget_type"] || "unknown";
    // Skip pure spacers with no content value beyond layout
    // (still record them — taxonomy may want to know)

    const section = findAncestorSection($, widget);
    const sectionIndex = section ? (sectionIndexMap.get(section) ?? -1) : -1;
    // If not in map, try to find closest indexed ancestor
    let resolvedSectionIndex = sectionIndex;
    if (resolvedSectionIndex < 0 && section) {
      // Walk up to find an indexed top section
      let cur: Element | null = section;
      while (cur) {
        if (sectionIndexMap.has(cur)) {
          resolvedSectionIndex = sectionIndexMap.get(cur)!;
          break;
        }
        const parent = cur.parent;
        cur = isElement(parent) ? parent : null;
      }
    }

    const sectionClasses = section ? classList(section) : [];
    const { columnIndex, columnCount } = findColumnContext($, widget);

    const images = extractImages($, $w);
    const videos = extractVideos($, $w);
    const links = extractLinks($, $w);
    const listItems = extractListItems($, $w);
    const heading = extractHeading($, $w);
    const { bodyHtml, bodyText } = extractBody($, $w);
    const statValue = extractStatValue($, $w);

    const imagePosition = inferImagePosition(
      columnIndex,
      columnCount,
      images.length > 0,
      sectionClasses,
    );

    blocks.push({
      id: `block-${order + 1}`,
      order,
      sectionIndex: resolvedSectionIndex >= 0 ? resolvedSectionIndex : 0,
      elementorId: widget.attribs["data-id"] || null,
      widgetType,
      classes: classList(widget),
      heading,
      bodyHtml,
      bodyText,
      images,
      videos,
      links,
      listItems,
      statValue,
      layout: {
        columnCount,
        columnIndex,
        imagePosition,
        sectionClasses: sectionClasses.filter((c) =>
          /elementor-|e-con|e-flex|reverse|full_width|boxed|stretched/.test(c),
        ),
        isFullWidth: sectionClasses.some((c) =>
          /full.width|full_width|stretched/.test(c),
        ),
        reverseMobile: sectionClasses.includes("elementor-reverse-mobile"),
      },
    });
    order += 1;
  }

  return { blocks, sectionCount: sectionEls.length };
}

// ---------------------------------------------------------------------------
// Process one WP page → RawPage
// ---------------------------------------------------------------------------

function processPage(
  page: WpPage,
  canonicalSlug: string,
  pageKind: PageKind,
): RawPage {
  const locale = inferLocale(page);
  const html = page.content?.rendered || "";
  const { blocks, sectionCount } = parseElementorHtml(html);

  return {
    id: page.id,
    slug: page.slug,
    canonicalSlug,
    locale: locale === "unknown" ? (page.lang || "unknown") : locale,
    title: decodeHtmlEntities(page.title?.rendered || ""),
    link: page.link,
    pageKind,
    translations: page.translations || {},
    excerpt: cleanText(
      (page.excerpt?.rendered || "").replace(/<[^>]+>/g, ""),
    ) || null,
    seo: {
      title: page.yoast_head_json?.title || null,
      description: page.yoast_head_json?.description || null,
    },
    modified: page.modified || null,
    blocks,
    meta: {
      widgetCount: blocks.length,
      sectionCount,
      htmlBytes: Buffer.byteLength(html, "utf8"),
    },
  };
}

// ---------------------------------------------------------------------------
// Concurrency pool
// ---------------------------------------------------------------------------

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
      await sleep(DELAY_MS);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Legacy content extraction ===\n");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const loc of LOCALES) {
    fs.mkdirSync(path.join(OUT_DIR, loc), { recursive: true });
  }

  const report: Report = {
    extractedAt: new Date().toISOString(),
    totalRestPages: 0,
    totalSitemapUrls: 0,
    written: 0,
    failures: [],
    sitemapOnly: [],
    restOnly: [],
    incompleteGroups: [],
    outliers: [],
    pageKindCounts: {},
  };

  // 1. Sitemap cross-check
  console.log("Fetching sitemaps…");
  let sitemapUrls: string[] = [];
  try {
    sitemapUrls = await fetchSitemapUrls();
    report.totalSitemapUrls = sitemapUrls.length;
    console.log(`  ${sitemapUrls.length} URLs in sitemaps`);
  } catch (err) {
    console.warn("  Sitemap fetch failed:", (err as Error).message);
    report.failures.push({
      pageId: null,
      url: `${BASE}/sitemap_index.xml`,
      locale: null,
      slug: null,
      error: `sitemap: ${(err as Error).message}`,
    });
  }

  // 2. Fetch all REST pages
  console.log("\nFetching WP REST pages…");
  let wpPages: WpPage[] = [];
  try {
    wpPages = await fetchAllPages();
    report.totalRestPages = wpPages.length;
    console.log(`  ${wpPages.length} pages from REST API`);
  } catch (err) {
    console.error("FATAL: could not fetch REST pages:", (err as Error).message);
    report.failures.push({
      pageId: null,
      url: `${BASE}/wp-json/wp/v2/pages`,
      locale: null,
      slug: null,
      error: (err as Error).message,
    });
    fs.writeFileSync(path.join(OUT_DIR, "_report.json"), JSON.stringify(report, null, 2));
    process.exit(1);
  }

  const pagesById = new Map<number, WpPage>();
  for (const p of wpPages) pagesById.set(p.id, p);

  // Reconcile sitemap ↔ REST
  const restLinks = new Set(wpPages.map((p) => p.link.replace(/\/$/, "")));
  const sitemapNorm = sitemapUrls.map((u) => u.replace(/\/$/, ""));
  for (const u of sitemapNorm) {
    if (!restLinks.has(u) && !restLinks.has(u + "/")) {
      // Only flag page-like URLs (skip posts if desired — keep all for report)
      report.sitemapOnly.push(u);
    }
  }
  for (const link of restLinks) {
    if (!sitemapNorm.includes(link) && !sitemapNorm.includes(link + "/")) {
      report.restOnly.push(link);
    }
  }

  // 3. Group by translation map → canonical units
  // Use the smallest ID in a translation group as the group key to avoid duplicates
  const seenGroupKeys = new Set<string>();
  type Group = {
    canonicalSlug: string;
    pageKind: PageKind;
    members: Map<string, WpPage>; // locale → page
    translationIds: Record<string, number>;
  };
  const groups: Group[] = [];

  for (const page of wpPages) {
    const translations = page.translations || { [page.lang || "en"]: page.id };
    const ids = Object.values(translations).sort((a, b) => a - b);
    const groupKey = ids.join("-");
    if (seenGroupKeys.has(groupKey)) continue;
    seenGroupKeys.add(groupKey);

    // Ensure all translation members are present
    const members = new Map<string, WpPage>();
    for (const [loc, id] of Object.entries(translations)) {
      const p = pagesById.get(id);
      if (p) {
        const inferred = inferLocale(p);
        const localeKey = inferred !== "unknown" ? inferred : loc;
        members.set(localeKey, p);
      }
    }
    // Also include the current page if somehow missing
    const selfLocale = inferLocale(page);
    if (selfLocale !== "unknown" && !members.has(selfLocale)) {
      members.set(selfLocale, page);
    }

    const canonicalSlug = deriveCanonicalSlug(pagesById, translations);
    // Pick a title for classification
    const enPage = members.get("en");
    const titleForKind = enPage?.title?.rendered || page.title?.rendered || canonicalSlug;
    const pageKind = classifyPageKind(canonicalSlug, titleForKind);

    groups.push({ canonicalSlug, pageKind, members, translationIds: translations });
  }

  // Disambiguate colliding canonical slugs (e.g. home vs orphan home-en both → "home").
  // Prefer keeping the slug on the group with the most locales; rename the rest.
  const bySlug = new Map<string, Group[]>();
  for (const g of groups) {
    const list = bySlug.get(g.canonicalSlug) || [];
    list.push(g);
    bySlug.set(g.canonicalSlug, list);
  }
  for (const [slug, list] of bySlug) {
    if (list.length < 2) continue;
    list.sort((a, b) => b.members.size - a.members.size);
    // Keep list[0] as `slug`; rename the rest
    for (let i = 1; i < list.length; i++) {
      const g = list[i];
      const en = g.members.get("en");
      const any = en || [...g.members.values()][0];
      const rawSlug = any?.slug || `${slug}-alt`;
      // Prefer original WP slug if it differs; else append id
      const candidate =
        stripLocaleSuffix(rawSlug) !== slug
          ? stripLocaleSuffix(rawSlug)
          : `${slug}-${any?.id ?? i}`;
      // Ensure uniqueness against other groups
      let unique = candidate;
      let n = 2;
      while (bySlug.has(unique) || groups.some((x) => x !== g && x.canonicalSlug === unique)) {
        unique = `${candidate}-${n++}`;
      }
      console.warn(
        `  Canonical slug collision on "${slug}": renaming group (ids ${Object.values(g.translationIds).join(",")}) → "${unique}"`,
      );
      g.canonicalSlug = unique;
      g.pageKind = classifyPageKind(
        unique,
        (en || any)?.title?.rendered || unique,
      );
    }
  }

  console.log(`\n${groups.length} canonical page groups`);

  // Track incomplete groups
  for (const g of groups) {
    const present = [...g.members.keys()];
    const missing = LOCALES.filter((l) => !g.members.has(l));
    if (missing.length > 0) {
      report.incompleteGroups.push({
        canonicalSlug: g.canonicalSlug,
        present,
        missing: [...missing],
      });
    }
  }

  // 4. Process & write each page
  console.log("\nParsing Elementor markup & writing JSON…");

  type WorkItem = {
    group: Group;
    locale: string;
    page: WpPage;
  };
  const work: WorkItem[] = [];
  for (const group of groups) {
    for (const [locale, page] of group.members) {
      work.push({ group, locale, page });
    }
  }

  await mapPool(work, CONCURRENCY, async ({ group, locale, page }) => {
    const outLocale = LOCALES.includes(locale as Locale) ? locale : "unknown";
    const outDir =
      outLocale === "unknown"
        ? path.join(OUT_DIR, "_unknown")
        : path.join(OUT_DIR, outLocale);
    fs.mkdirSync(outDir, { recursive: true });

    try {
      const raw = processPage(page, group.canonicalSlug, group.pageKind);

      // Flag outliers
      if (raw.meta.htmlBytes > 500_000) {
        report.outliers.push({
          canonicalSlug: group.canonicalSlug,
          locale: outLocale,
          htmlBytes: raw.meta.htmlBytes,
          reason: "html > 500KB (likely homepage/mega-page)",
        });
      }

      const outPath = path.join(outDir, `${group.canonicalSlug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(raw, null, 2));
      report.written += 1;
      report.pageKindCounts[group.pageKind] =
        (report.pageKindCounts[group.pageKind] || 0) + 1;

      process.stdout.write(
        `  ✓ ${outLocale}/${group.canonicalSlug} (${raw.blocks.length} blocks)\n`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${outLocale}/${group.canonicalSlug}: ${message}`);
      report.failures.push({
        pageId: page.id,
        url: page.link,
        locale: outLocale,
        slug: page.slug,
        error: message,
      });
    }
  });

  // 5. Write report
  const reportPath = path.join(OUT_DIR, "_report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log("\n=== Done ===");
  console.log(`Written: ${report.written}`);
  console.log(`Failures: ${report.failures.length}`);
  console.log(`Incomplete groups: ${report.incompleteGroups.length}`);
  console.log(`Sitemap-only URLs: ${report.sitemapOnly.length}`);
  console.log(`REST-only URLs: ${report.restOnly.length}`);
  console.log(`Outliers: ${report.outliers.length}`);
  console.log(`Page kinds:`, report.pageKindCounts);
  console.log(`Report: ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import type { ReactNode } from "react";
import {
  bodyText,
  headingText,
  resolve,
  stripHtml,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
  Breadcrumb,
  DemoCta,
  SolutionShell,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type {
  ResolvedBlock,
  SolutionLayoutProps,
} from "@/components/solutions/shared/types";
import { Reveal } from "@/components/blocks/Motion";
import { isLocale, stripLocale, withLocale, type Locale } from "@/lib/i18n/config";
import styles from "./CoolingMonitoringLayout.module.css";

/** Known in-app solution slugs (legacy WP paths map here under `/solutions/`). */
const SOLUTION_SLUGS = new Set([
  "constractor",
  "lorry",
  "leasing-control",
  "nimbus",
  "hecterra-agriculture",
  "cooling-monitoring",
  "logistics-delivery-system",
  "eco-drive",
  "fleetrun-fleet-volunteer",
  "wia-tag",
  "fuel-management-system",
  "tpms-ebs-cooling-fuel-monitoring",
  "dashcam",
  "dashcam-bus-truck",
  "registration-of-truck-door-opening",
  "tpms-solutions",
  "temperature-monitoring-work",
  "geolocation-of-construction-tools",
  "opening-detection-of-truck-side-panels",
  "e-drivers-book",
  "click-connect",
  "safe-start",
  "tacho-live",
  "transport-telematics",
  "jaxicloud-platform",
]);

/** WordPress locale suffixes on slugs (`-da`, `-hl`, `-tur`, …). */
const LOCALE_SLUG_SUFFIX =
  /-(?:da|de|fr|hl|nl|no|nb|sv|tur|tr|en)$/i;

/** Resolve a block by stable `order` so layout mapping stays locale-agnostic. */
function at(
  blocks: SolutionLayoutProps["page"]["blocks"],
  locale: SolutionLayoutProps["locale"],
  order: number,
): ResolvedBlock | null {
  const block = blocks.find((b) => b.order === order);
  return block ? resolve(block, locale) : null;
}

function stripLegacySlugSuffix(slug: string): string {
  return slug.replace(LOCALE_SLUG_SUFFIX, "").replace(/-\d+$/, "") || slug;
}

/**
 * Map CMS / live-site hrefs to locale-aware in-app routes.
 * Legacy: `/en/registration-of-truck-door-opening/` → `/en/solutions/registration-of-truck-door-opening`
 */
function ctaHref(
  url: string | null | undefined,
  locale: Locale,
  fallback: string,
): string {
  const raw = (url || "").trim();
  if (!raw || raw === "#") return fallback;

  let pathname = raw;
  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      const host = u.hostname.replace(/^www\./i, "").toLowerCase();
      if (host !== "jaxicloud.com") return raw;
      pathname = u.pathname || "/";
    } catch {
      return fallback;
    }
  }

  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  const { path } = stripLocale(pathname);
  let clean = path.replace(/\/+$/, "") || "/";

  if (clean.startsWith("/solutions/")) {
    const slug = stripLegacySlugSuffix(clean.slice("/solutions/".length));
    return withLocale(locale, `/solutions/${slug}`);
  }

  // Already a localized app root (contact, blog, …)
  if (
    clean === "/contact" ||
    clean === "/services" ||
    clean.startsWith("/blog")
  ) {
    return withLocale(locale, clean);
  }

  // Products / applications stay unprefixed in this app
  if (clean.startsWith("/products") || clean.startsWith("/applications")) {
    return clean;
  }

  // Bare legacy solution slug: `/registration-of-truck-door-opening-de/`
  const bare = stripLegacySlugSuffix(clean.replace(/^\//, ""));
  if (bare && SOLUTION_SLUGS.has(bare)) {
    return withLocale(locale, `/solutions/${bare}`);
  }

  // Locale segment mistaken for path (`/en/...` already stripped); keep relative
  const parts = bare.split("/");
  if (parts.length === 1 && isLocale(parts[0])) {
    return fallback;
  }

  return withLocale(locale, clean.startsWith("/") ? clean : `/${clean}`);
}

/** Prefer ctaUrl / links; fall back to EN fields when locale CTA is empty. */
function resolveCta(
  cta: ResolvedBlock | null | undefined,
  locale: Locale,
  fallback: string,
): { label: string | null; href: string } {
  if (!cta) return { label: null, href: fallback };

  const en = cta.block.translations.en;
  const label =
    cta.text.ctaLabel?.trim() ||
    cta.text.links[0]?.label?.trim() ||
    en?.ctaLabel?.trim() ||
    en?.links?.[0]?.label?.trim() ||
    null;
  const url =
    cta.text.ctaUrl?.trim() ||
    cta.text.links[0]?.href?.trim() ||
    en?.ctaUrl?.trim() ||
    en?.links?.[0]?.href?.trim() ||
    null;

  return { label, href: ctaHref(url, locale, fallback) };
}

function proseHtml(r: ResolvedBlock | null): string {
  if (!r) return "";
  if (r.text.bodyHtml?.trim()) return r.text.bodyHtml;
  const plain = bodyText(r) || stripHtml(r.text.bodyHtml);
  return plain ? `<p>${plain}</p>` : "";
}

function paragraphChunks(r: ResolvedBlock | null): string[] {
  if (!r) return [];
  const html = r.text.bodyHtml?.trim();
  if (html) {
    const parts = html
      .split(/<\/p>/i)
      .map((chunk) => chunk.replace(/<p[^>]*>/i, "").trim())
      .filter(Boolean)
      .map((inner) => `<p>${inner}</p>`);
    if (parts.length) return parts;
  }
  const plain = bodyText(r);
  return plain ? [`<p>${plain}</p>`] : [];
}

function normalizeCopy(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Live CMS sometimes re-emits the hero intro under a later card (same issue
 * as Hecterra). Skip richText that matches the hero body by id or copy.
 */
function isHeroDuplicate(
  block: ResolvedBlock | null,
  heroBody: ResolvedBlock | null,
): boolean {
  if (!block || !heroBody) return false;
  if (block.block.id === heroBody.block.id) return true;
  const a = normalizeCopy(
    stripHtml(block.text.bodyHtml) || bodyText(block) || "",
  );
  const b = normalizeCopy(
    stripHtml(heroBody.text.bodyHtml) || bodyText(heroBody) || "",
  );
  if (!a || !b) return false;
  if (a === b) return true;
  // Near-identical paste (allow minor trailing fluff)
  const min = Math.min(a.length, b.length);
  if (min < 120) return false;
  return a.slice(0, min) === b.slice(0, min);
}

function HtmlChunk({ html }: { html: string }) {
  return (
    <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/**
 * Recorders body mixes lead / closing paragraphs with short semicolon lines
 * that read as a bullet list on the live page.
 */
function RecordersProse({ block }: { block: ResolvedBlock }) {
  const paras = paragraphChunks(block);
  if (!paras.length) return null;

  const lead: string[] = [];
  const bullets: string[] = [];
  const trail: string[] = [];
  let inBullets = false;

  for (const html of paras) {
    const text = stripHtml(html).replace(/\s+/g, " ").trim();
    const looksBullet =
      text.length > 0 &&
      text.length < 120 &&
      (/[;:]\s*$/.test(text) || (!text.includes(". ") && text.split(" ").length <= 14));

    if (looksBullet) {
      inBullets = true;
      bullets.push(text.replace(/[;:]\s*$/, "").trim());
    } else if (!inBullets) {
      lead.push(html);
    } else {
      trail.push(html);
    }
  }

  return (
    <div className={styles.copy}>
      {lead.map((html) => (
        <HtmlChunk key={html.slice(0, 48)} html={html} />
      ))}
      {bullets.length ? (
        <ul className={styles.list}>
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {trail.map((html) => (
        <HtmlChunk key={html.slice(0, 48)} html={html} />
      ))}
    </div>
  );
}

function ContentCard({
  heading,
  children,
  cta,
  locale,
  contactHref,
  ctaFallbackHref,
  delay = 0,
}: {
  heading: string;
  children: ReactNode;
  cta?: ResolvedBlock | null;
  locale: Locale;
  contactHref: string;
  /** Preferred destination when CMS CTA href is empty (not contact). */
  ctaFallbackHref?: string;
  delay?: number;
}) {
  const { label, href } = resolveCta(
    cta,
    locale,
    ctaFallbackHref || contactHref,
  );
  if (!heading && !children && !label) return null;

  return (
    <Reveal delay={delay} className={styles.card}>
      {heading ? (
        <h2 className={`${p.display} ${styles.cardTitle}`}>{heading}</h2>
      ) : null}
      <div className={styles.cardBody}>{children}</div>
      {label ? (
        <div className={styles.cardCta}>
          <DemoCta href={href} label={label} />
        </div>
      ) : null}
    </Reveal>
  );
}

export function CoolingMonitoringLayout({
  page,
  locale,
  eyebrow,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  // Live section map (block.order → role). Orders are stable across locales.
  const pageTitle = at(blocks, locale, 0);
  const waysH = at(blocks, locale, 1);
  const heroSub = at(blocks, locale, 2);
  const heroBody = at(blocks, locale, 3);

  const sensorsH = at(blocks, locale, 4);
  const sensorsBody = at(blocks, locale, 5);
  const sensorsCta = at(blocks, locale, 6);

  const recordersH = at(blocks, locale, 7);
  const recordersBody = at(blocks, locale, 8);
  const recordersImgs = [9, 10, 11]
    .map((order) => at(blocks, locale, order))
    .filter((b): b is ResolvedBlock => Boolean(b));
  const recordersClose = at(blocks, locale, 12);

  const iqH = at(blocks, locale, 13);
  const iqBody = at(blocks, locale, 14);
  const iqImgs = [15, 16, 17]
    .map((order) => at(blocks, locale, order))
    .filter((b): b is ResolvedBlock => Boolean(b));
  const iqClose = at(blocks, locale, 18);
  const iqCta = at(blocks, locale, 19);

  const heroTitle = headingText(pageTitle) || title;
  const waysHeading = headingText(waysH);
  const heroSubtitle = headingText(heroSub);
  const heroHtml = proseHtml(heroBody);

  const sensorsTitle = headingText(sensorsH);
  const sensorsHtml = proseHtml(sensorsBody);

  const recordersTitle = headingText(recordersH);
  const recordersCloseHtml = proseHtml(recordersClose);

  const iqTitle = headingText(iqH);
  const iqHtml = proseHtml(iqBody);
  // Skip CMS duplicate of hero intro under iQFreeze (Hecterra-style fix).
  const iqCloseHtml = isHeroDuplicate(iqClose, heroBody)
    ? ""
    : proseHtml(iqClose);

  return (
    <SolutionShell className={styles.page}>
      <Wrap>
        <Breadcrumb
          localeHref={withLocale(locale, "/solutions")}
          label={eyebrow}
          title={title}
        />
      </Wrap>

      <Wrap>
        <section className={styles.hero}>
          <Reveal>
            <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
          </Reveal>
        </section>

        {(waysHeading || heroSubtitle || heroHtml) && (
          <section className={styles.intro}>
            <Reveal className={styles.introCopy}>
              {waysHeading ? (
                <p className={styles.ways}>{waysHeading}</p>
              ) : null}
              {heroSubtitle ? (
                <h2 className={`${p.display} ${styles.subheading}`}>
                  {heroSubtitle}
                </h2>
              ) : null}
              {heroHtml ? (
                <div
                  className={styles.prose}
                  dangerouslySetInnerHTML={{ __html: heroHtml }}
                />
              ) : null}
            </Reveal>
          </section>
        )}

        <div className={styles.cards}>
          <ContentCard
            heading={sensorsTitle}
            cta={sensorsCta}
            locale={locale}
            contactHref={contactHref}
            ctaFallbackHref={withLocale(
              locale,
              "/solutions/registration-of-truck-door-opening",
            )}
            delay={0.04}
          >
            {sensorsHtml ? <HtmlChunk html={sensorsHtml} /> : null}
          </ContentCard>

          <ContentCard
            heading={recordersTitle}
            locale={locale}
            contactHref={contactHref}
            delay={0.08}
          >
            {recordersBody ? <RecordersProse block={recordersBody} /> : null}
            {recordersImgs.length ? (
              <div className={styles.mediaStack}>
                {recordersImgs.map((img, i) => (
                  <BlockMedia
                    key={img.block.id}
                    block={img}
                    className={
                      i === 0 ? styles.mediaWide : styles.mediaHalf
                    }
                    priority={i === 0}
                  />
                ))}
              </div>
            ) : null}
            {recordersCloseHtml ? (
              <HtmlChunk html={recordersCloseHtml} />
            ) : null}
          </ContentCard>

          <ContentCard
            heading={iqTitle}
            cta={iqCta}
            locale={locale}
            contactHref={contactHref}
            ctaFallbackHref={withLocale(
              locale,
              "/solutions/temperature-monitoring-work",
            )}
            delay={0.12}
          >
            {iqHtml ? <HtmlChunk html={iqHtml} /> : null}
            {iqImgs.length ? (
              <div className={styles.mediaStack}>
                {iqImgs.map((img, i) => (
                  <BlockMedia
                    key={img.block.id}
                    block={img}
                    className={
                      i === 0 ? styles.mediaWide : styles.mediaHalf
                    }
                  />
                ))}
              </div>
            ) : null}
            {iqCloseHtml ? <HtmlChunk html={iqCloseHtml} /> : null}
          </ContentCard>
        </div>
      </Wrap>
    </SolutionShell>
  );
}

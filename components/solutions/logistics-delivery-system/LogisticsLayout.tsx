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
import styles from "./LogisticsLayout.module.css";

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

const LOCALE_SLUG_SUFFIX =
  /-(?:da|de|fr|hl|nl|no|nb|sv|tur|tr|en)$/i;

/** Trailing CMS demo CTAs appended as plain text in intro body. */
const TRAILING_DEMO_CTA =
  /\s*(?:Download demo|Last ned demo|Ladda ner demo|Demo herunterladen|Télécharger la démo|Demo downloaden|Demo'yu indir)\s*\.?$/i;

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
 * Legacy: `https://www.jaxicloud.com/en/nimbus/` → `/en/solutions/nimbus`
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

  if (
    clean === "/contact" ||
    clean === "/services" ||
    clean.startsWith("/blog")
  ) {
    return withLocale(locale, clean);
  }

  if (clean.startsWith("/products") || clean.startsWith("/applications")) {
    return clean;
  }

  const bare = stripLegacySlugSuffix(clean.replace(/^\//, ""));
  if (bare && SOLUTION_SLUGS.has(bare)) {
    return withLocale(locale, `/solutions/${bare}`);
  }

  const parts = bare.split("/");
  if (parts.length === 1 && isLocale(parts[0])) {
    return fallback;
  }

  return withLocale(locale, clean.startsWith("/") ? clean : `/${clean}`);
}

/** Rewrite jaxicloud.com / legacy paths inside HTML bodies. */
function rewriteInternalLinks(html: string, locale: Locale): string {
  if (!html || !/href=/i.test(html)) return html;
  return html.replace(
    /href=(["'])([^"']+)\1/gi,
    (_full, quote: string, href: string) => {
      const next = ctaHref(href, locale, href);
      return `href=${quote}${next}${quote}`;
    },
  );
}

function proseHtml(r: ResolvedBlock | null, locale: Locale): string {
  if (!r) return "";
  const raw = r.text.bodyHtml?.trim()
    ? r.text.bodyHtml
    : bodyText(r) || stripHtml(r.text.bodyHtml)
      ? `<p>${bodyText(r) || stripHtml(r.text.bodyHtml)}</p>`
      : "";
  return rewriteInternalLinks(raw, locale);
}

/** Drop CMS “Download demo” trailers; DemoCta covers the action. */
function introProseHtml(r: ResolvedBlock | null, locale: Locale): string {
  let html = proseHtml(r, locale);
  if (!html) return "";
  html = html.replace(
    /(>)([^<]*?)(<\/(?:p|span)>)/gi,
    (full, open: string, text: string, close: string) => {
      if (!TRAILING_DEMO_CTA.test(text)) return full;
      const cleaned = text.replace(TRAILING_DEMO_CTA, "").trim();
      if (!cleaned) return "";
      return `${open}${cleaned}${close}`;
    },
  );
  // Collapse empty paragraphs left behind
  html = html.replace(/<p[^>]*>\s*<\/p>/gi, "").trim();
  return html;
}

const FEATURE_REVEAL: Array<"up" | "left" | "right"> = [
  "up",
  "right",
  "left",
  "up",
  "right",
  "up",
  "left",
  "up",
  "right",
];

function BenefitCard({
  block,
  index,
  delay = 0,
}: {
  block: ResolvedBlock | null;
  index: number;
  delay?: number;
}) {
  if (!block) return null;
  const title = headingText(block);
  const body =
    bodyText(block) ||
    stripHtml(block.text.bodyHtml) ||
    "";
  if (!title && !body) return null;
  const n = String(index + 1).padStart(2, "0");

  return (
    <Reveal delay={delay} className={styles.benefitCard}>
      <div className={styles.benefitMeta}>
        <span className={styles.benefitIndex} aria-hidden>
          {n}
        </span>
        <span className={styles.benefitRule} aria-hidden />
      </div>
      {title ? <h3 className={styles.benefitTitle}>{title}</h3> : null}
      {body ? <p className={styles.benefitBody}>{body}</p> : null}
    </Reveal>
  );
}

function FeatureCell({
  heading,
  body,
  locale,
  index,
  delay = 0,
}: {
  heading: ResolvedBlock | null;
  body: ResolvedBlock | null;
  locale: Locale;
  index: number;
  delay?: number;
}) {
  const title = headingText(heading);
  const html = proseHtml(body, locale);
  if (!title && !html) return null;
  const n = String(index + 1).padStart(2, "0");
  const isFeature = index === 0;
  const from = FEATURE_REVEAL[index] ?? "up";

  return (
    <Reveal
      delay={delay}
      from={from}
      className={`${styles.featureCell}${isFeature ? ` ${styles.featureAnchor}` : ""}`}
    >
      <div className={styles.featureMeta}>
        <span className={styles.featureIndex} aria-hidden>
          {n}
        </span>
        <span className={styles.featureRule} aria-hidden />
        <span className={styles.featureArrow} aria-hidden>
          ↗
        </span>
      </div>
      {title ? <h3 className={styles.featureTitle}>{title}</h3> : null}
      {html ? (
        <div
          className={styles.featureBody}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}
    </Reveal>
  );
}

export function LogisticsLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  // Live section map (block.order → role). Orders are stable across locales.
  const pageTitle = at(blocks, locale, 0);

  const introH = at(blocks, locale, 1);
  const introBody = at(blocks, locale, 2);
  const introImg = at(blocks, locale, 3);

  // Order 4 = locale benefits heading; order 5 = stacked bilingual duplicate (skip).
  const benefitsH = at(blocks, locale, 4);
  const benefitCards = [6, 7, 8, 9, 10, 11].map((order) =>
    at(blocks, locale, order),
  );

  const previewImgs = [12, 13, 14, 15]
    .map((order) => at(blocks, locale, order))
    .filter((b): b is ResolvedBlock => Boolean(b));

  const featurePairs = [
    [16, 17],
    [18, 19],
    [20, 21],
    [22, 23],
    [24, 25],
    [26, 27],
    [28, 29],
    [30, 31],
    [32, 33],
  ].map(([h, b]) => ({
    heading: at(blocks, locale, h),
    body: at(blocks, locale, b),
  }));

  const heroTitle = headingText(pageTitle) || title;
  const introHeading = headingText(introH);
  const introHtml = introProseHtml(introBody, locale);
  const benefitsHeading = headingText(benefitsH);

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
      </Wrap>

      {(introHeading || introHtml || introImg) && (
        <Wrap>
          <section className={styles.intro}>
            <Reveal className={styles.introCopy}>
              {introHeading ? (
                <h2 className={`${p.display} ${styles.introHeading}`}>
                  {introHeading}
                </h2>
              ) : null}
              {introHtml ? (
                <div
                  className={styles.introProse}
                  dangerouslySetInnerHTML={{ __html: introHtml }}
                />
              ) : null}
              {requestDemoLabel ? (
                <div className={styles.introCta}>
                  <DemoCta href={contactHref} label={requestDemoLabel} />
                </div>
              ) : null}
            </Reveal>
            {introImg ? (
              <Reveal delay={0.06} className={styles.introMedia}>
                <div className={styles.mediaStack}>
                  <div className={styles.mediaBack} aria-hidden />
                  <BlockMedia
                    block={introImg}
                    className={styles.mediaFront}
                    priority
                  />
                </div>
              </Reveal>
            ) : null}
          </section>
        </Wrap>
      )}

      {(benefitsHeading || benefitCards.some(Boolean)) && (
        <Wrap>
          <section className={styles.benefits}>
            {benefitsHeading ? (
              <Reveal>
                <h2 className={`${p.display} ${styles.sectionTitle}`}>
                  {benefitsHeading}
                </h2>
              </Reveal>
            ) : null}
            <div className={styles.benefitGrid}>
              {benefitCards.map((card, i) => (
                <BenefitCard
                  key={card?.block.id ?? i}
                  block={card}
                  index={i}
                  delay={0.03 + i * 0.04}
                />
              ))}
            </div>
          </section>
        </Wrap>
      )}

      {previewImgs.length > 0 && (
        <Wrap>
          <section
            className={styles.previews}
            aria-label={heroTitle}
          >
            <div className={styles.previewGrid}>
              {previewImgs.map((img, i) => (
                <Reveal
                  key={img.block.id}
                  delay={0.04 + i * 0.05}
                  className={styles.previewCell}
                >
                  <BlockMedia block={img} className={styles.previewFrame} />
                </Reveal>
              ))}
            </div>
          </section>
        </Wrap>
      )}

      {featurePairs.some(
        (pair) => headingText(pair.heading) || proseHtml(pair.body, locale),
      ) && (
        <Wrap>
          <section className={styles.features} aria-label={heroTitle}>
            <div className={styles.featureGrid}>
              {featurePairs.map((pair, i) => (
                <FeatureCell
                  key={pair.heading?.block.id ?? i}
                  heading={pair.heading}
                  body={pair.body}
                  locale={locale}
                  index={i}
                  delay={0.03 + i * 0.05}
                />
              ))}
            </div>
          </section>
        </Wrap>
      )}
    </SolutionShell>
  );
}

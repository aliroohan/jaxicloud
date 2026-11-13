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
import {
  BatteryCharging,
  Gauge,
  Radio,
  ShieldCheck,
  Thermometer,
  Wrench,
} from "lucide-react";
import styles from "./TemperatureLayout.module.css";

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
const LOCALE_SLUG_SUFFIX = /-(?:da|de|fr|hl|nl|no|nb|sv|tur|tr|en)$/i;

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
 * Legacy: `/en/cooling-monitoring/` → `/{locale}/solutions/cooling-monitoring`
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
  const clean = path.replace(/\/+$/, "") || "/";

  if (clean.startsWith("/solutions/")) {
    const slug = stripLegacySlugSuffix(clean.slice("/solutions/".length));
    return withLocale(locale, `/solutions/${slug}`);
  }

  if (clean === "/contact" || clean === "/services" || clean.startsWith("/blog")) {
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

/** Prefer ctaUrl / links; fall back to EN fields when locale CTA is empty. */
function resolveCta(
  cta: ResolvedBlock | null,
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

type Benefit = { title: string; desc: string };

const BENEFIT_ICONS = [ShieldCheck, Gauge, Thermometer, Radio, Wrench, BatteryCharging];

/**
 * The "why integrate temperature sensors" body mixes one lead paragraph with
 * alternating title/description paragraphs (CMS rich text, no dedicated list
 * block) — split it into a real benefit list, same heuristic used on the
 * door-opening / dashcam / TPMS pages.
 */
function parseBenefits(r: ResolvedBlock | null): {
  intro: string;
  items: Benefit[];
} {
  if (!r) return { intro: "", items: [] };
  const html = r.text.bodyHtml?.trim();
  const raw = html || (r.text.body ? `<p>${r.text.body}</p>` : "");
  if (!raw) return { intro: "", items: [] };
  const paras = raw
    .split(/<\/p>/i)
    .map((c) => c.replace(/<p[^>]*>/i, "").trim())
    .filter(Boolean)
    .map((c) => stripHtml(c));
  if (!paras.length) return { intro: "", items: [] };
  const [intro, ...rest] = paras;
  const items: Benefit[] = [];
  for (let i = 0; i < rest.length; i += 2) {
    const title = rest[i];
    const desc = rest[i + 1] || "";
    if (title) items.push({ title, desc });
  }
  return { intro, items };
}

function ZigRow({
  heading,
  html,
  image,
  mediaLeft,
  index,
  cta,
}: {
  heading: string;
  html: string;
  image: ResolvedBlock | null;
  mediaLeft: boolean;
  index: number;
  cta?: { label: string | null; href: string } | null;
}) {
  const hasMedia = Boolean(
    image && (image.block.images[0]?.src || image.block.layout.image),
  );
  if (!heading && !html && !hasMedia) return null;

  const mediaClass = mediaLeft ? styles.zigMediaLeft : styles.zigMediaRight;
  const mediaFrom = mediaLeft ? "left" : "right";
  const copyFrom = mediaLeft ? "right" : "left";

  return (
    <section className={`${styles.zigRow} ${mediaClass}`}>
      <Reveal
        delay={0.06 + index * 0.03}
        from={copyFrom}
        className={styles.copySlot}
      >
        <div className={styles.copy}>
          {heading ? (
            <h2 className={`${p.display} ${styles.zigHeading}`}>{heading}</h2>
          ) : null}
          {html ? (
            <div
              className={styles.zigProse}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : null}
          {cta?.label ? (
            <div className={styles.zigCta}>
              <DemoCta href={cta.href} label={cta.label} variant="ghost" />
            </div>
          ) : null}
        </div>
      </Reveal>
      <Reveal delay={0.02 + index * 0.03} from={mediaFrom} className={styles.mediaSlot}>
        {hasMedia && image ? (
          <BlockMedia block={image} className={styles.mediaFrame} priority={index === 0} />
        ) : null}
      </Reveal>
    </section>
  );
}

function SensorCard({
  image,
  index,
  delay,
}: {
  image: ResolvedBlock | null;
  index: number;
  delay: number;
}) {
  const hasMedia = Boolean(
    image && (image.block.images[0]?.src || image.block.layout.image),
  );
  if (!hasMedia || !image) return null;
  return (
    <Reveal delay={delay} className={styles.sensorCard}>
      <div className={styles.sensorShot}>
        <BlockMedia block={image} className={styles.sensorImg} />
      </div>
    </Reveal>
  );
}

export function TemperatureLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  const pageTitle = at(blocks, locale, 0);

  const whatH = at(blocks, locale, 1);
  const whatBody = at(blocks, locale, 2);
  const whatImg = at(blocks, locale, 3);

  const howImg = at(blocks, locale, 4);
  const howH = at(blocks, locale, 5);
  const howBody = at(blocks, locale, 6);
  const howCtaBlock = at(blocks, locale, 7);

  const quote = at(blocks, locale, 8);

  const whyH = at(blocks, locale, 9);
  const whyBody = at(blocks, locale, 10);

  const whichH = at(blocks, locale, 11);
  const whichBody = at(blocks, locale, 12);

  const sensor1Img = at(blocks, locale, 13);
  const sensor2Img = at(blocks, locale, 14);

  const heroTitle = headingText(pageTitle) || title;

  const whatHeading = headingText(whatH);
  const whatHtml = proseHtml(whatBody);
  const howHeading = headingText(howH);
  const howHtml = proseHtml(howBody);
  const howCta = resolveCta(
    howCtaBlock,
    locale,
    withLocale(locale, "/solutions/cooling-monitoring"),
  );

  const quoteText = bodyText(quote) || stripHtml(quote?.text.bodyHtml);

  const whyHeading = headingText(whyH);
  const { intro: whyIntro, items: benefits } = parseBenefits(whyBody);

  const whichHeading = headingText(whichH);
  const whichHtml = proseHtml(whichBody);

  const hasSensors = Boolean(
    (sensor1Img && (sensor1Img.block.images[0]?.src || sensor1Img.block.layout.image)) ||
      (sensor2Img && (sensor2Img.block.images[0]?.src || sensor2Img.block.layout.image)),
  );

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

        <div className={styles.zig}>
          <ZigRow
            heading={whatHeading}
            html={whatHtml}
            image={whatImg}
            mediaLeft={false}
            index={0}
          />
          <ZigRow
            heading={howHeading}
            html={howHtml}
            image={howImg}
            mediaLeft={true}
            index={1}
            cta={howCta}
          />
        </div>

        {quoteText ? (
          <section className={styles.quoteSection}>
            <Reveal className={styles.quoteBlock}>
              <p className={styles.quoteText}>{quoteText}</p>
            </Reveal>
          </section>
        ) : null}

        {(whyHeading || whyIntro || benefits.length > 0) && (
          <section className={styles.why}>
            {whyHeading ? (
              <Reveal>
                <h2 className={`${p.display} ${styles.sectionTitle}`}>
                  {whyHeading}
                </h2>
              </Reveal>
            ) : null}
            {whyIntro ? (
              <Reveal delay={0.04}>
                <p className={styles.whyIntro}>{whyIntro}</p>
              </Reveal>
            ) : null}
            {benefits.length > 0 ? (
              <div className={styles.benefitGrid}>
                {benefits.map((item, i) => {
                  const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
                  return (
                    <Reveal
                      key={item.title}
                      delay={0.08 + i * 0.05}
                      className={styles.benefitCard}
                    >
                      <span className={styles.benefitIcon} aria-hidden>
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      <h3 className={styles.benefitTitle}>{item.title}</h3>
                      {item.desc ? (
                        <p className={styles.benefitDesc}>{item.desc}</p>
                      ) : null}
                    </Reveal>
                  );
                })}
              </div>
            ) : null}
          </section>
        )}

        {(whichHeading || whichHtml || hasSensors) && (
          <section className={styles.which}>
            {whichHeading ? (
              <Reveal>
                <h2 className={`${p.display} ${styles.sectionTitle}`}>
                  {whichHeading}
                </h2>
              </Reveal>
            ) : null}
            {whichHtml ? (
              <Reveal delay={0.04} className={styles.whichProse}>
                <div dangerouslySetInnerHTML={{ __html: whichHtml }} />
              </Reveal>
            ) : null}
            {hasSensors ? (
              <div className={styles.sensors}>
                <SensorCard image={sensor1Img} index={0} delay={0.08} />
                <SensorCard image={sensor2Img} index={1} delay={0.14} />
              </div>
            ) : null}
          </section>
        )}

        <div className={styles.ctaRow}>
          <DemoCta href={contactHref} label={requestDemoLabel} />
        </div>
      </Wrap>
    </SolutionShell>
  );
}

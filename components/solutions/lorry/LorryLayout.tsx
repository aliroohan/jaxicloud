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
import { swapLocale, withLocale, type Locale } from "@/lib/i18n/config";
import { Check } from "lucide-react";
import styles from "./LorryLayout.module.css";

/** Resolve a block by stable `order` so layout mapping stays locale-agnostic. */
function at(
  blocks: SolutionLayoutProps["page"]["blocks"],
  locale: SolutionLayoutProps["locale"],
  order: number,
): ResolvedBlock | null {
  const block = blocks.find((b) => b.order === order);
  return block ? resolve(block, locale) : null;
}

function ctaHref(
  url: string | null | undefined,
  locale: Locale,
  fallback: string,
): string {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  return swapLocale(url, locale);
}

/**
 * Product band body in CMS often trails into "Highlights: … Features:"
 * which already render as dedicated list sections — trim the duplicate.
 */
function productProse(r: ResolvedBlock | null): string {
  if (!r) return "";
  const raw =
    stripHtml(r.text.bodyHtml) ||
    bodyText(r) ||
    headingText(r) ||
    "";
  const cut = raw.search(/\bHighlights\s*:/i);
  return (cut > 0 ? raw.slice(0, cut) : raw).trim();
}

function InfoCard({
  heading,
  body,
  cta,
  locale,
  contactHref,
  delay = 0,
}: {
  heading: ResolvedBlock | null;
  body: ResolvedBlock | null;
  cta: ResolvedBlock | null;
  locale: Locale;
  contactHref: string;
  delay?: number;
}) {
  const h = headingText(heading);
  const html =
    body?.text.bodyHtml ||
    (bodyText(body) ? `<p>${bodyText(body)}</p>` : "");
  const label = cta?.text.ctaLabel;
  if (!h && !html && !label) return null;

  return (
    <Reveal delay={delay} className={styles.infoCard}>
      {h ? <h2 className={`${p.display} ${styles.infoTitle}`}>{h}</h2> : null}
      {html ? (
        <div
          className={styles.infoProse}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}
      {label ? (
        <div className={styles.infoCta}>
          <DemoCta
            href={ctaHref(cta?.text.ctaUrl, locale, contactHref)}
            label={label}
          />
        </div>
      ) : null}
    </Reveal>
  );
}

function CheckList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!title && !items.length) return null;
  return (
    <div className={styles.checkCol}>
      {title ? (
        <h2 className={`${p.display} ${styles.checkTitle}`}>{title}</h2>
      ) : null}
      {items.length ? (
        <ul className={styles.checkList}>
          {items.map((item) => (
            <li key={item} className={styles.checkItem}>
              <span className={styles.checkIcon} aria-hidden>
                <Check size={14} strokeWidth={3} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function LorryLayout({
  page,
  locale,
  eyebrow,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  // Live section map (block.order → role). Orders are stable across locales.
  const pageTitle = at(blocks, locale, 0);

  const introH = at(blocks, locale, 1);
  const introBody = at(blocks, locale, 2);

  const gridImg = at(blocks, locale, 3);

  const telematicsH = at(blocks, locale, 4);
  const telematicsBody = at(blocks, locale, 5);
  const telematicsCta = at(blocks, locale, 6);

  const fuelH = at(blocks, locale, 7);
  const fuelBody = at(blocks, locale, 8);
  const fuelCta = at(blocks, locale, 9);

  const accurateH = at(blocks, locale, 10);
  const accurateBody = at(blocks, locale, 11);
  const accurateCta = at(blocks, locale, 12);

  const challengeH = at(blocks, locale, 13);
  const challengeBody = at(blocks, locale, 14);
  const challengeCta = at(blocks, locale, 15);

  const productH = at(blocks, locale, 16);
  const productLead = at(blocks, locale, 17);
  const productBody = at(blocks, locale, 18);

  const highlightsH = at(blocks, locale, 19);
  const highlightsList = at(blocks, locale, 20);
  const featuresH = at(blocks, locale, 21);
  const featuresList = at(blocks, locale, 22);

  const partnersH = at(blocks, locale, 23);
  const partnerLogos = [24, 25, 26, 27, 28]
    .map((order) => at(blocks, locale, order))
    .filter((b): b is ResolvedBlock => Boolean(b));

  const heroTitle = headingText(pageTitle) || title;
  const introHeading = headingText(introH);
  const introText =
    bodyText(introBody) ||
    headingText(introBody) ||
    stripHtml(introBody?.text.bodyHtml) ||
    "";

  const productLeadText =
    bodyText(productLead) ||
    headingText(productLead) ||
    stripHtml(productLead?.text.bodyHtml) ||
    "";
  const productMain = productProse(productBody);

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

      {(introHeading || introText) && (
        <section className={styles.navyBand}>
          <Wrap>
            <Reveal className={styles.navyInner}>
              {introHeading ? (
                <h2 className={styles.navyEyebrow}>{introHeading}</h2>
              ) : null}
              {introText ? <p className={styles.navyBody}>{introText}</p> : null}
            </Reveal>
          </Wrap>
        </section>
      )}

      <Wrap>
        <section className={styles.infoGrid} aria-label={heroTitle}>
          <Reveal className={styles.infoMedia}>
            {gridImg ? (
              <BlockMedia
                block={gridImg}
                className={styles.mediaFrame}
                priority
              />
            ) : null}
          </Reveal>

          <div className={styles.infoStack}>
            <InfoCard
              heading={telematicsH}
              body={telematicsBody}
              cta={telematicsCta}
              locale={locale}
              contactHref={contactHref}
            />
            <InfoCard
              heading={fuelH}
              body={fuelBody}
              cta={fuelCta}
              locale={locale}
              contactHref={contactHref}
              delay={0.05}
            />
          </div>

          <InfoCard
            heading={accurateH}
            body={accurateBody}
            cta={accurateCta}
            locale={locale}
            contactHref={contactHref}
            delay={0.04}
          />
          <InfoCard
            heading={challengeH}
            body={challengeBody}
            cta={challengeCta}
            locale={locale}
            contactHref={contactHref}
            delay={0.08}
          />
        </section>
      </Wrap>

      {(headingText(productH) || productLeadText || productMain) && (
        <section className={styles.productBand}>
          <Wrap>
            <Reveal className={styles.productInner}>
              {headingText(productH) ? (
                <h2 className={`${p.display} ${styles.productTitle}`}>
                  {headingText(productH)}
                </h2>
              ) : null}
              {productLeadText ? (
                <p className={styles.productLead}>{productLeadText}</p>
              ) : null}
              {productMain ? (
                <p className={styles.productBody}>{productMain}</p>
              ) : null}
            </Reveal>
          </Wrap>
        </section>
      )}

      {(highlightsList?.text.listItems.length ||
        featuresList?.text.listItems.length) && (
        <Wrap>
          <section className={styles.checks}>
            <Reveal>
              <CheckList
                title={headingText(highlightsH) || ""}
                items={highlightsList?.text.listItems ?? []}
              />
            </Reveal>
            <Reveal delay={0.06}>
              <CheckList
                title={headingText(featuresH) || ""}
                items={featuresList?.text.listItems ?? []}
              />
            </Reveal>
          </section>
        </Wrap>
      )}

      {(headingText(partnersH) || partnerLogos.length > 0) && (
        <Wrap>
          <section className={styles.partners}>
            <Reveal>
              {headingText(partnersH) ? (
                <h2 className={`${p.display} ${styles.partnersTitle}`}>
                  {headingText(partnersH)}
                </h2>
              ) : null}
              <div className={styles.logoRow}>
                {partnerLogos.map((logo) => (
                  <BlockMedia
                    key={logo.block.id}
                    block={logo}
                    className={styles.logoFrame}
                  />
                ))}
              </div>
            </Reveal>
          </section>
        </Wrap>
      )}
    </SolutionShell>
  );
}

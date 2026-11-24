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
import { withLocale } from "@/lib/i18n/config";
import {
  BatteryCharging,
  Crosshair,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import styles from "./GeolocationToolsLayout.module.css";

/** Resolve a block by stable `order` so layout mapping stays locale-agnostic. */
function at(
  blocks: SolutionLayoutProps["page"]["blocks"],
  locale: SolutionLayoutProps["locale"],
  order: number,
): ResolvedBlock | null {
  const block = blocks.find((b) => b.order === order);
  return block ? resolve(block, locale) : null;
}

function proseHtml(r: ResolvedBlock | null): string {
  if (!r) return "";
  if (r.text.bodyHtml?.trim()) return r.text.bodyHtml;
  const plain = bodyText(r) || stripHtml(r.text.bodyHtml);
  return plain ? `<p>${plain}</p>` : "";
}

const BENEFIT_ICONS = [BatteryCharging, ShieldCheck, Wrench, Crosshair];

function ZigRow({
  heading,
  html,
  image,
  mediaLeft,
  index,
}: {
  heading: string;
  html: string;
  image: ResolvedBlock | null;
  mediaLeft: boolean;
  index: number;
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

export function GeolocationToolsLayout({
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

  const howH = at(blocks, locale, 4);
  const howBody = at(blocks, locale, 5);

  const whyH = at(blocks, locale, 6);
  const whyIntroBlock = at(blocks, locale, 7);

  const benefit1 = at(blocks, locale, 8);
  const benefit2 = at(blocks, locale, 9);
  const benefit3 = at(blocks, locale, 10);
  const benefit4 = at(blocks, locale, 11);

  const whichH = at(blocks, locale, 12);
  const whichBody = at(blocks, locale, 13);

  const seeMore = at(blocks, locale, 14);

  const heroTitle = headingText(pageTitle) || title;

  const whatHeading = headingText(whatH);
  const whatHtml = proseHtml(whatBody);

  const howHeading = headingText(howH);
  const howHtml = proseHtml(howBody);

  const whyHeading = headingText(whyH);
  const whyIntro = bodyText(whyIntroBlock) || stripHtml(whyIntroBlock?.text.bodyHtml);

  const benefits = [benefit1, benefit2, benefit3, benefit4]
    .filter((b): b is ResolvedBlock => Boolean(b))
    .map((b) => ({ title: headingText(b), desc: bodyText(b) }))
    .filter((b) => b.title || b.desc);

  const whichHeading = headingText(whichH);
  const whichHtml = proseHtml(whichBody);

  const seeMoreLabel =
    seeMore?.text.ctaLabel?.trim() || seeMore?.text.links[0]?.label?.trim() || "";
  /** The CMS "See More" CTA always points to the constractor solution page
   * (locale-suffixed legacy slugs like `/constractor-da/`) — map it straight
   * to the in-app route rather than parsing the raw legacy URL. */
  const seeMoreHref = withLocale(locale, "/solutions/constractor");

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
        </div>

        {(howHeading || howHtml) && (
          <section className={styles.how}>
            {howHeading ? (
              <Reveal>
                <h2 className={`${p.display} ${styles.sectionTitle}`}>
                  {howHeading}
                </h2>
              </Reveal>
            ) : null}
            {howHtml ? (
              <Reveal delay={0.05} className={styles.howProse}>
                <div dangerouslySetInnerHTML={{ __html: howHtml }} />
              </Reveal>
            ) : null}
          </section>
        )}

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

        {(whichHeading || whichHtml || seeMoreLabel) && (
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
            {seeMoreLabel ? (
              <Reveal delay={0.08} className={styles.whichCta}>
                <DemoCta href={seeMoreHref || contactHref} label={seeMoreLabel} variant="ghost" />
              </Reveal>
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

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
  Bluetooth,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import styles from "./DoorOpeningLayout.module.css";

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

type Benefit = { title: string; desc: string };

const BENEFIT_ICONS = [ShieldCheck, Bluetooth, BatteryCharging, Wrench];

/**
 * The "why integrate magnetic sensors" body mixes one lead paragraph with
 * four alternating title/description paragraphs (CMS rich text, no
 * dedicated list block) — split it into a real benefit list.
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

function ProductCard({
  heading,
  html,
  image,
  delay,
}: {
  heading: string;
  html: string;
  image: ResolvedBlock | null;
  delay: number;
}) {
  if (!heading && !html && !image) return null;
  return (
    <Reveal delay={delay} className={styles.productCard}>
      {image ? (
        <div className={styles.productShot}>
          <BlockMedia block={image} className={styles.productImg} />
        </div>
      ) : null}
      <div className={styles.productBody}>
        {heading ? (
          <h3 className={`${p.display} ${styles.productTitle}`}>{heading}</h3>
        ) : null}
        {html ? (
          <div
            className={styles.productProse}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : null}
      </div>
    </Reveal>
  );
}

export function DoorOpeningLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  const pageTitle = at(blocks, locale, 0);

  const introH = at(blocks, locale, 1);
  const introBody = at(blocks, locale, 2);

  const whatH = at(blocks, locale, 3);
  const whatBody = at(blocks, locale, 4);
  const whatImg = at(blocks, locale, 5);

  const howImg = at(blocks, locale, 6);
  const howH = at(blocks, locale, 7);
  const howBody = at(blocks, locale, 8);

  const whyH = at(blocks, locale, 9);
  const whyBody = at(blocks, locale, 10);

  const whichH = at(blocks, locale, 11);
  const whichBody = at(blocks, locale, 12);

  const coinH = at(blocks, locale, 13);
  const coinBody = at(blocks, locale, 14);
  const coinImg = at(blocks, locale, 15);

  const puckH = at(blocks, locale, 16);
  const puckBody = at(blocks, locale, 17);
  const puckImg = at(blocks, locale, 18);

  const heroTitle = headingText(pageTitle) || title;
  const introHeading = headingText(introH);
  const introHtml = proseHtml(introBody);

  const whatHeading = headingText(whatH);
  const whatHtml = proseHtml(whatBody);
  const howHeading = headingText(howH);
  const howHtml = proseHtml(howBody);

  const whyHeading = headingText(whyH);
  const { intro: whyIntro, items: benefits } = parseBenefits(whyBody);

  const whichHeading = headingText(whichH);
  const whichHtml = proseHtml(whichBody);

  const coinHeading = headingText(coinH);
  const coinHtml = proseHtml(coinBody);
  const puckHeading = headingText(puckH);
  const puckHtml = proseHtml(puckBody);

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

        {(introHeading || introHtml) && (
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
            </Reveal>
          </section>
        )}

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
          />
        </div>

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

        {(whichHeading || whichHtml) && (
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
          </section>
        )}

        {(coinHeading || puckHeading) && (
          <div className={styles.products}>
            <ProductCard
              heading={coinHeading}
              html={coinHtml}
              image={coinImg}
              delay={0.05}
            />
            <ProductCard
              heading={puckHeading}
              html={puckHtml}
              image={puckImg}
              delay={0.1}
            />
          </div>
        )}

        <div className={styles.ctaRow}>
          <DemoCta href={contactHref} label={requestDemoLabel} />
        </div>
      </Wrap>
    </SolutionShell>
  );
}

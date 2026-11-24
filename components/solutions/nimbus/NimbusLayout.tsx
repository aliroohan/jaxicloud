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
import { Check } from "lucide-react";
import styles from "./NimbusLayout.module.css";

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

type ZigRow = {
  key: string;
  mediaLeft: boolean;
  heading: ResolvedBlock | null;
  body: ResolvedBlock | null;
  image: ResolvedBlock | null;
};

function ZigFeatureRow({
  row,
  index,
}: {
  row: ZigRow;
  index: number;
}) {
  const h = headingText(row.heading);
  const html = proseHtml(row.body);
  const hasMedia = Boolean(
    row.image &&
      (row.image.block.images[0]?.src || row.image.block.layout.image),
  );
  if (!h && !html && !hasMedia) return null;

  const mediaClass = row.mediaLeft
    ? styles.zigMediaLeft
    : styles.zigMediaRight;

  // Media enters from its side; copy from the opposite — scroll-elevated zig.
  const mediaFrom = row.mediaLeft ? "left" : "right";
  const copyFrom = row.mediaLeft ? "right" : "left";
  const mediaDelay = 0.02 + index * 0.03;
  const copyDelay = 0.1 + index * 0.03;

  return (
    <section
      className={`${styles.zigRow} ${mediaClass}`}
      aria-labelledby={h ? `nimbus-zig-${row.key}` : undefined}
    >
      <Reveal
        delay={copyDelay}
        from={copyFrom}
        className={styles.copySlot}
      >
        <div className={styles.copy}>
          {h ? (
            <h3
              id={`nimbus-zig-${row.key}`}
              className={`${p.display} ${styles.zigHeading}`}
            >
              {h}
            </h3>
          ) : null}
          {html ? (
            <div
              className={styles.zigProse}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : null}
        </div>
      </Reveal>
      <Reveal delay={mediaDelay} from={mediaFrom} className={styles.mediaSlot}>
        {row.image ? (
          <BlockMedia
            block={row.image}
            className={styles.mediaFrame}
            priority={index === 0}
          />
        ) : null}
      </Reveal>
    </section>
  );
}

export function NimbusLayout({
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

  const howH = at(blocks, locale, 4);
  const howList = at(blocks, locale, 5);

  const funcsH = at(blocks, locale, 6);

  // Zig-zag: Handling stop | Route management | Planning | Online tracking
  const zigRows: ZigRow[] = [
    {
      key: "stops",
      mediaLeft: true,
      image: at(blocks, locale, 7),
      heading: at(blocks, locale, 8),
      body: at(blocks, locale, 9),
    },
    {
      key: "routes",
      mediaLeft: false,
      heading: at(blocks, locale, 10),
      body: at(blocks, locale, 11),
      image: at(blocks, locale, 12),
    },
    {
      key: "planning",
      mediaLeft: true,
      image: at(blocks, locale, 13),
      heading: at(blocks, locale, 14),
      body: at(blocks, locale, 15),
    },
    {
      key: "tracking",
      mediaLeft: false,
      heading: at(blocks, locale, 16),
      body: at(blocks, locale, 17),
      image: at(blocks, locale, 18),
    },
  ];

  const heroTitle = headingText(pageTitle) || title;
  const introHeading = headingText(introH);
  const introHtml = proseHtml(introBody);
  const howHeading = headingText(howH);
  const howItems = howList?.text.listItems ?? [];
  const funcsHeading = headingText(funcsH);

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
                <BlockMedia
                  block={introImg}
                  className={styles.introFrame}
                  priority
                />
              </Reveal>
            ) : null}
          </section>
        </Wrap>
      )}

      {(howHeading || howItems.length > 0) && (
        <Wrap>
          <section className={styles.how}>
            {howHeading ? (
              <Reveal>
                <h2 className={`${p.display} ${styles.sectionTitle}`}>
                  {howHeading}
                </h2>
              </Reveal>
            ) : null}
            {howItems.length > 0 ? (
              <ul className={styles.checkList}>
                {howItems.map((item, i) => (
                  <Reveal
                    key={item}
                    as="li"
                    delay={0.04 + i * 0.05}
                    className={styles.checkItem}
                  >
                    <span className={styles.checkIcon} aria-hidden>
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </Reveal>
                ))}
              </ul>
            ) : null}
          </section>
        </Wrap>
      )}

      {(funcsHeading || zigRows.some((r) => headingText(r.heading))) && (
        <Wrap>
          <section className={styles.funcs}>
            {funcsHeading ? (
              <Reveal>
                <h2 className={`${p.display} ${styles.sectionTitle}`}>
                  {funcsHeading}
                </h2>
              </Reveal>
            ) : null}
            <div className={styles.zig}>
              {zigRows.map((row, i) => (
                <ZigFeatureRow key={row.key} row={row} index={i} />
              ))}
            </div>
          </section>
        </Wrap>
      )}
    </SolutionShell>
  );
}

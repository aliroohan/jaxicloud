import {
  bodyText,
  headingText,
  resolve,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
  BlockProse,
  Breadcrumb,
  DemoCta,
  Eyebrow,
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
import styles from "./FuelManagementLayout.module.css";

/** Resolve a block by stable `order` so layout mapping stays locale-agnostic. */
function at(
  blocks: SolutionLayoutProps["page"]["blocks"],
  locale: SolutionLayoutProps["locale"],
  order: number,
): ResolvedBlock | null {
  const block = blocks.find((b) => b.order === order);
  return block ? resolve(block, locale) : null;
}

export function FuelManagementLayout({
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
  const subheading = at(blocks, locale, 1);
  const introBody = at(blocks, locale, 2);

  const stats = [3, 4, 5]
    .map((order) => at(blocks, locale, order))
    .filter((b): b is ResolvedBlock => Boolean(b));

  const monitorHeading = at(blocks, locale, 6);
  const monitorBody = at(blocks, locale, 7);

  const rowOneImages = [8, 10]
    .map((order) => at(blocks, locale, order))
    .filter((b): b is ResolvedBlock => Boolean(b));
  const rowOneCaptions = [9, 11]
    .map((order) => at(blocks, locale, order))
    .filter((b): b is ResolvedBlock => Boolean(b));

  const rowTwoImages = [12, 13]
    .map((order) => at(blocks, locale, order))
    .filter((b): b is ResolvedBlock => Boolean(b));
  const rowTwoCaptions = [14, 15]
    .map((order) => at(blocks, locale, order))
    .filter((b): b is ResolvedBlock => Boolean(b));

  const closeBody = at(blocks, locale, 16);
  const closeImage = at(blocks, locale, 17);

  const heroTitle = headingText(pageTitle) || title;

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
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.04}>
            <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
          </Reveal>

          {(headingText(subheading) || introBody) && (
            <div className={styles.introBlock}>
              {headingText(subheading) ? (
                <Reveal delay={0.08}>
                  <h2 className={`${p.display} ${styles.subheading}`}>
                    {headingText(subheading)}
                  </h2>
                </Reveal>
              ) : null}
              {introBody ? (
                <Reveal delay={0.12} className={styles.introProse}>
                  <BlockProse block={introBody} />
                </Reveal>
              ) : null}
              <Reveal delay={0.16}>
                <div className={styles.heroCta}>
                  <DemoCta href={contactHref} label={requestDemoLabel} />
                </div>
              </Reveal>
            </div>
          )}
        </section>
      </Wrap>

      {stats.length > 0 ? (
        <section className={styles.stats}>
          <Wrap>
            <div className={styles.statsGrid}>
              {stats.map((s, i) => (
                <Reveal
                  key={s.block.id}
                  delay={0.04 * i}
                  className={`${styles.statCell}${i === 0 ? ` ${styles.statCellLead}` : ""}`}
                >
                  <span className={styles.statValue}>
                    {s.block.statValue || "—"}
                  </span>
                  {headingText(s) ? (
                    <span className={styles.statLabel}>{headingText(s)}</span>
                  ) : null}
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>
      ) : null}

      {(headingText(monitorHeading) || monitorBody) && (
        <Wrap>
          <section className={styles.monitorIntro}>
            {headingText(monitorHeading) ? (
              <Reveal>
                <h2 className={`${p.display} ${styles.monitorTitle}`}>
                  {headingText(monitorHeading)}
                </h2>
              </Reveal>
            ) : null}
            {monitorBody ? (
              <Reveal delay={0.06} className={styles.monitorLead}>
                <BlockProse block={monitorBody} />
              </Reveal>
            ) : null}
          </section>
        </Wrap>
      )}

      {rowOneImages.length > 0 && (
        <Wrap>
          <section className={styles.shotSection}>
            <div className={styles.shotGrid}>
              {rowOneImages.map((img, i) => (
                <Reveal key={img.block.id} delay={0.04 * i} className={styles.shotCell}>
                  <BlockMedia block={img} className={styles.shot} />
                </Reveal>
              ))}
            </div>
            {rowOneCaptions.length > 0 ? (
              <div className={styles.captionGrid}>
                {rowOneCaptions.map((cap, i) => (
                  <Reveal
                    key={cap.block.id}
                    delay={0.06 + 0.04 * i}
                    className={styles.caption}
                  >
                    <BlockProse block={cap} />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </section>
        </Wrap>
      )}

      {rowTwoImages.length > 0 && (
        <Wrap>
          <section className={styles.shotSection}>
            <div className={styles.shotGrid}>
              {rowTwoImages.map((img, i) => (
                <Reveal key={img.block.id} delay={0.04 * i} className={styles.shotCell}>
                  <BlockMedia block={img} className={styles.shot} />
                </Reveal>
              ))}
            </div>
            {rowTwoCaptions.length > 0 ? (
              <div className={styles.captionGrid}>
                {rowTwoCaptions.map((cap, i) => (
                  <Reveal
                    key={cap.block.id}
                    delay={0.06 + 0.04 * i}
                    className={styles.caption}
                  >
                    <BlockProse block={cap} />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </section>
        </Wrap>
      )}

      {(closeBody || closeImage) && (
        <Wrap>
          <section className={styles.close}>
            <Reveal className={styles.closeCopy}>
              {closeBody ? <BlockProse block={closeBody} /> : null}
              <div className={styles.closeActions}>
                <DemoCta href={contactHref} label={requestDemoLabel} variant="ghost" />
              </div>
            </Reveal>
            {closeImage ? (
              <Reveal delay={0.06} className={styles.closeMediaWrap}>
                <BlockMedia block={closeImage} className={styles.closeMedia} />
              </Reveal>
            ) : null}
          </section>
        </Wrap>
      )}
    </SolutionShell>
  );
}

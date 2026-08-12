import {
  bodyText,
  headingText,
  resolveAll,
  sectionize,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
  BlockProse,
  Breadcrumb,
  DemoCta,
  Eyebrow,
  SolutionShell,
  StatItem,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type { SolutionLayoutProps } from "@/components/solutions/shared/types";
import { Reveal } from "@/components/blocks/Motion";
import { withLocale } from "@/lib/i18n/config";
import styles from "./FuelManagementLayout.module.css";

const ATMOSPHERE = "/images/solutions/fuel-hero-atmosphere.png";

export function FuelManagementLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;
  const sections = sectionize(blocks, locale);

  const heroSection = sections[0];
  const heroHeading =
    headingText(heroSection?.heading) ||
    headingText(sections[1]?.heading) ||
    title;
  const heroBody =
    bodyText(heroSection?.bodies[0]) ||
    bodyText(sections[1]?.bodies[0]) ||
    "";

  const stats = resolveAll(
    blocks.filter((b) => b.type === "statCounter"),
    locale,
  );

  const monitoring =
    sections.find((s) =>
      headingText(s.heading).toLowerCase().includes("fuel"),
    ) ||
    sections[2] ||
    sections[1];

  const narrativeBodies = sections
    .flatMap((s) => s.bodies)
    .filter((b) => bodyText(b).length > 40);
  const images = resolveAll(
    blocks.filter((b) => b.type === "image"),
    locale,
  );

  const zigPairs = [
    { body: narrativeBodies[1], image: images[0], flip: false },
    { body: narrativeBodies[2], image: images[1], flip: true },
    { body: narrativeBodies[3], image: images[2], flip: false },
  ].filter((pair) => pair.body || pair.image);

  const darkBodies = narrativeBodies.slice(4, 6);
  const darkImages = images.slice(2, 4);
  const closeBody = narrativeBodies[narrativeBodies.length - 1];
  const closeImage = images[images.length - 1];

  return (
    <SolutionShell className={styles.page}>
      <Wrap>
        <Breadcrumb
          localeHref={withLocale(locale, "/solutions")}
          label={eyebrow}
          title={title}
        />
      </Wrap>

      <section className={styles.hero}>
        <div className={styles.heroBg}>
          {/* Decorative art-direction asset; copy remains i18n from JSON */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ATMOSPHERE}
            alt=""
            className={styles.heroBgImg}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
              objectFit: "cover",
              objectPosition: "70% center",
            }}
          />
          <div className={styles.heroScrim} />
        </div>
        <Wrap>
          <div className={styles.heroInner}>
            <Eyebrow light>{eyebrow}</Eyebrow>
            <h1 className={`${p.display} ${styles.heroTitle}`}>{heroHeading}</h1>
            {heroBody ? <p className={styles.heroBody}>{heroBody}</p> : null}
            <div className={styles.heroCta}>
              <DemoCta
                href={contactHref}
                label={requestDemoLabel}
                variant="onDark"
              />
            </div>
          </div>
        </Wrap>
      </section>

      {stats.length > 0 ? (
        <section className={styles.stats}>
          <Wrap>
            <div className={styles.statsGrid}>
              {stats.map((s) => (
                <Reveal key={s.block.id} className={styles.statCell}>
                  <StatItem block={s} />
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>
      ) : null}

      {sections[1]?.heading || sections[1]?.bodies[0] ? (
        <Wrap>
          <section className={styles.intro}>
            <Reveal>
              <h2 className={`${p.display} ${styles.introTitle}`}>
                {headingText(sections[1]?.heading) || heroHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              {sections[1]?.bodies[0] ? (
                <BlockProse block={sections[1].bodies[0]} />
              ) : null}
            </Reveal>
          </section>
        </Wrap>
      ) : null}

      {monitoring ? (
        <Wrap>
          <section className={styles.monitor}>
            <div className={styles.monitorGrid}>
              {images[0] ? (
                <Reveal>
                  <BlockMedia block={images[0]} className={styles.monitorMedia} />
                </Reveal>
              ) : null}
              <Reveal className={styles.monitorCopy} delay={0.06}>
                {headingText(monitoring.heading) ? (
                  <h2 className={p.display}>{headingText(monitoring.heading)}</h2>
                ) : null}
                {monitoring.bodies[0] ? (
                  <div className={styles.lead}>
                    <BlockProse block={monitoring.bodies[0]} />
                  </div>
                ) : null}
              </Reveal>
            </div>
          </section>
        </Wrap>
      ) : null}

      {zigPairs.length > 0 ? (
        <Wrap>
          <section className={styles.zig}>
            {zigPairs.map((pair, i) => (
              <div
                key={pair.body?.block.id || pair.image?.block.id || i}
                className={`${styles.zigRow} ${pair.flip ? styles.zigRowFlip : ""}`}
              >
                {pair.image ? (
                  <Reveal>
                    <BlockMedia block={pair.image} className={styles.zigMedia} />
                  </Reveal>
                ) : (
                  <div />
                )}
                <Reveal delay={0.05} className={styles.zigCopy}>
                  {pair.body ? <BlockProse block={pair.body} /> : null}
                </Reveal>
              </div>
            ))}
          </section>
        </Wrap>
      ) : null}

      {(darkBodies.length > 0 || darkImages.length > 0) && (
        <section className={styles.darkBand}>
          <Wrap>
            {darkBodies[0] ? (
              <>
                <Reveal>
                  <h2 className={`${p.display} ${styles.darkTitle}`}>
                    {headingText(monitoring?.heading) || title}
                  </h2>
                </Reveal>
                <Reveal delay={0.06}>
                  <p className={styles.darkBody}>{bodyText(darkBodies[0])}</p>
                </Reveal>
              </>
            ) : null}
            {darkBodies[1] ? (
              <Reveal delay={0.1}>
                <p className={styles.darkBody} style={{ marginTop: "1rem" }}>
                  {bodyText(darkBodies[1])}
                </p>
              </Reveal>
            ) : null}
            {darkImages.length > 0 ? (
              <div className={styles.darkMedia}>
                {darkImages[0] ? (
                  <Reveal>
                    <BlockMedia block={darkImages[0]} className={styles.darkShot} />
                  </Reveal>
                ) : null}
                {darkImages[1] ? (
                  <Reveal delay={0.08}>
                    <BlockMedia
                      block={darkImages[1]}
                      className={styles.darkShotTall}
                    />
                  </Reveal>
                ) : null}
              </div>
            ) : null}
          </Wrap>
        </section>
      )}

      {(closeBody || closeImage) && (
        <Wrap>
          <section className={styles.close}>
            <Reveal>
              {closeBody ? <BlockProse block={closeBody} /> : null}
              <div className={styles.closeActions}>
                <DemoCta href={contactHref} label={requestDemoLabel} />
              </div>
            </Reveal>
            {closeImage ? (
              <Reveal delay={0.06}>
                <BlockMedia block={closeImage} className={styles.closeMedia} />
              </Reveal>
            ) : null}
          </section>
        </Wrap>
      )}
    </SolutionShell>
  );
}

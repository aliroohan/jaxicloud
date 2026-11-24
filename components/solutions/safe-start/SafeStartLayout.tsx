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
  IconList,
  SolutionShell,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type { SolutionLayoutProps } from "@/components/solutions/shared/types";
import { withLocale } from "@/lib/i18n/config";
import styles from "./SafeStartLayout.module.css";

export function SafeStartLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const sections = sectionize(page.blocks, locale);
  const images = resolveAll(
    page.blocks.filter((b) => b.type === "image"),
    locale,
  );
  const lists = resolveAll(
    page.blocks.filter((b) => b.type === "iconList"),
    locale,
  );

  const heroTitle = headingText(sections[0]?.heading) || title;
  const heroBody =
    bodyText(sections[0]?.bodies[0]) || bodyText(sections[1]?.bodies[0]) || "";

  // First hero image
  const heroImage = images[0];

  // Content sections (skip section 0 = hero)
  const contentSections = sections.slice(1);

  return (
    <SolutionShell className={styles.page}>
      {/* Breadcrumb */}
      <Wrap>
        <Breadcrumb
          localeHref={withLocale(locale, "/applications")}
          label={eyebrow}
          title={title}
        />
      </Wrap>

      {/* Hero — split layout: text left, image right */}
      <section className={styles.hero}>
        <Wrap>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className={`${p.display} ${styles.heroTitle}`}>{heroTitle}</h1>
              {heroBody && (
                <p className={styles.heroBody}>{heroBody}</p>
              )}
              <div className={styles.heroFeatures}>
                <span className={styles.chip}>📋 Vehicle Inspection</span>
                <span className={styles.chip}>📱 Mobile App</span>
                <span className={styles.chip}>🖥 Web Dashboard</span>
              </div>
              <div className={styles.heroCtas}>
                <DemoCta href={contactHref} label={requestDemoLabel} />
              </div>
            </div>
            {heroImage && (
              <div className={styles.heroImage}>
                <BlockMedia block={heroImage} className={styles.heroShot} priority />
              </div>
            )}
          </div>
        </Wrap>
      </section>

      {/* Content sections — alternating with images */}
      {contentSections.length > 0 && (
        <section className={styles.sections}>
          <Wrap>
            {contentSections.map((sec, i) => {
              const h = headingText(sec.heading);
              const sectionImages = sec.images.length > 0
                ? sec.images
                : [images[i + 1]].filter(Boolean);
              const hasImage = sectionImages.length > 0;

              return (
                <div
                  key={sec.heading?.block.id || i}
                  className={`${styles.secRow} ${i % 2 === 1 ? styles.secFlip : ""}`}
                >
                  <div className={styles.secText}>
                    {h && (
                      <h2 className={`${p.display} ${styles.secH2}`}>{h}</h2>
                    )}
                    {sec.bodies.map((b) => (
                      <div key={b.block.id} className={styles.bodyWrap}>
                        <BlockProse block={b} />
                      </div>
                    ))}
                    {sec.list && (
                      <div className={styles.listWrap}>
                        <IconList block={sec.list} />
                      </div>
                    )}
                  </div>
                  {hasImage ? (
                    <div className={styles.secMedia}>
                      <BlockMedia
                        block={sectionImages[0]!}
                        className={styles.secShot}
                      />
                    </div>
                  ) : (
                    <div className={styles.secFill} />
                  )}
                </div>
              );
            })}
          </Wrap>
        </section>
      )}

      {/* Icon lists (checklists) */}
      {lists.length > 0 && (
        <section className={styles.checkSection}>
          <Wrap>
            <h2 className={`${p.display} ${styles.checkHeading}`}>
              What Safe Start covers
            </h2>
            <div className={styles.checkGrid}>
              {lists.map((l) => (
                <div key={l.block.id} className={styles.checkCard}>
                  <IconList block={l} />
                </div>
              ))}
            </div>
          </Wrap>
        </section>
      )}

      {/* CTA */}
      <section className={styles.ctaSection}>
        <Wrap>
          <div className={styles.ctaBox}>
            <div>
              <h2 className={`${p.display} ${styles.ctaTitle}`}>
                Start your vehicle inspection journey
              </h2>
              <p className={styles.ctaSub}>
                Reduce risk, ensure compliance, and improve driver accountability with Safe Start.
              </p>
            </div>
            <DemoCta href={contactHref} label={requestDemoLabel} />
          </div>
        </Wrap>
      </section>
    </SolutionShell>
  );
}

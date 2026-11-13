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
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type { SolutionLayoutProps } from "@/components/solutions/shared/types";
import { withLocale } from "@/lib/i18n/config";
import styles from "./TachoLiveLayout.module.css";

export function TachoLiveLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const sections = sectionize(page.blocks, locale);
  const images = resolveAll(
    page.blocks.filter((b) => b.type === "image" || b.type === "gallery"),
    locale,
  );

  const heroTitle = headingText(sections[0]?.heading) || title;

  // Section 1 = intro with 2-col layout (text + images)
  const introSec = sections[1];
  const introHeading = headingText(introSec?.heading);
  const introBodies = introSec?.bodies ?? [];

  // Remaining sections = cascading content (Tacho Manager, Tacho View, etc.)
  const contentSections = sections.slice(2);

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

      {/* Hero */}
      <section className={styles.hero}>
        <Wrap>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={`${p.display} ${styles.heroTitle}`}>{heroTitle}</h1>
          <p className={styles.heroSub}>
            Complete tachograph compliance &amp; driver time management — fully integrated.
          </p>
        </Wrap>
        <div className={styles.heroDeco} aria-hidden>
          <span className={styles.decoCircle} />
          <span className={styles.decoBar} />
        </div>
      </section>

      {/* Intro: 2-col text + images stacked */}
      {introSec && (
        <section className={styles.introSection}>
          <Wrap>
            <div className={styles.introGrid}>
              {/* Left: text */}
              <div className={styles.introText}>
                {introHeading && (
                  <h2 className={`${p.display} ${styles.sectionH2}`}>
                    {introHeading}
                  </h2>
                )}
                {introBodies.map((b) => (
                  <div key={b.block.id} className={styles.bodyWrap}>
                    <BlockProse block={b} />
                  </div>
                ))}
                <div className={styles.ctaRow}>
                  <DemoCta href={contactHref} label={requestDemoLabel} />
                </div>
              </div>
              {/* Right: images */}
              <div className={styles.introImages}>
                {images.slice(0, 2).map((img) => (
                  <BlockMedia
                    key={img.block.id}
                    block={img}
                    className={styles.introShot}
                    priority
                  />
                ))}
              </div>
            </div>
          </Wrap>
        </section>
      )}

      {/* Feature divider */}
      <div className={styles.divider} aria-hidden />

      {/* Content sections — alternating left/right */}
      {contentSections.length > 0 && (
        <section className={styles.cascade}>
          <Wrap>
            {contentSections.map((sec, i) => (
              <div
                key={sec.heading?.block.id || i}
                className={`${styles.cascadeRow} ${i % 2 === 1 ? styles.cascadeFlip : ""}`}
              >
                {/* Text column */}
                <div className={styles.cascadeText}>
                  {headingText(sec.heading) && (
                    <div className={styles.sectionLabel} aria-hidden>
                      {i + 1 < 10 ? `0${i + 1}` : `${i + 1}`}
                    </div>
                  )}
                  {headingText(sec.heading) && (
                    <h2 className={`${p.display} ${styles.cascadeH2}`}>
                      {headingText(sec.heading)}
                    </h2>
                  )}
                  {sec.bodies.map((b) => (
                    <div key={b.block.id} className={styles.bodyWrap}>
                      <BlockProse block={b} />
                    </div>
                  ))}
                </div>
                {/* Media column */}
                <div className={styles.cascadeMedia}>
                  {sec.images[0] ? (
                    <BlockMedia block={sec.images[0]} className={styles.cascadeShot} />
                  ) : images[i + 2] ? (
                    <BlockMedia block={images[i + 2]} className={styles.cascadeShot} />
                  ) : (
                    <div className={styles.cascadePlaceholder}>
                      <div className={styles.placeholderDot} aria-hidden />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Wrap>
        </section>
      )}

      {/* Stats / highlights strip */}
      <section className={styles.statsBand}>
        <Wrap>
          <div className={styles.statsGrid}>
            {[
              { value: "EU", label: "Regulation Compliant" },
              { value: "30d", label: "Driver Activity History" },
              { value: "DDD", label: "File Download Support" },
              { value: "Live", label: "Real-time Status Tracking" },
            ].map((s) => (
              <div key={s.label} className={styles.statItem}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <Wrap>
          <div className={styles.ctaInner}>
            <h2 className={`${p.display} ${styles.ctaTitle}`}>
              Keep your fleet tachograph-compliant
            </h2>
            <DemoCta href={contactHref} label={requestDemoLabel} />
          </div>
        </Wrap>
      </section>
    </SolutionShell>
  );
}

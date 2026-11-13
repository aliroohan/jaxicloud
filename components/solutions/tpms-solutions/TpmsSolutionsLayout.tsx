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
import Image from "next/image";
import styles from "./TpmsSolutionsLayout.module.css";

export function TpmsSolutionsLayout({
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
  const galleryBlocks = page.blocks.filter((b) => b.type === "gallery");
  const galleryImages: string[] = [];
  for (const g of galleryBlocks) {
    for (const img of g.images) {
      if (img.src) galleryImages.push(img.src);
    }
  }

  const heroTitle = headingText(sections[0]?.heading) || title;
  const introSec = sections[1];
  const introHeading = headingText(introSec?.heading);
  const introBodies = introSec?.bodies ?? [];
  const introImage = images[0];

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

      {/* Hero — light with accent stripe */}
      <section className={styles.hero}>
        <Wrap>
          <div className={styles.heroContent}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={`${p.display} ${styles.heroTitle}`}>{heroTitle}</h1>
            <p className={styles.heroSub}>
              Advanced tire pressure monitoring to prevent blowouts and keep your fleet safe.
            </p>
            <div className={styles.heroBadges}>
              <span className={styles.badge}>🛞 Blowout Prevention</span>
              <span className={styles.badge}>🌡 Heat Monitoring</span>
              <span className={styles.badge}>📡 Real-time Alerts</span>
            </div>
          </div>
        </Wrap>
        <div className={styles.heroStripe} aria-hidden />
      </section>

      {/* Intro: text + image side-by-side */}
      {introSec && (
        <section className={styles.introSection}>
          <Wrap>
            <div className={styles.introGrid}>
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
              {introImage && (
                <BlockMedia
                  block={introImage}
                  className={styles.introShot}
                  priority
                />
              )}
            </div>
          </Wrap>
        </section>
      )}

      {/* Additional content sections */}
      {contentSections.length > 0 && (
        <section className={styles.contentSection}>
          <Wrap>
            {contentSections.map((sec, i) => (
              <div key={sec.heading?.block.id || i} className={styles.contentBlock}>
                {headingText(sec.heading) && (
                  <h2 className={`${p.display} ${styles.contentH2}`}>
                    {headingText(sec.heading)}
                  </h2>
                )}
                {sec.bodies.map((b) => (
                  <div key={b.block.id} className={styles.bodyWrap}>
                    <BlockProse block={b} />
                  </div>
                ))}
              </div>
            ))}
          </Wrap>
        </section>
      )}

      {/* Gallery grid */}
      {galleryImages.length > 0 && (
        <section className={styles.gallerySection}>
          <Wrap wide>
            <h2 className={`${p.display} ${styles.galleryHeading}`}>
              TPMS in Action
            </h2>
            <div className={styles.galleryGrid}>
              {galleryImages.slice(0, 9).map((src, i) => (
                <div key={i} className={styles.galleryItem}>
                  <Image
                    src={src}
                    alt={`TPMS product ${i + 1}`}
                    fill
                    sizes="(max-width: 700px) 50vw, 33vw"
                    className={styles.galleryImg}
                  />
                </div>
              ))}
            </div>
          </Wrap>
        </section>
      )}

      {/* CTA */}
      <section className={styles.ctaSection}>
        <Wrap>
          <div className={styles.ctaInner}>
            <div>
              <h2 className={`${p.display} ${styles.ctaTitle}`}>
                Protect your fleet with TPMS
              </h2>
              <p className={styles.ctaSub}>
                Real-time tire pressure and temperature monitoring for every vehicle in your fleet.
              </p>
            </div>
            <DemoCta href={contactHref} label={requestDemoLabel} />
          </div>
        </Wrap>
      </section>
    </SolutionShell>
  );
}

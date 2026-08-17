import {
  bodyText,
  headingText,
  resolveAll,
  sectionize,
} from "@/components/solutions/shared/content";
import {
  BlockProse,
  Breadcrumb,
  DemoCta,
  Eyebrow,
  FeatureTile,
  SolutionShell,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type { SolutionLayoutProps } from "@/components/solutions/shared/types";
import { withLocale } from "@/lib/i18n/config";
import styles from "./ClickConnectLayout.module.css";

export function ClickConnectLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const sections = sectionize(page.blocks, locale);
  const features = resolveAll(
    page.blocks.filter((b) => b.type === "featureCard"),
    locale,
  );
  const heroTitle = headingText(sections[0]?.heading) || title;
  const introSec = sections[1];
  const introHeading = headingText(introSec?.heading);
  const introBodies = introSec?.bodies ?? [];

  // Group features into rows of 3 (by columnCount)
  const rows: typeof features[] = [];
  let current: typeof features = [];
  for (const f of features) {
    current.push(f);
    if (f.block.layout.columnIndex === f.block.layout.columnCount - 1) {
      rows.push(current);
      current = [];
    }
  }
  if (current.length) rows.push(current);

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

      {/* Hero band */}
      <section className={styles.hero}>
        <Wrap>
          <div className={styles.heroPill}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={`${p.display} ${styles.heroTitle}`}>{heroTitle}</h1>
            <p className={styles.heroSub}>
              Register your tracking devices instantly — new or existing customer.
            </p>
          </div>
        </Wrap>
        {/* Decorative circles */}
        <div className={styles.deco} aria-hidden>
          <span className={styles.decoA} />
          <span className={styles.decoB} />
        </div>
      </section>

      {/* Intro content */}
      {(introHeading || introBodies.length > 0) && (
        <section className={styles.intro}>
          <Wrap>
            <div className={styles.introGrid}>
              <div>
                {introHeading && (
                  <h2 className={`${p.display} ${styles.sectionH2}`}>
                    {introHeading}
                  </h2>
                )}
                {introBodies.map((b) => (
                  <div key={b.block.id} className={styles.proseWrap}>
                    <BlockProse block={b} />
                  </div>
                ))}
              </div>
              {/* Visual accent card */}
              <div className={styles.accentCard}>
                <div className={styles.accentIcon} aria-hidden>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="currentColor" opacity=".1" />
                    <path d="M13 20l5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className={styles.accentText}>
                  Connected in minutes — just enter your IMEI number and go.
                </p>
              </div>
            </div>
          </Wrap>
        </section>
      )}

      {/* Feature steps grid */}
      {rows.length > 0 && (
        <section className={styles.stepsSection}>
          <Wrap>
            <p className={`${p.display} ${styles.stepsHeading}`}>
              How it works
            </p>
            {rows.map((row, ri) => (
              <div key={ri} className={styles.stepsRow}>
                {row.map((f, fi) => (
                  <div key={f.block.id} className={styles.stepCard}>
                    <div className={styles.stepNumber} aria-hidden>
                      {ri * 3 + fi + 1}
                    </div>
                    <FeatureTile block={f} />
                  </div>
                ))}
              </div>
            ))}
          </Wrap>
        </section>
      )}

      {/* CTA band */}
      <section className={styles.ctaBand}>
        <Wrap>
          <div className={styles.ctaInner}>
            <h2 className={`${p.display} ${styles.ctaTitle}`}>
              Ready to get started?
            </h2>
            <p className={styles.ctaSub}>
              Register your devices and access full fleet management instantly.
            </p>
            <DemoCta href={contactHref} label={requestDemoLabel} />
          </div>
        </Wrap>
      </section>
    </SolutionShell>
  );
}

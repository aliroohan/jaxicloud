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
  const heroBody =
    bodyText(sections[0]?.bodies[0]) ||
    bodyText(sections[1]?.bodies[0]) ||
    "";

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
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
          {heroBody ? (
            <p className={p.body} style={{ marginTop: "1.1rem", maxWidth: "48ch" }}>
              {heroBody}
            </p>
          ) : null}
        </section>
        <div className={styles.cascade}>
          {sections.slice(1).map((sec, i) => (
            <div
              key={sec.heading?.block.id || i}
              className={`${styles.row} ${i % 2 === 1 ? styles.rowFlip : ""}`}
            >
              <div>
                {headingText(sec.heading) ? (
                  <h2
                    className={p.display}
                    style={{ fontSize: "clamp(1.6rem,3vw,2.25rem)" }}
                  >
                    {headingText(sec.heading)}
                  </h2>
                ) : null}
                {sec.bodies.map((b) => (
                  <div key={b.block.id} style={{ marginTop: "1rem" }}>
                    <BlockProse block={b} />
                  </div>
                ))}
              </div>
              {sec.images[0] ? (
                <BlockMedia block={sec.images[0]} className={styles.shot} />
              ) : images[i] ? (
                <BlockMedia block={images[i]} className={styles.shot} />
              ) : (
                <div />
              )}
            </div>
          ))}
        </div>
        <div style={{ paddingBottom: "4rem" }}>
          <DemoCta href={contactHref} label={requestDemoLabel} />
        </div>
      </Wrap>
    </SolutionShell>
  );
}

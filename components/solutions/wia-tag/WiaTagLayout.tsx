import {
  bodyLines,
  headingText,
  resolveAll,
  sectionize,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
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
import styles from "./WiaTagLayout.module.css";

export function WiaTagLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const sections = sectionize(page.blocks, locale);
  const images = resolveAll(page.blocks.filter((b) => b.type === "image" || b.type === "gallery"), locale);
  const features = resolveAll(page.blocks.filter((b) => b.type === "featureCard"), locale);
  const heroTitle = headingText(sections[0]?.heading) || title;
  const introHeading = headingText(sections[1]?.heading);
  // Drop any line that just repeats the H1 (the CMS content authored it as a
  // redundant label directly above the real paragraph).
  const introLines = bodyLines(sections[1]?.bodies[0], heroTitle);

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
        <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>

        <section className={styles.hero}>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            {introHeading ? (
              <h2 className={`${p.display} ${styles.introHeading}`}>{introHeading}</h2>
            ) : null}
            {introLines.map((line, i) => (
              <p key={i} className={p.body} style={i === 0 ? undefined : { marginTop: "0.5rem" }}>
                {line}
              </p>
            ))}
            <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.shot} priority /> : null}
        </section>

        <div className={styles.wall}>
          {features.map((f) => (
            <div key={f.block.id} className={styles.cell}>
              <FeatureTile block={f} />
            </div>
          ))}
        </div>
      </Wrap>

    </SolutionShell>
  );
}

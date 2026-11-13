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
  FeatureTile,
  IconList,
  SolutionShell,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type { SolutionLayoutProps } from "@/components/solutions/shared/types";
import { withLocale } from "@/lib/i18n/config";
import styles from "./HecterraLayout.module.css";

export function HecterraLayout({
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
  // Prefer the section that actually has intro copy (block-3 lives on sections[1]).
  const intro =
    sections[0]?.bodies[0] ? sections[0] : sections[1] ?? sections[0];
  const heroTitle =
    headingText(intro?.heading) ||
    headingText(sections[0]?.heading) ||
    title;
  const heroBodyResolved = intro?.bodies[0] ?? null;
  const heroBody = bodyText(heroBodyResolved) || "";
  const heroBodyId = heroBodyResolved?.block.id;
  const heroHeadingId = intro?.heading?.block.id;

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
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
            {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.shot} priority /> : null}
        </section>
        <div className={styles.grid}>
          {features.map((f) => <div key={f.block.id} className={styles.card}><FeatureTile block={f} /></div>)}
        </div>
        <div className={styles.list}>
          {sections.slice(1).map((sec, i) => {
            // Skip intro richText (and its heading) already shown in the hero.
            const heading =
              sec.heading?.block.id === heroHeadingId
                ? ""
                : headingText(sec.heading);
            const bodies = sec.bodies.filter((b) => b.block.id !== heroBodyId);
            if (!heading && bodies.length === 0 && !sec.list) return null;
            return (
              <div key={sec.heading?.block.id || i} style={{marginBottom:"2rem"}}>
                {heading ? <h2 className={p.display} style={{fontSize:"1.6rem"}}>{heading}</h2> : null}
                {bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
                {sec.list ? <div style={{marginTop:"1rem"}}><IconList block={sec.list} /></div> : null}
              </div>
            );
          })}
          <DemoCta href={contactHref} label={requestDemoLabel} />
        </div>
      </Wrap>

    </SolutionShell>
  );
}

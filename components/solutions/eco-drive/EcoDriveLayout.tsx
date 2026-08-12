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
import styles from "./EcoDriveLayout.module.css";

export function EcoDriveLayout({
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
  const lists = resolveAll(page.blocks.filter((b) => b.type === "iconList"), locale);
  const heroTitle = headingText(sections[0]?.heading) || title;
  const heroBody = bodyText(sections[0]?.bodies[0]) || bodyText(sections[1]?.bodies[0]) || "";

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
        <div className={styles.scores}>
          {features.slice(0,6).map((f) => <div key={f.block.id} className={styles.score}><FeatureTile block={f} /></div>)}
        </div>
        <div className={styles.more}>
          {sections.slice(1).map((sec, i) => (
            <div key={sec.heading?.block.id || i} style={{marginBottom:"2rem"}}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.6rem"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
              {sec.images[0] ? <div style={{marginTop:"1rem"}}><BlockMedia block={sec.images[0]} className={styles.shot} /></div> : null}
            </div>
          ))}
          {features.slice(6).length > 0 ? (
            <div className={styles.scores} style={{marginTop:"1rem"}}>
              {features.slice(6).map((f) => <div key={f.block.id} className={styles.score}><FeatureTile block={f} /></div>)}
            </div>
          ) : null}
          <div style={{marginTop:"2rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
        </div>
      </Wrap>

    </SolutionShell>
  );
}

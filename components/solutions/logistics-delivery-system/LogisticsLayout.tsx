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
import styles from "./LogisticsLayout.module.css";

export function LogisticsLayout({
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
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
          {images[0] ? <div style={{marginTop:"2rem"}}><BlockMedia block={images[0]} className={styles.shot} /></div> : null}
        </section>
        {features.length > 0 ? (
          <div className={styles.featRow}>
            {features.map((f) => <FeatureTile key={f.block.id} block={f} />)}
          </div>
        ) : null}
        <div className={styles.mediaRow}>
          {images.slice(1,5).map((img) => <BlockMedia key={img.block.id} block={img} className={styles.shot} />)}
        </div>
        <div className={styles.timeline}>
          {sections.slice(2).filter(s => headingText(s.heading)).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.item}>
              <h2 className={p.display} style={{fontSize:"1.35rem"}}>{headingText(sec.heading)}</h2>
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".65rem"}}><BlockProse block={b} /></div>)}
            </div>
          ))}
        </div>
        <div style={{paddingBottom:"4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
      </Wrap>

    </SolutionShell>
  );
}

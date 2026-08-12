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
import styles from "./JaxicloudPlatformLayout.module.css";

export function JaxicloudPlatformLayout({
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
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
          {heroBody ? <p className={styles.muted} style={{marginTop:"1.1rem",lineHeight:1.7}}>{heroBody}</p> : null}
          <div style={{marginTop:"1.75rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
        </section>
        {images[0] ? <div style={{marginBottom:"2rem"}}><BlockMedia block={images[0]} className={styles.shot} /></div> : null}
        <div className={styles.wall}>
          {features.map((f) => (
            <div key={f.block.id} className={styles.cell}><FeatureTile block={f} /></div>
          ))}
        </div>
        {lists[0] ? <div style={{paddingBottom:"2rem"}}><h2 className={p.display} style={{color:"#fff",fontSize:"1.75rem",marginBottom:"1rem"}}>{headingText(sections[sections.length-1]?.heading)}</h2><IconList block={lists[0]} /></div> : null}
        <div className={styles.mediaRow}>
          {images.slice(1,4).map((img) => <BlockMedia key={img.block.id} block={img} className={styles.shot} />)}
        </div>
      </Wrap>

    </SolutionShell>
  );
}

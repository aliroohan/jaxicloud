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
import styles from "./TpmsEbsLayout.module.css";

export function TpmsEbsLayout({
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
        </section>
        <div className={styles.stack}>
          {features.map((f) => (
            <div key={f.block.id} className={styles.card}><FeatureTile block={f} /></div>
          ))}
        </div>
        <div className={styles.bodyBand}>
          {sections.map((sec, i) => (
            <div key={sec.heading?.block.id || i} style={{marginBottom:"1.5rem"}}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.5rem",color:"#fff"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
            </div>
          ))}
          <DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" />
        </div>
      </Wrap>

    </SolutionShell>
  );
}

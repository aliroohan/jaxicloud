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
import styles from "./SafeStartLayout.module.css";

export function SafeStartLayout({
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
            <Eyebrow light>{eyebrow}</Eyebrow>
            <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
            {heroBody ? <p className={styles.muted} style={{marginTop:"1.1rem",lineHeight:1.7}}>{heroBody}</p> : null}
            <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.shot} priority /> : null}
        </section>
        <div className={styles.benefits}>
          {sections.slice(1,5).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.benefit}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.35rem",color:"#fff"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} className={styles.muted} style={{marginTop:".65rem"}}><BlockProse block={b} /></div>)}
              {sec.images[0] ? <div style={{marginTop:"1rem"}}><BlockMedia block={sec.images[0]} className={styles.shot} /></div> : null}
            </div>
          ))}
        </div>
        <div className={styles.list}>
          {lists[0] ? <IconList block={lists[0]} /> : null}
          {sections.slice(5).map((sec, i) => (
            <div key={sec.heading?.block.id || i} style={{marginTop:"1.5rem"}}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.4rem",color:"#fff"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} className={styles.muted} style={{marginTop:".65rem"}}><BlockProse block={b} /></div>)}
            </div>
          ))}
        </div>
      </Wrap>

    </SolutionShell>
  );
}

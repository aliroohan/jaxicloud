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

      <section className={styles.hero}>
        {images[0] ? (
          <div style={{position:"absolute",inset:0}}>
            <BlockMedia block={images[0]} className={styles.shot} />
            <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(15,23,42,.88),rgba(15,23,42,.35))"}} />
          </div>
        ) : null}
        <Wrap>
          <div className={styles.heroInner}>
            <Eyebrow light>{eyebrow}</Eyebrow>
            <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
            {heroBody ? <p className={styles.body}>{heroBody}</p> : null}
            <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
          </div>
        </Wrap>
      </section>
      <Wrap>
        <div className={styles.content}>
          {sections.slice(1).map((sec, i) => (
            <div key={sec.heading?.block.id || i}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.6rem"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
              {sec.gallery ? <div style={{marginTop:"1rem"}}><BlockMedia block={sec.gallery} className={styles.shot} /></div> : null}
            </div>
          ))}
        </div>
      </Wrap>

    </SolutionShell>
  );
}

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
import styles from "./TransportTelematicsLayout.module.css";

export function TransportTelematicsLayout({
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
          <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
        </section>
        <div className={styles.hub}>
          {sections.slice(1).filter(s => headingText(s.heading)).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.spoke}>
              <div>
                <h2 className={p.display} style={{fontSize:"1.45rem"}}>{headingText(sec.heading)}</h2>
                {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
                {sec.ctas[0]?.text.ctaLabel ? (
                  <div style={{marginTop:"1rem"}}>
                    <DemoCta href={sec.ctas[0].text.ctaUrl || contactHref} label={sec.ctas[0].text.ctaLabel} variant="ghost" />
                  </div>
                ) : null}
              </div>
              {sec.images[0] || images[i] ? <BlockMedia block={sec.images[0] || images[i]} className={styles.shot} /> : null}
            </div>
          ))}
        </div>
      </Wrap>

    </SolutionShell>
  );
}

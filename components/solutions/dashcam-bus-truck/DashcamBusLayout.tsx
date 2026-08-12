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
import styles from "./DashcamBusLayout.module.css";

export function DashcamBusLayout({
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
        <Wrap>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
          {heroBody ? <p style={{marginTop:"1.1rem",color:"rgba(255,255,255,.75)",maxWidth:"48ch",lineHeight:1.7}}>{heroBody}</p> : null}
        </Wrap>
      </section>
      <div className={styles.split}>
        <div className={styles.chal}>
          <Wrap>
            {sections[1] ? (
              <>
                {headingText(sections[1].heading) ? <h2 className={p.display} style={{fontSize:"1.75rem"}}>{headingText(sections[1].heading)}</h2> : null}
                {sections[1].bodies.map((b) => <div key={b.block.id} style={{marginTop:"1rem"}}><BlockProse block={b} /></div>)}
                {sections[1].images[0] ? <BlockMedia block={sections[1].images[0]} className={styles.shot} /> : null}
              </>
            ) : null}
          </Wrap>
        </div>
        <div className={styles.sol}>
          <Wrap>
            {sections[2] ? (
              <>
                {headingText(sections[2].heading) ? <h2 className={p.display} style={{fontSize:"1.75rem"}}>{headingText(sections[2].heading)}</h2> : null}
                {sections[2].bodies.map((b) => <div key={b.block.id} style={{marginTop:"1rem"}}><BlockProse block={b} /></div>)}
                {sections[2].images[0] ? <BlockMedia block={sections[2].images[0]} className={styles.shot} /> : null}
              </>
            ) : null}
          </Wrap>
        </div>
      </div>
      <Wrap>
        <div className={styles.featGrid}>
          {features.map((f) => <FeatureTile key={f.block.id} block={f} />)}
        </div>
        <div style={{paddingBottom:"4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
      </Wrap>

    </SolutionShell>
  );
}

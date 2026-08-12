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
import styles from "./ClickConnectLayout.module.css";

export function ClickConnectLayout({
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
        </section>
        <div className={styles.features}>
          {features.map((f) => <div key={f.block.id} className={styles.feat}><FeatureTile block={f} /></div>)}
        </div>
      </Wrap>
      <section className={styles.formBand}>
        <Wrap>
          {sections[sections.length-1]?.heading ? (
            <h2 className={`${p.display} ${styles.formTitle}`}>{headingText(sections[sections.length-1].heading)}</h2>
          ) : null}
          <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
        </Wrap>
      </section>

    </SolutionShell>
  );
}

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
import styles from "./SidePanelsLayout.module.css";

export function SidePanelsLayout({
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
        {sections.slice(0,3).map((sec, i) => (
          <section key={sec.heading?.block.id || i} className={styles.act}>
            <p className={styles.kicker}>{String(i + 1).padStart(2,"0")} / 03</p>
            <h2 className={`${p.display} ${styles.title}`}>{headingText(sec.heading) || heroTitle}</h2>
            <div className={styles.layout}>
              <div>
                {sec.bodies.map((b) => <div key={b.block.id} style={{marginBottom:"1rem"}}><BlockProse block={b} /></div>)}
                {i === 0 ? <DemoCta href={contactHref} label={requestDemoLabel} /> : null}
              </div>
              {(sec.images[0] || images[i]) ? <BlockMedia block={sec.images[0] || images[i]} className={styles.shot} /> : null}
            </div>
          </section>
        ))}
      </Wrap>

    </SolutionShell>
  );
}

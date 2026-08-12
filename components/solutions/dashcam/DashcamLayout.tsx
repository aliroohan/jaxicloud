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
import styles from "./DashcamLayout.module.css";

export function DashcamLayout({
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
          {heroBody ? <p className={styles.muted} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
        </section>
        <div className={styles.reel}>
          {images.slice(0,8).map((img) => <BlockMedia key={img.block.id} block={img} className={styles.shot} />)}
        </div>
        {sections.slice(1).map((sec, i) => (
          <section key={sec.heading?.block.id || i} className={styles.section}>
            {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"clamp(1.5rem,3vw,2.1rem)",color:"#fff"}}>{headingText(sec.heading)}</h2> : null}
            {sec.bodies.map((b) => <div key={b.block.id} className={styles.muted} style={{marginTop:"1rem",maxWidth:"60ch"}}><BlockProse block={b} /></div>)}
            {sec.list ? <div style={{marginTop:"1.25rem"}}><IconList block={sec.list} /></div> : null}
            {sec.videos.length > 0 ? (
              <div className={styles.videoGrid} style={{marginTop:"1.5rem"}}>
                {sec.videos.slice(0,4).map((v) => (
                  <div key={v.block.id} style={{aspectRatio:"16/9",borderRadius:".75rem",overflow:"hidden",background:"#111"}}>
                    {v.block.videos[0]?.src ? <video src={v.block.videos[0].src} controls playsInline style={{width:"100%",height:"100%"}} /> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
        <div style={{padding:"2rem 0 4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
      </Wrap>

    </SolutionShell>
  );
}

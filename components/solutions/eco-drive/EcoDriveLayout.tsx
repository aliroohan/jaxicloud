import {
  bodyText,
  headingText,
  resolve,
  stripHtml,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
  Breadcrumb,
  DemoCta,
  SolutionShell,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type {
  ResolvedBlock,
  SolutionLayoutProps,
} from "@/components/solutions/shared/types";
import { Reveal } from "@/components/blocks/Motion";
import { withLocale } from "@/lib/i18n/config";
import styles from "./EcoDriveLayout.module.css";

/** Resolve a block by stable `order` so layout mapping stays locale-agnostic. */
function at(
  blocks: SolutionLayoutProps["page"]["blocks"],
  locale: SolutionLayoutProps["locale"],
  order: number,
): ResolvedBlock | null {
  const block = blocks.find((b) => b.order === order);
  return block ? resolve(block, locale) : null;
}

function proseHtml(r: ResolvedBlock | null): string {
  if (!r) return "";
  if (r.text.bodyHtml?.trim()) return r.text.bodyHtml;
  const plain = bodyText(r) || stripHtml(r.text.bodyHtml);
  return plain ? `<p>${plain}</p>` : "";
}

const BENEFIT_REVEAL: Array<"up" | "left" | "right"> = [
  "up",
  "right",
  "left",
  "up",
  "right",
];

const STEP_REVEAL: Array<"up" | "left" | "right"> = [
  "up",
  "left",
  "right",
  "up",
  "left",
  "right",
];

function BenefitCard({
  block,
  index,
  delay = 0,
}: {
  block: ResolvedBlock | null;
  index: number;
  delay?: number;
}) {
  if (!block) return null;
  const title = headingText(block);
  const body = bodyText(block) || stripHtml(block.text.bodyHtml) || "";
  if (!title && !body) return null;
  const n = String(index + 1).padStart(2, "0");
  const isFeature = index === 0;
  const from = BENEFIT_REVEAL[index] ?? "up";

  return (
    <Reveal
      delay={delay}
      from={from}
      className={`${styles.card}${isFeature ? ` ${styles.cardAnchor}` : ""}`}
    >
      <div className={styles.cardMeta}>
        <span className={styles.cardIndex} aria-hidden>
          {n}
        </span>
        <span className={styles.cardRule} aria-hidden />
        <span className={styles.cardArrow} aria-hidden>
          ↗
        </span>
      </div>
      {title ? <h3 className={styles.cardTitle}>{title}</h3> : null}
      {body ? <p className={styles.cardBody}>{body}</p> : null}
    </Reveal>
  );
}

function StepCard({
  block,
  index,
  delay = 0,
}: {
  block: ResolvedBlock | null;
  index: number;
  delay?: number;
}) {
  if (!block) return null;
  const label = headingText(block);
  const body = bodyText(block) || stripHtml(block.text.bodyHtml) || "";
  if (!label && !body) return null;
  const n = String(index + 1).padStart(2, "0");
  const from = STEP_REVEAL[index] ?? "up";
  // CMS headings are often bare step digits ("1"…"6"); prefer padded index.
  const meta = /^\d+$/.test((label || "").trim()) ? n : label || n;

  return (
    <Reveal delay={delay} from={from} className={styles.stepCard}>
      <div className={styles.cardMeta}>
        <span className={styles.cardIndex} aria-hidden>
          {meta}
        </span>
        <span className={styles.cardRule} aria-hidden />
        <span className={styles.cardArrow} aria-hidden>
          ↗
        </span>
      </div>
      {body ? <p className={styles.cardBody}>{body}</p> : null}
    </Reveal>
  );
}

export function EcoDriveLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  const pageTitle = at(blocks, locale, 0);
  const introH = at(blocks, locale, 1);
  const introBody = at(blocks, locale, 2);
  const introImg = at(blocks, locale, 3);

  const benefitsH = at(blocks, locale, 4);
  const benefitCards = [5, 6, 7, 8, 9].map((order) =>
    at(blocks, locale, order),
  );

  const paramsH = at(blocks, locale, 10);
  const paramsBody = at(blocks, locale, 11);
  const analysisImg = at(blocks, locale, 12);
  const analysisBody = at(blocks, locale, 13);

  const stepCards = [14, 15, 16, 17, 18, 19].map((order) =>
    at(blocks, locale, order),
  );

  const heroTitle = headingText(pageTitle) || title;
  const introHeading = headingText(introH);
  const introHtml = proseHtml(introBody);
  const benefitsHeading = headingText(benefitsH);
  const paramsHeading = headingText(paramsH);
  const paramsHtml = proseHtml(paramsBody);
  const analysisHtml = proseHtml(analysisBody);

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
          <Reveal>
            <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
          </Reveal>
        </section>
      </Wrap>

      {(introHeading || introHtml || introImg) && (
        <Wrap>
          <section className={styles.intro}>
            <Reveal className={styles.introCopy}>
              {introHeading ? (
                <h2 className={`${p.display} ${styles.introHeading}`}>
                  {introHeading}
                </h2>
              ) : null}
              {introHtml ? (
                <div
                  className={styles.introProse}
                  dangerouslySetInnerHTML={{ __html: introHtml }}
                />
              ) : null}
              {requestDemoLabel ? (
                <div className={styles.introCta}>
                  <DemoCta href={contactHref} label={requestDemoLabel} />
                </div>
              ) : null}
            </Reveal>
            {introImg ? (
              <Reveal delay={0.06} className={styles.introMedia}>
                <BlockMedia
                  block={introImg}
                  className={styles.mediaFrame}
                  priority
                />
              </Reveal>
            ) : null}
          </section>
        </Wrap>
      )}

      {(benefitsHeading || benefitCards.some(Boolean)) && (
        <Wrap>
          <section className={styles.benefits}>
            {benefitsHeading ? (
              <Reveal>
                <h2 className={`${p.display} ${styles.sectionTitle}`}>
                  {benefitsHeading}
                </h2>
              </Reveal>
            ) : null}
            <div className={styles.benefitGrid}>
              {benefitCards.map((card, i) => (
                <BenefitCard
                  key={card?.block.id ?? i}
                  block={card}
                  index={i}
                  delay={0.03 + i * 0.05}
                />
              ))}
            </div>
          </section>
        </Wrap>
      )}

      {(paramsHeading || paramsHtml) && (
        <Wrap>
          <section className={styles.params}>
            <Reveal className={styles.paramsCopy}>
              {paramsHeading ? (
                <h2 className={`${p.display} ${styles.sectionTitleLeft}`}>
                  {paramsHeading}
                </h2>
              ) : null}
              {paramsHtml ? (
                <div
                  className={styles.introProse}
                  dangerouslySetInnerHTML={{ __html: paramsHtml }}
                />
              ) : null}
            </Reveal>
          </section>
        </Wrap>
      )}

      {(analysisImg || analysisHtml) && (
        <Wrap>
          <section className={styles.analysis}>
            {analysisImg ? (
              <Reveal from="left" className={styles.analysisMedia}>
                <BlockMedia block={analysisImg} className={styles.mediaFrame} />
              </Reveal>
            ) : null}
            {analysisHtml ? (
              <Reveal delay={0.08} from="right" className={styles.analysisCard}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardRuleWide} aria-hidden />
                </div>
                <div
                  className={styles.analysisProse}
                  dangerouslySetInnerHTML={{ __html: analysisHtml }}
                />
              </Reveal>
            ) : null}
          </section>
        </Wrap>
      )}

      {stepCards.some(Boolean) && (
        <Wrap>
          <section className={styles.steps} aria-label={heroTitle}>
            <div className={styles.stepGrid}>
              {stepCards.map((card, i) => (
                <StepCard
                  key={card?.block.id ?? i}
                  block={card}
                  index={i}
                  delay={0.03 + i * 0.05}
                />
              ))}
            </div>
            {requestDemoLabel ? (
              <Reveal delay={0.12} className={styles.footerCta}>
                <DemoCta href={contactHref} label={requestDemoLabel} />
              </Reveal>
            ) : null}
          </section>
        </Wrap>
      )}
    </SolutionShell>
  );
}

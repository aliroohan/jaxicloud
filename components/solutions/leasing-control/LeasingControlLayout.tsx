import {
  bodyText,
  headingText,
  resolve,
  stripHtml,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
  Breadcrumb,
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
import styles from "./LeasingControlLayout.module.css";

/** Resolve a block by stable `order` so layout mapping stays locale-agnostic. */
function at(
  blocks: SolutionLayoutProps["page"]["blocks"],
  locale: SolutionLayoutProps["locale"],
  order: number,
): ResolvedBlock | null {
  const block = blocks.find((b) => b.order === order);
  return block ? resolve(block, locale) : null;
}

/** Split bodyHtml into paragraph HTML chunks when present. */
function paragraphChunks(r: ResolvedBlock | null): string[] {
  if (!r) return [];
  const html = r.text.bodyHtml?.trim();
  if (html) {
    const parts = html
      .split(/<\/p>/i)
      .map((chunk) => chunk.replace(/<p[^>]*>/i, "").trim())
      .filter(Boolean)
      .map((inner) => `<p>${inner}</p>`);
    if (parts.length) return parts;
  }
  const plain = bodyText(r);
  return plain ? [`<p>${plain}</p>`] : [];
}

/**
 * CMS sometimes appends neighboring card titles into the first why-card body.
 * Drop trailing paragraphs that are only uppercase title fragments.
 */
function cleanWhyCardHtml(r: ResolvedBlock | null): string {
  const paras = paragraphChunks(r);
  const cleaned = paras.filter((html) => {
    const text = stripHtml(html).replace(/\s+/g, " ").trim();
    if (!text) return false;
    const upper = text.toUpperCase();
    const looksLikeTitleDump =
      /AGE OF FLEET/.test(upper) &&
      /USER-FRIENDLY|ENJOY IT/.test(upper) &&
      text.length < 80;
    return !looksLikeTitleDump;
  });
  return cleaned.join("");
}

type CaseStudyParts = {
  title: string;
  body: string;
  subheading: string;
  rows: { label: string; text: string }[];
};

/** Case-study richText: title| lead, body, then Challenges / Solution / Result. */
function parseCaseStudy(r: ResolvedBlock | null): CaseStudyParts | null {
  if (!r) return null;
  const paras = paragraphChunks(r);
  if (!paras.length && !headingText(r)) return null;

  const plainParas = paras.map((html) => stripHtml(html).replace(/\|$/g, "").trim());
  const title =
    plainParas[0]?.replace(/\|$/g, "").trim() ||
    headingText(r) ||
    "";

  let body = "";
  const rows: { label: string; text: string }[] = [];
  const labeled = /^(Challenges|Solution|Result)\s*:\s*(.*)$/i;

  for (let i = 1; i < plainParas.length; i++) {
    const pText = plainParas[i];
    const m = pText.match(labeled);
    if (m) {
      rows.push({ label: m[1], text: m[2].trim() });
    } else if (!body) {
      body = pText;
    }
  }

  // Prefer CMS heading as the mid subheading when title came from body lead
  const subheading =
    title && headingText(r) && headingText(r) !== title
      ? headingText(r)
      : "";

  if (!title && !body && !rows.length && !subheading) return null;
  return { title, body, subheading, rows };
}

function WhyCard({
  block,
  delay = 0,
}: {
  block: ResolvedBlock | null;
  delay?: number;
}) {
  if (!block) return null;
  const title = headingText(block);
  const html = cleanWhyCardHtml(block);
  if (!title && !html) return null;

  return (
    <Reveal delay={delay} className={styles.whyCard}>
      {title ? <h3 className={styles.whyCardTitle}>{title}</h3> : null}
      {html ? (
        <div
          className={styles.whyCardBody}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}
    </Reveal>
  );
}

function FuncCard({
  block,
  delay = 0,
}: {
  block: ResolvedBlock | null;
  delay?: number;
}) {
  if (!block) return null;
  const title = headingText(block);
  const body =
    bodyText(block) ||
    stripHtml(block.text.bodyHtml) ||
    "";
  if (!title && !body) return null;

  return (
    <Reveal delay={delay} className={styles.funcCard}>
      {title ? <h3 className={styles.funcTitle}>{title}</h3> : null}
      {body ? <p className={styles.funcBody}>{body}</p> : null}
    </Reveal>
  );
}

function BottomCard({
  block,
  delay = 0,
}: {
  block: ResolvedBlock | null;
  delay?: number;
}) {
  if (!block) return null;
  const title = headingText(block);
  const body =
    bodyText(block) ||
    stripHtml(block.text.bodyHtml) ||
    "";
  if (!title && !body) return null;

  return (
    <Reveal delay={delay} className={styles.bottomCard}>
      {title ? <h3 className={styles.bottomTitle}>{title}</h3> : null}
      {body ? <p className={styles.bottomBody}>{body}</p> : null}
    </Reveal>
  );
}

export function LeasingControlLayout({
  page,
  locale,
  eyebrow,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  // Live section map (block.order → role). Orders are stable across locales.
  const pageTitle = at(blocks, locale, 0);

  const introH = at(blocks, locale, 1);
  const introBody = at(blocks, locale, 2);
  const introImg = at(blocks, locale, 3);

  const whyH = at(blocks, locale, 4);
  const whySub = at(blocks, locale, 5);
  const whyCards = [6, 7, 8].map((order) => at(blocks, locale, order));

  const funcsH = at(blocks, locale, 9);
  const funcCards = [10, 11, 12, 13].map((order) => at(blocks, locale, order));

  const caseBlock = at(blocks, locale, 14);
  const caseStudy = parseCaseStudy(caseBlock);

  const bottomCards = [15, 16, 17, 18].map((order) => at(blocks, locale, order));

  const heroTitle = headingText(pageTitle) || title;
  const introHeading = headingText(introH);
  const introHtml =
    introBody?.text.bodyHtml ||
    (bodyText(introBody) ? `<p>${bodyText(introBody)}</p>` : "");
  const whyHeading = headingText(whyH);
  const whySubText =
    bodyText(whySub) ||
    stripHtml(whySub?.text.bodyHtml) ||
    headingText(whySub) ||
    "";
  const funcsHeading = headingText(funcsH);

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

      {(whyHeading || whySubText || whyCards.some(Boolean)) && (
        <Wrap>
          <section className={styles.why}>
            <Reveal className={styles.whyHead}>
              {whyHeading ? (
                <h2 className={`${p.display} ${styles.sectionTitle}`}>
                  {whyHeading}
                </h2>
              ) : null}
              {whySubText ? (
                <p className={styles.sectionSub}>{whySubText}</p>
              ) : null}
            </Reveal>
            <div className={styles.whyGrid}>
              {whyCards.map((card, i) => (
                <WhyCard key={card?.block.id ?? i} block={card} delay={i * 0.05} />
              ))}
            </div>
          </section>
        </Wrap>
      )}

      {(funcsHeading || funcCards.some(Boolean)) && (
        <Wrap>
          <section className={styles.funcs}>
            {funcsHeading ? (
              <Reveal>
                <h2 className={`${p.display} ${styles.sectionTitle}`}>
                  {funcsHeading}
                </h2>
              </Reveal>
            ) : null}
            <div className={styles.funcsBanner}>
              <div className={styles.funcsGrid}>
                {funcCards.map((card, i) => (
                  <FuncCard
                    key={card?.block.id ?? i}
                    block={card}
                    delay={i * 0.04}
                  />
                ))}
              </div>
            </div>
          </section>
        </Wrap>
      )}

      {caseStudy && (
        <Wrap>
          <section className={styles.case}>
            <Reveal className={styles.caseInner}>
              {caseStudy.title ? (
                <h2 className={`${p.display} ${styles.caseTitle}`}>
                  {caseStudy.title}
                </h2>
              ) : null}
              {caseStudy.body ? (
                <p className={styles.caseBody}>{caseStudy.body}</p>
              ) : null}
              {caseStudy.subheading ? (
                <h3 className={styles.caseSub}>{caseStudy.subheading}</h3>
              ) : null}
              {caseStudy.rows.length ? (
                <dl className={styles.caseList}>
                  {caseStudy.rows.map((row) => (
                    <div key={row.label} className={styles.caseRow}>
                      <dt>{row.label}:</dt>
                      <dd>{row.text}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </Reveal>
          </section>
        </Wrap>
      )}

      {bottomCards.some(Boolean) && (
        <Wrap>
          <section className={styles.bottom} aria-label={heroTitle}>
            <div className={styles.bottomGrid}>
              {bottomCards.map((card, i) => (
                <BottomCard
                  key={card?.block.id ?? i}
                  block={card}
                  delay={i * 0.04}
                />
              ))}
            </div>
          </section>
        </Wrap>
      )}
    </SolutionShell>
  );
}

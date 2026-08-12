import {
  bodyText,
  headingText,
  resolveAll,
  sectionize,
} from "@/components/solutions/shared/content";
import {
  Breadcrumb,
  DemoCta,
  Eyebrow,
  FeatureTile,
  SolutionShell,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type {
  ContentSection,
  ResolvedBlock,
} from "@/components/solutions/shared/types";
import type { SolutionLayoutProps } from "@/components/solutions/shared/types";
import { Reveal } from "@/components/blocks/Motion";
import { withLocale } from "@/lib/i18n/config";
import styles from "./TpmsEbsLayout.module.css";

/** One "sensor use case" card, parsed out of a free-form CMS rich-text blob. */
type UseCase = { heading: string; body: string };

function htmlToLines(html: string): string[] {
  return html
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/^<p[^>]*>/i, "")
    .replace(/<\/p>\s*$/i, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** Short, unpunctuated lines read as pseudo-headings authored via bold text. */
function looksLikeLabel(line: string): boolean {
  if (line.length > 72) return false;
  if (/[.!?]$/.test(line)) return false;
  return line.split(" ").length <= 10;
}

/**
 * CMS rich-text bodies encode "heading + paragraph" pairs as plain inline
 * bold labels rather than real block structure. Recover that structure
 * generically (works for any locale) via a short/long line heuristic.
 */
function parseUseCases(
  html: string | null | undefined,
  fallbackText: string,
): { intro: string; items: UseCase[] } {
  const lines = html ? htmlToLines(html) : fallbackText ? [fallbackText] : [];
  let intro = "";
  const items: UseCase[] = [];
  let pendingHeading = "";
  let sawHeading = false;

  for (const line of lines) {
    if (looksLikeLabel(line)) {
      sawHeading = true;
      pendingHeading = pendingHeading ? `${pendingHeading} ${line}` : line;
      continue;
    }
    if (!sawHeading) {
      intro = intro ? `${intro} ${line}` : line;
      continue;
    }
    if (pendingHeading) {
      items.push({ heading: pendingHeading, body: line });
      pendingHeading = "";
    } else if (items.length) {
      const last = items[items.length - 1];
      last.body = last.body ? `${last.body} ${line}` : line;
    } else {
      intro = intro ? `${intro} ${line}` : line;
    }
  }
  if (pendingHeading) items.push({ heading: pendingHeading, body: "" });
  return { intro, items };
}

const REVEAL_FROM: Array<"up" | "left" | "right"> = ["up", "left", "right", "up", "left", "right"];

function UseCaseCard({
  item,
  index,
  delay,
}: {
  item: UseCase;
  index: number;
  delay: number;
}) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <Reveal
      delay={delay}
      from={REVEAL_FROM[index % REVEAL_FROM.length]}
      className={styles.useCaseCard}
    >
      <div className={styles.useCaseMeta}>
        <span className={styles.useCaseIndex} aria-hidden>
          {n}
        </span>
        <span className={styles.useCaseRule} aria-hidden />
      </div>
      {item.heading ? (
        <h3 className={styles.useCaseTitle}>{item.heading}</h3>
      ) : null}
      {item.body ? <p className={styles.useCaseBody}>{item.body}</p> : null}
    </Reveal>
  );
}

function ClosingSection({
  section,
  delayStart,
}: {
  section: ContentSection;
  delayStart: number;
}) {
  const heading = headingText(section.heading);
  const bodyBlock: ResolvedBlock | undefined = section.bodies[0];
  const { intro, items } = parseUseCases(
    bodyBlock?.text.bodyHtml,
    bodyText(bodyBlock),
  );
  if (!heading && !intro && !items.length) return null;

  return (
    <section className={styles.closing}>
      {heading ? (
        <Reveal>
          <h2 className={`${p.display} ${styles.closingTitle}`}>{heading}</h2>
        </Reveal>
      ) : null}
      {intro ? (
        <Reveal delay={0.04}>
          <p className={styles.closingIntro}>{intro}</p>
        </Reveal>
      ) : null}
      {items.length ? (
        <div className={styles.useCaseGrid}>
          {items.map((item, i) => (
            <UseCaseCard
              key={`${item.heading}-${i}`}
              item={item}
              index={i}
              delay={delayStart + 0.03 + i * 0.05}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function TpmsEbsLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const sections = sectionize(page.blocks, locale);
  const features = resolveAll(
    page.blocks.filter((b) => b.type === "featureCard"),
    locale,
  );
  const heroTitle = headingText(sections[0]?.heading) || title;
  const closingSections = sections.slice(1);

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
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.04}>
            <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
          </Reveal>
        </section>

        {features.length ? (
          <div className={styles.stack}>
            {features.map((f, i) => (
              <Reveal
                key={f.block.id}
                delay={0.03 + i * 0.05}
                className={styles.card}
              >
                <FeatureTile block={f} />
              </Reveal>
            ))}
          </div>
        ) : null}

        {closingSections.map((sec, i) => (
          <ClosingSection
            key={sec.heading?.block.id || i}
            section={sec}
            delayStart={i * 0.05}
          />
        ))}

        <div className={styles.ctaRow}>
          <DemoCta href={contactHref} label={requestDemoLabel} />
        </div>
      </Wrap>
    </SolutionShell>
  );
}

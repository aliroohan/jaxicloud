import { Check } from "lucide-react";
import {
  bodyText,
  headingText,
  sectionize,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
  BlockProse,
  Breadcrumb,
  DemoCta,
  Eyebrow,
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
import styles from "./DashcamLayout.module.css";

/**
 * CMS duplication bug: the "Higher fuel efficiency" heading/body/image
 * (orders 22–24) is repeated verbatim at orders 28–30 right after the
 * "Rich reports for KPI" block. Drop the repeat before sectioning.
 */
const DUPLICATE_ORDERS = new Set([28, 29, 30]);

/**
 * "Rich reports for KPI" (and similar) ships as one free-form CMS rich-text
 * blob encoding "mini-heading + paragraph" pairs as plain inline labels
 * rather than real block structure (same authoring pattern as the TPMS page's
 * sensor-use-case copy). Recover that structure generically, locale-agnostic,
 * via a short/long line heuristic — same approach as TPMS, tuned because the
 * paragraph lines here are frequently authored without terminal punctuation.
 */
type FeatureItem = { heading: string; body: string };

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

/** Short, unpunctuated, comma-free lines read as pseudo-headings authored via
 * bold text; body lines in this CMS export nearly always contain a comma or
 * run well past this length even when they lack terminal punctuation. */
function looksLikeLabel(line: string): boolean {
  if (line.length > 50) return false;
  if (/[.!?]$/.test(line)) return false;
  if (line.includes(",")) return false;
  return line.split(" ").length <= 8;
}

function parseFeatureItems(
  html: string | null | undefined,
  fallbackText: string,
): { intro: string; items: FeatureItem[] } {
  const lines = html ? htmlToLines(html) : fallbackText ? [fallbackText] : [];
  let intro = "";
  const items: FeatureItem[] = [];
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

function MediaCell({
  block,
  delay,
  single = false,
}: {
  block: ResolvedBlock;
  delay: number;
  single?: boolean;
}) {
  const video = block.block.videos[0];
  const shotClass = single
    ? `${styles.mediaShot} ${styles.mediaShotSingle}`
    : styles.mediaShot;
  return (
    <Reveal
      delay={delay}
      className={single ? styles.mediaCellSingle : styles.mediaCell}
    >
      {video?.src ? (
        <video
          className={shotClass}
          src={video.src}
          controls
          playsInline
          preload="metadata"
        />
      ) : (
        <BlockMedia block={block} className={shotClass} />
      )}
    </Reveal>
  );
}

export function DashcamLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks.filter((b) => !DUPLICATE_ORDERS.has(b.order));
  const sections = sectionize(blocks, locale);

  const hero = sections[0];
  const heroTitle = headingText(hero?.heading) || title;
  const heroBody = hero?.bodies[0];

  const rows = sections.slice(1);

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
          {heroBody ? (
            <Reveal delay={0.08} className={styles.heroBody}>
              <BlockProse block={heroBody} />
            </Reveal>
          ) : null}
          <Reveal delay={0.12} className={styles.heroCta}>
            <DemoCta href={contactHref} label={requestDemoLabel} />
          </Reveal>
        </section>
      </Wrap>

      {rows.map((sec, i) => {
        const heading = headingText(sec.heading);
        const media = [...sec.images, ...sec.videos];
        const listItems = sec.list?.text.listItems ?? [];
        const isChecklist =
          listItems.length > 0 && media.length === 0 && sec.bodies.length === 0;

        // Only rich-text blobs with several genuine heading/body pairs get the
        // structured card treatment; a plain 1-2 sentence body (the common
        // case) keeps rendering as normal centered prose.
        const firstBody = sec.bodies[0];
        const featureList = firstBody
          ? parseFeatureItems(firstBody.text.bodyHtml, bodyText(firstBody))
          : null;
        const useFeatureList = (featureList?.items.length ?? 0) >= 3;

        if (!heading && !sec.bodies.length && !media.length && !listItems.length) {
          return null;
        }

        return (
          <Wrap key={sec.heading?.block.id || i}>
            <section
              className={isChecklist ? styles.checklistSection : styles.row}
            >
              {heading ? (
                <Reveal>
                  <h2 className={`${p.display} ${styles.rowTitle}`}>
                    {heading}
                  </h2>
                </Reveal>
              ) : null}

              {sec.bodies.length > 0 && useFeatureList && featureList ? (
                <>
                  {featureList.intro ? (
                    <Reveal delay={0.04} className={styles.rowBody}>
                      <p>{featureList.intro}</p>
                    </Reveal>
                  ) : null}
                  <div className={styles.featureGrid}>
                    {featureList.items.map((item, ii) => (
                      <Reveal
                        key={`${item.heading}-${ii}`}
                        delay={0.08 + ii * 0.05}
                        className={styles.featureCard}
                      >
                        <h3 className={styles.featureCardTitle}>
                          <span className={styles.featureCardDot} aria-hidden />
                          {item.heading}
                        </h3>
                        {item.body ? (
                          <p className={styles.featureCardBody}>{item.body}</p>
                        ) : null}
                      </Reveal>
                    ))}
                  </div>
                </>
              ) : sec.bodies.length > 0 ? (
                <div className={styles.rowBody}>
                  {sec.bodies.map((b, bi) => (
                    <Reveal key={b.block.id} delay={0.04 + bi * 0.03}>
                      <BlockProse block={b} />
                    </Reveal>
                  ))}
                </div>
              ) : null}

              {listItems.length > 0 ? (
                <ul className={styles.checkList}>
                  {listItems.map((item, idx) => (
                    <Reveal
                      as="li"
                      key={item}
                      delay={0.03 + idx * 0.04}
                      className={styles.checkItem}
                    >
                      <span className={styles.checkIcon} aria-hidden>
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span>{item}</span>
                    </Reveal>
                  ))}
                </ul>
              ) : null}

              {media.length > 0 ? (
                <div
                  className={`${styles.mediaGrid}${
                    media.length === 1
                      ? ` ${styles.mediaGridSingle}`
                      : media.length >= 3
                        ? ` ${styles.mediaGridWide}`
                        : ""
                  }`}
                >
                  {media.slice(0, 6).map((m, mi) => (
                    <MediaCell
                      key={m.block.id}
                      block={m}
                      delay={0.04 * mi}
                      single={media.length === 1}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          </Wrap>
        );
      })}

      <Wrap>
        <div className={styles.closing}>
          <DemoCta href={contactHref} label={requestDemoLabel} variant="ghost" />
        </div>
      </Wrap>
    </SolutionShell>
  );
}

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
import styles from "./SidePanelsLayout.module.css";

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

function ZigRow({
  heading,
  html,
  image,
  mediaLeft,
  index,
}: {
  heading: string;
  html: string;
  image: ResolvedBlock | null;
  mediaLeft: boolean;
  index: number;
}) {
  const hasMedia = Boolean(
    image && (image.block.images[0]?.src || image.block.layout.image),
  );
  if (!heading && !html && !hasMedia) return null;

  const mediaClass = mediaLeft ? styles.zigMediaLeft : styles.zigMediaRight;
  const mediaFrom = mediaLeft ? "left" : "right";
  const copyFrom = mediaLeft ? "right" : "left";

  return (
    <section className={`${styles.zigRow} ${mediaClass}`}>
      <Reveal
        delay={0.06 + index * 0.03}
        from={copyFrom}
        className={styles.copySlot}
      >
        <div className={styles.copy}>
          {heading ? (
            <h2 className={`${p.display} ${styles.zigHeading}`}>{heading}</h2>
          ) : null}
          {html ? (
            <div
              className={styles.zigProse}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : null}
        </div>
      </Reveal>
      <Reveal delay={0.02 + index * 0.03} from={mediaFrom} className={styles.mediaSlot}>
        {hasMedia && image ? (
          <BlockMedia block={image} className={styles.mediaFrame} priority={index === 0} />
        ) : null}
      </Reveal>
    </section>
  );
}

export function SidePanelsLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  const pageTitle = at(blocks, locale, 0);
  const introBody = at(blocks, locale, 1);

  const whatH = at(blocks, locale, 2);
  const whatBody = at(blocks, locale, 3);
  const whatImg = at(blocks, locale, 4);

  const howImg = at(blocks, locale, 5);
  const howH = at(blocks, locale, 6);
  const howBody = at(blocks, locale, 7);

  const heroTitle = headingText(pageTitle) || title;
  const introHtml = proseHtml(introBody);

  const whatHeading = headingText(whatH);
  const whatHtml = proseHtml(whatBody);
  const howHeading = headingText(howH);
  const howHtml = proseHtml(howBody);

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

        {introHtml && (
          <section className={styles.intro}>
            <Reveal className={styles.introCopy}>
              <div
                className={styles.introProse}
                dangerouslySetInnerHTML={{ __html: introHtml }}
              />
            </Reveal>
          </section>
        )}

        <div className={styles.zig}>
          <ZigRow
            heading={whatHeading}
            html={whatHtml}
            image={whatImg}
            mediaLeft={false}
            index={0}
          />
          <ZigRow
            heading={howHeading}
            html={howHtml}
            image={howImg}
            mediaLeft={true}
            index={1}
          />
        </div>

        <div className={styles.ctaRow}>
          <DemoCta href={contactHref} label={requestDemoLabel} />
        </div>
      </Wrap>
    </SolutionShell>
  );
}

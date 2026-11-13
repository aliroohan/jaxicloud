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
import styles from "./ConstractorLayout.module.css";

/** Resolve a block by stable `order` so layout mapping stays locale-agnostic. */
function at(
  blocks: SolutionLayoutProps["page"]["blocks"],
  locale: SolutionLayoutProps["locale"],
  order: number,
): ResolvedBlock | null {
  const block = blocks.find((b) => b.order === order);
  return block ? resolve(block, locale) : null;
}

function videoSrc(r: ResolvedBlock | null | undefined): string | null {
  return r?.block.videos[0]?.src || null;
}

/** Split bodyHtml into paragraph HTML chunks when present. */
function paragraphChunks(r: ResolvedBlock): string[] {
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

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function HtmlChunk({ html }: { html: string }) {
  return (
    <div className={p.body} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/**
 * Live-site richText often stores intro/closing paragraphs in bodyHtml
 * and bullet points in listItems. When there are 3+ paragraphs (e.g. Partner
 * continuation), lists are split across the trailing intros.
 */
function ProseWithList({ block }: { block: ResolvedBlock }) {
  const paras = paragraphChunks(block);
  const items = block.text.listItems;
  if (!paras.length && !items.length) return null;

  if (!items.length) {
    return <HtmlChunk html={paras.join("")} />;
  }

  // Intro + list + closing (Complete / Improve / Partner primary)
  if (paras.length <= 2) {
    return (
      <div className={styles.copy}>
        {paras[0] ? <HtmlChunk html={paras[0]} /> : null}
        <BulletList items={items} />
        {paras[1] ? <HtmlChunk html={paras[1]} /> : null}
      </div>
    );
  }

  // Lead + condition intro/list + monitor intro/list (Partner extra)
  const splitAt = Math.min(3, Math.max(1, Math.ceil(items.length / 2)));
  const firstList = items.slice(0, splitAt);
  const secondList = items.slice(splitAt);

  return (
    <div className={styles.copy}>
      <HtmlChunk html={paras[0]} />
      <HtmlChunk html={paras[1]} />
      <BulletList items={firstList} />
      {paras.slice(2).map((html) => (
        <HtmlChunk key={html.slice(0, 48)} html={html} />
      ))}
      <BulletList items={secondList} />
    </div>
  );
}

function BlockVideo({
  block,
  className,
}: {
  block: ResolvedBlock;
  className?: string;
}) {
  const src = videoSrc(block);
  if (!src) return null;
  return (
    <div className={`${styles.mediaFrame} ${className ?? ""}`}>
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className={styles.videoEl}
      />
    </div>
  );
}

type ZigRow = {
  key: string;
  mediaLeft: boolean;
  heading: ResolvedBlock | null;
  body: ResolvedBlock | null;
  image?: ResolvedBlock | null;
  video?: ResolvedBlock | null;
  withList?: boolean;
};

export function ConstractorLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  // Live section map (block.order → role). Orders are stable across locales.
  const heroHeading = at(blocks, locale, 0);
  const heroSub = at(blocks, locale, 1);

  const smarterH = at(blocks, locale, 2);
  const smarterBody = at(blocks, locale, 3);
  const smarterImg = at(blocks, locale, 4);

  const iotVideo = at(blocks, locale, 5);
  const iotH = at(blocks, locale, 6);
  const iotBody = at(blocks, locale, 7);

  const equipH = at(blocks, locale, 8);
  const equipBody = at(blocks, locale, 9);
  const equipVideo = at(blocks, locale, 10);

  const monitorImg = at(blocks, locale, 11);
  const monitorH = at(blocks, locale, 12);
  const monitorBody = at(blocks, locale, 13);

  // order 14 video is present in JSON but not in the live visual composition
  const aerial = at(blocks, locale, 19);

  const improveH = at(blocks, locale, 15);
  const improveBody = at(blocks, locale, 16);
  const partnerH = at(blocks, locale, 17);
  const partnerBody = at(blocks, locale, 18);
  const partnerExtra = at(blocks, locale, 20);

  const heroTitle = headingText(heroHeading) || title;
  const heroSubtitle =
    bodyText(heroSub) || stripHtml(heroSub?.text.bodyHtml) || "";

  const zigRows: ZigRow[] = [
    {
      key: "smarter",
      mediaLeft: false,
      heading: smarterH,
      body: smarterBody,
      image: smarterImg,
    },
    {
      key: "iot",
      mediaLeft: true,
      heading: iotH,
      body: iotBody,
      video: iotVideo,
    },
    {
      key: "equipment",
      mediaLeft: false,
      heading: equipH,
      body: equipBody,
      video: equipVideo,
    },
    {
      key: "monitor",
      mediaLeft: true,
      heading: monitorH,
      body: monitorBody,
      image: monitorImg,
      withList: true,
    },
  ];

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
          {heroSubtitle ? (
            <Reveal delay={0.06}>
              <p className={styles.subtitle}>{heroSubtitle}</p>
            </Reveal>
          ) : null}
        </section>
      </Wrap>

      <Wrap>
        <div className={styles.zig}>
          {zigRows.map((row) => {
            const h = headingText(row.heading);
            const hasMedia = Boolean(
              (row.image && (row.image.block.images[0]?.src || row.image.block.layout.image)) ||
                videoSrc(row.video),
            );
            if (!h && !row.body && !hasMedia) return null;

            const mediaClass = row.mediaLeft
              ? styles.zigMediaLeft
              : styles.zigMediaRight;

            return (
              <section
                key={row.key}
                className={`${styles.zigRow} ${mediaClass}`}
              >
                <Reveal className={styles.copySlot}>
                  <div className={styles.copy}>
                    {h ? (
                      <h2 className={`${p.display} ${styles.heading}`}>{h}</h2>
                    ) : null}
                    {row.body ? (
                      row.withList ? (
                        <ProseWithList block={row.body} />
                      ) : (
                        <div
                          className={p.body}
                          dangerouslySetInnerHTML={{
                            __html:
                              row.body.text.bodyHtml ||
                              `<p>${bodyText(row.body)}</p>`,
                          }}
                        />
                      )
                    ) : null}
                  </div>
                </Reveal>
                <Reveal delay={0.05} className={styles.mediaSlot}>
                  {row.video && videoSrc(row.video) ? (
                    <BlockVideo block={row.video} />
                  ) : row.image ? (
                    <BlockMedia
                      block={row.image}
                      className={`${styles.mediaFrame} ${styles.mediaFrameTall}`}
                      priority={row.key === "smarter"}
                    />
                  ) : null}
                </Reveal>
              </section>
            );
          })}
        </div>
      </Wrap>

      {aerial ? (
        <section className={styles.bleed} aria-hidden={!aerial}>
          <BlockMedia block={aerial} className={styles.bleedMedia} />
        </section>
      ) : null}

      {(improveH || partnerH || improveBody || partnerBody) && (
        <Wrap>
          <section className={styles.dense}>
            <div className={styles.denseGrid}>
              <Reveal className={styles.denseCol}>
                {headingText(improveH) ? (
                  <h2 className={`${p.display} ${styles.heading}`}>
                    {headingText(improveH)}
                  </h2>
                ) : null}
                {improveBody ? <ProseWithList block={improveBody} /> : null}
              </Reveal>
              <Reveal delay={0.06} className={styles.denseCol}>
                {headingText(partnerH) ? (
                  <h2 className={`${p.display} ${styles.heading}`}>
                    {headingText(partnerH)}
                  </h2>
                ) : null}
                {partnerBody ? <ProseWithList block={partnerBody} /> : null}
                {partnerExtra ? <ProseWithList block={partnerExtra} /> : null}
                <div className={styles.ctaRow}>
                  <DemoCta href={contactHref} label={requestDemoLabel} />
                </div>
              </Reveal>
            </div>
          </section>
        </Wrap>
      )}
    </SolutionShell>
  );
}

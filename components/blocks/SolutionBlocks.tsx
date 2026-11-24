import type { ContentBlock, Locale } from "@/lib/content/blocks";
import { resolveBlockTranslation } from "@/lib/content/blocks";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import {
  FeatureCardGridBlock,
  HeroBlock,
  StatGridBlock,
  VideoEmbedBlock,
} from "@/components/blocks/renderers";
import { Reveal } from "@/components/blocks/Motion";
import styles from "@/components/blocks/blocks.module.css";

type Group =
  | { kind: "single"; block: ContentBlock }
  | { kind: "featureCardGrid"; items: ContentBlock[] }
  | { kind: "statGrid"; items: ContentBlock[] }
  | { kind: "videoPair"; items: ContentBlock[] }
  | { kind: "heroBundle"; blocks: ContentBlock[] };

/**
 * Collapse consecutive same-type widgets into layout groups so pages
 * don't look like a flat widget dump (esp. feature cards & counters).
 */
export function groupBlocks(blocks: ContentBlock[]): Group[] {
  const groups: Group[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // Opening band: first heading (+ optional following richText / media / cta)
    if (i === 0 && (block.type === "heading" || block.type === "hero")) {
      const bundle: ContentBlock[] = [block];
      let j = i + 1;
      while (
        j < blocks.length &&
        j < i + 4 &&
        ["richText", "image", "videoEmbed", "ctaButton", "dualCta"].includes(
          blocks[j].type,
        )
      ) {
        bundle.push(blocks[j]);
        j += 1;
      }
      groups.push({ kind: "heroBundle", blocks: bundle });
      i = j;
      continue;
    }

    if (block.type === "featureCard") {
      const items: ContentBlock[] = [];
      while (i < blocks.length && blocks[i].type === "featureCard") {
        items.push(blocks[i]);
        i += 1;
      }
      groups.push(
        items.length >= 2
          ? { kind: "featureCardGrid", items }
          : { kind: "single", block: items[0] },
      );
      continue;
    }

    if (block.type === "statCounter") {
      const items: ContentBlock[] = [];
      while (i < blocks.length && blocks[i].type === "statCounter") {
        items.push(blocks[i]);
        i += 1;
      }
      groups.push(
        items.length >= 2
          ? { kind: "statGrid", items }
          : { kind: "single", block: items[0] },
      );
      continue;
    }

    if (block.type === "videoEmbed") {
      const items: ContentBlock[] = [];
      while (i < blocks.length && blocks[i].type === "videoEmbed") {
        items.push(blocks[i]);
        i += 1;
      }
      groups.push(
        items.length >= 2
          ? { kind: "videoPair", items }
          : { kind: "single", block: items[0] },
      );
      continue;
    }

    groups.push({ kind: "single", block });
    i += 1;
  }

  return groups;
}

function HeroBundle({
  blocks,
  locale,
  eyebrow,
}: {
  blocks: ContentBlock[];
  locale: Locale;
  eyebrow?: string;
}) {
  const heading =
    blocks.find((b) => b.type === "heading" || b.type === "hero") || blocks[0];
  const body = blocks.find((b) => b.type === "richText");
  const media = blocks.find(
    (b) => b.type === "image" || b.type === "videoEmbed",
  );
  const cta = blocks.find(
    (b) => b.type === "ctaButton" || b.type === "dualCta",
  );

  const tHeading = resolveBlockTranslation(heading, locale);
  const tBody = body ? resolveBlockTranslation(body, locale) : null;
  const tCta = cta ? resolveBlockTranslation(cta, locale) : null;

  const merged = {
    ...heading,
    images: media?.images?.length ? media.images : heading.images,
    videos: media?.videos?.length ? media.videos : heading.videos,
    layout: {
      ...heading.layout,
      image:
        media?.layout.image ||
        media?.images[0]?.src ||
        heading.layout.image,
      imagePosition:
        media?.layout.imagePosition || heading.layout.imagePosition,
    },
  } as ContentBlock;

  const translation = {
    heading: tHeading?.heading || null,
    body: tBody?.body || tHeading?.body || null,
    bodyHtml: tBody?.bodyHtml || tHeading?.bodyHtml || null,
    listItems: tHeading?.listItems || [],
    links: tCta?.links || tHeading?.links || [],
    ctaLabel: tCta?.ctaLabel || tHeading?.ctaLabel || null,
    ctaUrl: tCta?.ctaUrl || tHeading?.ctaUrl || null,
    imageAlts:
      (media ? resolveBlockTranslation(media, locale)?.imageAlts : null) ||
      tHeading?.imageAlts ||
      [],
  };

  return (
    <HeroBlock
      block={merged}
      locale={locale}
      translation={translation}
      eyebrow={eyebrow}
    />
  );
}

export function SolutionBlocks({
  blocks,
  locale,
  eyebrow,
}: {
  blocks: ContentBlock[];
  locale: Locale;
  eyebrow?: string;
}) {
  const groups = groupBlocks(blocks);

  return (
    <div className={styles.stack}>
      {groups.map((group, index) => {
        if (group.kind === "heroBundle") {
          return (
            <HeroBundle
              key={`hero-${index}`}
              blocks={group.blocks}
              locale={locale}
              eyebrow={eyebrow}
            />
          );
        }
        if (group.kind === "featureCardGrid") {
          return (
            <FeatureCardGridBlock
              key={`features-${group.items[0].id}`}
              items={group.items}
              locale={locale}
            />
          );
        }
        if (group.kind === "statGrid") {
          return (
            <StatGridBlock
              key={`stats-${group.items[0].id}`}
              items={group.items}
              locale={locale}
            />
          );
        }
        if (group.kind === "videoPair") {
          return (
            <Reveal key={`videos-${group.items[0].id}`} className={styles.videoPair}>
              {group.items.map((block) => (
                <VideoEmbedBlock
                  key={block.id}
                  block={block}
                  locale={locale}
                  translation={resolveBlockTranslation(block, locale)}
                />
              ))}
            </Reveal>
          );
        }
        return (
          <BlockRenderer
            key={group.block.id}
            block={group.block}
            locale={locale}
          />
        );
      })}
    </div>
  );
}

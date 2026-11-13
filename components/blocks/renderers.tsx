import type { ContentBlock, BlockTranslation, Locale } from "@/lib/content/blocks";
import { resolveBlockTranslation } from "@/lib/content/blocks";
import styles from "./blocks.module.css";
import { Reveal, Stagger, StaggerItem } from "./Motion";
import { ArrowUpRight } from "lucide-react";

export type BlockProps = {
  block: ContentBlock;
  locale: Locale;
  translation: BlockTranslation | null;
};

function tOf(block: ContentBlock, locale: Locale) {
  return resolveBlockTranslation(block, locale);
}

function BodyHtml({ html, text, className }: { html: string | null; text: string | null; className?: string }) {
  if (html) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  if (text) return <p className={className}>{text}</p>;
  return null;
}

function Media({
  block,
  alt,
  className,
}: {
  block: ContentBlock;
  alt?: string;
  className?: string;
}) {
  const video = block.videos[0];
  const image = block.images[0];
  if (video) {
    if (video.provider === "youtube" || video.provider === "vimeo") {
      return (
        <div className={className}>
          <iframe
            src={video.src}
            title={alt || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className={className}>
        <video
          src={video.src}
          poster={video.poster || undefined}
          controls
          playsInline
          preload="metadata"
        />
      </div>
    );
  }
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={className}
        src={image.src}
        alt={alt || ""}
        width={image.width || undefined}
        height={image.height || undefined}
        loading="lazy"
      />
    );
  }
  return null;
}

export function HeadingBlock({ translation }: BlockProps) {
  if (!translation?.heading) return null;
  return (
    <Reveal className={styles.sectionHead}>
      <h2 className={styles.sectionTitle}>{translation.heading}</h2>
    </Reveal>
  );
}

export function RichTextBlock({ translation }: BlockProps) {
  if (!translation?.body && !translation?.bodyHtml) return null;
  return (
    <Reveal>
      <BodyHtml
        html={translation.bodyHtml}
        text={translation.body}
        className={styles.sectionBody}
      />
    </Reveal>
  );
}

export function ImageBlock({ block, translation }: BlockProps) {
  const alt = translation?.imageAlts?.[0] || translation?.heading || "";
  if (!block.images[0] && !block.videos[0]) return null;
  return (
    <Reveal className={styles.imageSolo}>
      <Media block={block} alt={alt} />
    </Reveal>
  );
}

export function VideoEmbedBlock({ block, translation }: BlockProps) {
  if (!block.videos[0] && !block.images[0]) return null;
  return (
    <Reveal className={styles.videoBlock}>
      <Media block={block} alt={translation?.heading || "Video"} />
    </Reveal>
  );
}

export function FeatureCardBlock({ block, translation }: BlockProps) {
  if (!translation?.heading && !translation?.body) return null;
  const icon = block.images[0];
  return (
    <article className={styles.featureCard}>
      {icon ? (
        <div className={styles.featureIcon}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon.src} alt="" />
        </div>
      ) : (
        <div className={styles.featureIcon} aria-hidden />
      )}
      {translation.heading ? (
        <h3 className={styles.featureTitle}>{translation.heading}</h3>
      ) : null}
      {translation.body || translation.bodyHtml ? (
        <BodyHtml
          html={translation.bodyHtml}
          text={translation.body}
          className={styles.featureBody}
        />
      ) : null}
      {translation.ctaUrl ? (
        <a href={translation.ctaUrl} className={styles.featureLink}>
          <span>{translation.ctaLabel || "Learn more"}</span>
          <ArrowUpRight size={14} strokeWidth={1.75} />
        </a>
      ) : null}
    </article>
  );
}

export function FeatureCardGridBlock({
  items,
  locale,
}: {
  items: ContentBlock[];
  locale: Locale;
}) {
  return (
    <Stagger className={styles.featureGrid}>
      {items.map((block) => (
        <StaggerItem key={block.id}>
          <FeatureCardBlock
            block={block}
            locale={locale}
            translation={tOf(block, locale)}
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function StatCounterBlock({ block, translation }: BlockProps) {
  return (
    <div className={styles.statItem}>
      <div className={styles.statValue}>{block.statValue || "—"}</div>
      {translation?.heading ? (
        <div className={styles.statLabel}>{translation.heading}</div>
      ) : null}
    </div>
  );
}

export function StatGridBlock({
  items,
  locale,
}: {
  items: ContentBlock[];
  locale: Locale;
}) {
  return (
    <Reveal>
      <div className={styles.statGrid}>
        {items.map((block) => (
          <StatCounterBlock
            key={block.id}
            block={block}
            locale={locale}
            translation={tOf(block, locale)}
          />
        ))}
      </div>
    </Reveal>
  );
}

export function IconListBlock({ translation }: BlockProps) {
  const items = translation?.listItems || [];
  if (!items.length) return null;
  return (
    <Reveal>
      {translation?.heading ? (
        <h2 className={styles.sectionTitle} style={{ marginBottom: "1.25rem" }}>
          {translation.heading}
        </h2>
      ) : null}
      <ul className={styles.iconList}>
        {items.map((item) => (
          <li key={item}>
            <span className={styles.iconListMark} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function CtaButtonBlock({ translation }: BlockProps) {
  if (!translation?.ctaUrl) return null;
  return (
    <Reveal className={styles.ctaRow}>
      <a href={translation.ctaUrl} className={styles.ctaPrimary}>
        {translation.ctaLabel || translation.heading || "Continue"}
        <ArrowUpRight size={16} strokeWidth={1.75} />
      </a>
    </Reveal>
  );
}

export function DualCtaBlock({ translation }: BlockProps) {
  const links = translation?.links || [];
  if (!links.length) return null;
  return (
    <Reveal className={styles.ctaRow}>
      {links.slice(0, 2).map((link, i) => (
        <a
          key={link.href + link.label}
          href={link.href}
          className={i === 0 ? styles.ctaPrimary : styles.ctaSecondary}
        >
          {link.label}
        </a>
      ))}
    </Reveal>
  );
}

export function ImageTextRowBlock({ block, translation }: BlockProps) {
  const alt = translation?.imageAlts?.[0] || translation?.heading || "";
  const imageRight =
    block.layout.imagePosition === "right" ||
    block.layout.columnIndex > 0;
  return (
    <Reveal
      className={`${styles.mediaRow} ${imageRight ? styles.mediaRowReverse : styles.mediaRowNormal}`}
    >
      <div className={styles.mediaRowVisual}>
        <Media block={block} alt={alt} />
      </div>
      <div className={styles.mediaRowCopy}>
        {translation?.heading ? (
          <h2 className={styles.sectionTitle}>{translation.heading}</h2>
        ) : null}
        <BodyHtml
          html={translation?.bodyHtml || null}
          text={translation?.body || null}
          className={styles.sectionBody}
        />
        {translation?.ctaUrl ? (
          <a href={translation.ctaUrl} className={styles.ctaSecondary} style={{ marginTop: "1.25rem" }}>
            {translation.ctaLabel || "Learn more"}
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}

export function HeroBlock({
  block,
  translation,
  eyebrow,
}: BlockProps & { eyebrow?: string }) {
  const alt = translation?.imageAlts?.[0] || translation?.heading || "";
  const hasMedia = block.images[0] || block.videos[0];
  const mediaLeft = block.layout.imagePosition === "left";

  return (
    <section
      className={`${styles.hero} ${mediaLeft ? styles.heroMediaLeft : ""}`}
    >
      <Reveal className="heroCopy" as="div">
        {eyebrow ? <div className={styles.heroEyebrow}>{eyebrow}</div> : null}
        {translation?.heading ? (
          <h1 className={styles.heroTitle}>{translation.heading}</h1>
        ) : null}
        <BodyHtml
          html={translation?.bodyHtml || null}
          text={translation?.body || null}
          className={styles.heroBody}
        />
        {translation?.ctaUrl ? (
          <a href={translation.ctaUrl} className={styles.heroCta}>
            {translation.ctaLabel || "Request a demo"}
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </a>
        ) : null}
      </Reveal>
      {hasMedia ? (
        <Reveal className={styles.heroMedia} delay={0.08}>
          <Media block={block} alt={alt} />
        </Reveal>
      ) : (
        <div className={styles.heroMedia} aria-hidden />
      )}
    </section>
  );
}

export function LogoGridBlock({ block }: BlockProps) {
  const images = block.images;
  if (!images.length) return null;
  return (
    <Reveal>
      <div className={styles.logoGrid}>
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={img.src} src={img.src} alt="" loading="lazy" />
        ))}
      </div>
    </Reveal>
  );
}

export function TeamMemberBlock({ block, translation }: BlockProps) {
  return (
    <article className={styles.personCard}>
      {block.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.images[0].src} alt={translation?.heading || ""} />
      ) : null}
      {translation?.heading ? (
        <h3 className={styles.featureTitle}>{translation.heading}</h3>
      ) : null}
      <BodyHtml
        html={translation?.bodyHtml || null}
        text={translation?.body || null}
        className={styles.featureBody}
      />
    </article>
  );
}

export function TestimonialBlock({ translation }: BlockProps) {
  return (
    <Reveal className={styles.personCard}>
      <blockquote className={styles.quote}>
        {translation?.body || translation?.heading}
      </blockquote>
      {translation?.heading && translation.body ? (
        <p className={styles.featureBody} style={{ marginTop: "1rem" }}>
          {translation.heading}
        </p>
      ) : null}
    </Reveal>
  );
}

export function FaqAccordionBlock({ translation }: BlockProps) {
  const items = translation?.listItems || [];
  if (items.length) {
    return (
      <Reveal className={styles.accordion}>
        {items.map((item, i) => (
          <details key={i} className={styles.accordionItem}>
            <summary>{item}</summary>
          </details>
        ))}
      </Reveal>
    );
  }
  return (
    <Reveal className={styles.accordion}>
      <details className={styles.accordionItem} open>
        <summary>{translation?.heading || "Details"}</summary>
        <div className={styles.accordionBody}>
          <BodyHtml
            html={translation?.bodyHtml || null}
            text={translation?.body || null}
          />
        </div>
      </details>
    </Reveal>
  );
}

export function TimelineBlock({ translation }: BlockProps) {
  const items = translation?.listItems?.length
    ? translation.listItems
    : translation?.heading
      ? [translation.heading]
      : [];
  if (!items.length) return null;
  return (
    <Reveal className={styles.timeline}>
      {items.map((item) => (
        <div key={item} className={styles.timelineItem}>
          <p className={styles.featureBody}>{item}</p>
        </div>
      ))}
    </Reveal>
  );
}

export function FormEmbedBlock({ translation }: BlockProps) {
  return (
    <Reveal className={styles.panel}>
      <h2 className={styles.sectionTitle}>
        {translation?.heading || "Get in touch"}
      </h2>
      <BodyHtml
        html={translation?.bodyHtml || null}
        text={translation?.body || null}
        className={styles.sectionBody}
      />
      {translation?.ctaUrl ? (
        <a href={translation.ctaUrl} className={styles.ctaPrimary} style={{ marginTop: "1.5rem" }}>
          {translation.ctaLabel || "Contact"}
        </a>
      ) : null}
    </Reveal>
  );
}

export function GalleryBlock({ block }: BlockProps) {
  if (!block.images.length) return null;
  return (
    <Reveal className={styles.galleryGrid}>
      {block.images.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={img.src + i} src={img.src} alt="" loading="lazy" />
      ))}
    </Reveal>
  );
}

export function MapEmbedBlock() {
  return (
    <Reveal className={styles.mapEmbed}>
      <div aria-label="Map" />
    </Reveal>
  );
}

export function BlogPostsBlock({ translation }: BlockProps) {
  return (
    <Reveal className={styles.panel}>
      <h2 className={styles.sectionTitle}>{translation?.heading || "News"}</h2>
      <BodyHtml
        html={translation?.bodyHtml || null}
        text={translation?.body || null}
        className={styles.sectionBody}
      />
    </Reveal>
  );
}

export function SlidesBlock({ block, translation }: BlockProps) {
  return <ImageBlock block={block} locale={"en"} translation={translation} />;
}

export function SocialIconsBlock({ translation }: BlockProps) {
  const links = translation?.links || [];
  if (!links.length) return null;
  return (
    <Reveal className={styles.ctaRow}>
      {links.map((l) => (
        <a key={l.href} href={l.href} className={styles.ctaSecondary}>
          {l.label || l.href}
        </a>
      ))}
    </Reveal>
  );
}

export function SpacerBlock() {
  return <div className={styles.spacer} aria-hidden />;
}

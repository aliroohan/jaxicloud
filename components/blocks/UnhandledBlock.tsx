import type { ContentBlock, Locale } from "@/lib/content/blocks";
import styles from "./UnhandledBlock.module.css";

type Props = {
  block: ContentBlock;
  locale: Locale;
  hasTranslation: boolean;
};

/**
 * Visible placeholder for taxonomy types that do not have a renderer yet.
 * Loud in development; muted but still present in production so layout gaps
 * are obvious during incremental rollout.
 */
export function UnhandledBlock({ block, locale, hasTranslation }: Props) {
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev) {
    return (
      <section
        className={styles.quiet}
        data-block-type={block.type}
        data-block-id={block.id}
        aria-hidden="true"
      />
    );
  }

  const heading =
    block.translations[locale]?.heading ||
    block.translations.en?.heading ||
    null;

  return (
    <section
      className={styles.dev}
      data-block-type={block.type}
      data-block-id={block.id}
    >
      <header className={styles.header}>
        <span className={styles.badge}>unhandled block</span>
        <code className={styles.type}>{block.type}</code>
        <span className={styles.meta}>
          {block.id} · order {block.order} · {block.widgetType}
          {!hasTranslation ? " · missing translation" : ""}
        </span>
      </header>
      {heading ? <p className={styles.heading}>{heading}</p> : null}
      {block.statValue ? (
        <p className={styles.stat}>stat: {block.statValue}</p>
      ) : null}
      {block.videos[0] ? (
        <p className={styles.media}>video: {block.videos[0].src}</p>
      ) : null}
      {block.layout.image ? (
        <p className={styles.media}>image: {block.layout.image}</p>
      ) : null}
    </section>
  );
}

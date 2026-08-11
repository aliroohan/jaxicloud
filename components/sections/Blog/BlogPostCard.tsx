import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { withLocale, type Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/lib/types";
import styles from "./BlogPostCard.module.css";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function BlogPostCard({
  post,
  locale,
  readMoreLabel = "Read Article",
}: {
  post: BlogPost;
  locale: Locale;
  readMoreLabel?: string;
}) {
  const href = withLocale(locale, `/blog/${post.slug}`);
  const primaryTag = post.tags?.[0];
  const dateLabel = formatDate(post.publishedAt);

  return (
    <Link href={href} className={styles.card}>
      <div className={styles.imageWrapper}>
        {post.coverImage?.url ? (
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          {primaryTag ? <span className={styles.tag}>{primaryTag}</span> : <span />}
          <span className={styles.metaRight}>
            {dateLabel}
            {post.readingTimeMinutes ? ` · ${post.readingTimeMinutes} min read` : ""}
          </span>
        </div>
        <h3 className={styles.cardTitle}>{post.title}</h3>
        {post.excerpt ? <p className={styles.excerpt}>{post.excerpt}</p> : null}
        <div className={styles.readMore}>
          {readMoreLabel}
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

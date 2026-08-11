import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { ChevronRight } from "lucide-react";
import { isLocale, withLocale, type Locale } from "@/lib/i18n/config";
import { getBlogPostBySlug } from "@/lib/queries";
import { BlogPostCard } from "@/components/sections/Blog/BlogPostCard";
import styles from "../blog.module.css";

export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "figure", "figcaption", "video", "iframe"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height"],
    a: ["href", "name", "target", "rel"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder"],
  },
  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPostBySlug(slug);
  if (!data) return { title: "Post not found" };
  const { post } = data;

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || "";
  const ogImage = post.ogImage || post.coverImage?.url;

  return {
    title: `${title} | JaxiCloud Blog`,
    description,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  const data = await getBlogPostBySlug(slug);
  if (!data) notFound();
  const { post, relatedPosts } = data;

  const sanitizedHtml = sanitizeHtml(post.contentHtml || "", SANITIZE_OPTIONS);

  return (
    <div className={styles.detailWrapper}>
      <div className={styles.detailContainer}>
        <nav className={styles.breadcrumb}>
          <Link href={withLocale(locale, "/blog")}>Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{post.title}</span>
        </nav>

        {post.tags && post.tags.length > 0 && (
          <div className={styles.detailTagRow}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.detailTag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className={styles.detailTitle}>{post.title}</h1>

        <div className={styles.byline}>
          {post.author?.avatarUrl ? (
            <div className={styles.avatar}>
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name || "Author"}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
            <div className={styles.avatar} />
          )}
          <div className={styles.authorMeta}>
            <div className={styles.authorName}>{post.author?.name || "JaxiCloud Team"}</div>
            <div className={styles.authorSub}>
              {formatDate(post.publishedAt)}
              {post.readingTimeMinutes ? ` · ${post.readingTimeMinutes} min read` : ""}
            </div>
          </div>
        </div>

        {post.coverImage?.url && (
          <div className={styles.coverImage}>
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}

        <div
          className={styles.proseContent}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>

      {relatedPosts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Related Articles</h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((related) => (
              <BlogPostCard key={related.id} post={related} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

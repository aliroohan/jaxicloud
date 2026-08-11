import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, LOCALES, withLocale, type Locale } from "@/lib/i18n/config";
import { getBlogTags, getPublishedBlogPosts } from "@/lib/queries";
import { BlogPostCard } from "@/components/sections/Blog/BlogPostCard";
import { BlogFilters } from "./BlogFilters";
import styles from "./blog.module.css";

export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; q?: string; tag?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return { title: "Blog" };
  return {
    title: "Blog | JaxiCloud",
    description: "Insights, product updates, and fleet intelligence from the JaxiCloud team.",
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, withLocale(l, "/blog")])),
    },
  };
}

export default async function BlogIndexPage({ params, searchParams }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ posts, totalPages }, tags] = await Promise.all([
    getPublishedBlogPosts({ page, q: sp.q, tag: sp.tag }),
    getBlogTags(),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.headerBlock}>
          <div className={styles.sectionTag}>NEWS &amp; INSIGHTS</div>
          <h1 className={styles.pageTitle}>Latest from our Intelligence Hub</h1>
        </div>

        <BlogFilters tags={tags} />

        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateTitle}>No articles found</p>
            <p>
              {sp.q || sp.tag
                ? "Try adjusting your search or filters."
                : "New articles are coming soon — check back shortly."}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} locale={locale} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <a
                  href={buildPageHref(sp, page - 1)}
                  className={`${styles.pageBtn} ${page <= 1 ? styles.pageBtnDisabled : ""}`}
                >
                  Previous
                </a>
                <span className={styles.pageInfo}>
                  Page {page} of {totalPages}
                </span>
                <a
                  href={buildPageHref(sp, page + 1)}
                  className={`${styles.pageBtn} ${page >= totalPages ? styles.pageBtnDisabled : ""}`}
                >
                  Next
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function buildPageHref(sp: { q?: string; tag?: string }, page: number) {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.tag) params.set("tag", sp.tag);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}

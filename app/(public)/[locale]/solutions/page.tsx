import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  isLocale,
  LOCALES,
  UI_COPY,
  withLocale,
  type Locale,
} from "@/lib/i18n/config";
import {
  getLocalizedPage,
  listSolutionSlugs,
} from "@/lib/content/listSolutions";
import styles from "./solutions-index.module.css";

export const dynamicParams = false;
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return { title: "Solutions" };
  return {
    title: UI_COPY[localeParam].solutions,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, withLocale(l, "/solutions")]),
      ),
    },
  };
}

export default async function LocalizedSolutionsIndex({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const copy = UI_COPY[locale];
  const slugs = listSolutionSlugs();

  const items = slugs.map((slug) => {
    const { page, description } = getLocalizedPage(slug, locale);
    return {
      slug,
      title: page.titles[locale] || page.titles.en || slug,
      description,
    };
  });

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>{copy.allSolutions}</p>
            <h1 className={styles.title}>{copy.solutions}</h1>
          </div>
          <div>
            <p className={styles.lede}>{copy.solutionsIndexLede}</p>
            <div style={{ marginTop: "1.75rem" }}>
              <div className={styles.count}>{items.length}</div>
              <div className={styles.countLabel}>{copy.allSolutions}</div>
            </div>
          </div>
        </header>

        <div className={styles.grid}>
          {items.map((item) => (
            <Link
              key={item.slug}
              href={withLocale(locale, `/solutions/${item.slug}`)}
              className={styles.card}
            >
              <div>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                {item.description ? (
                  <p className={styles.cardBody}>{item.description}</p>
                ) : null}
              </div>
              <div className={styles.cardMeta}>
                <span>{item.slug}</span>
                <span className={styles.cardIcon} aria-hidden>
                  <ArrowUpRight size={14} strokeWidth={2} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

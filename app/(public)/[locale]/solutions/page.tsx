import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/blocks/blocks.module.css";
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
import { ArrowUpRight } from "lucide-react";

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
      blockCount: page.blocks.length,
    };
  });

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header style={{ padding: "clamp(2.5rem, 6vw, 5rem) 0 2rem" }}>
          <p className={styles.heroEyebrow}>{copy.allSolutions}</p>
          <h1 className={styles.heroTitle} style={{ maxWidth: "12ch" }}>
            {copy.solutions}
          </h1>
        </header>

        <div className={styles.indexGrid} style={{ paddingBottom: "5rem" }}>
          {items.map((item, index) => (
            <Link
              key={item.slug}
              href={withLocale(locale, `/solutions/${item.slug}`)}
              className={styles.indexCard}
              style={index % 3 === 1 ? { marginTop: "1.25rem" } : undefined}
            >
              <div>
                <h2 className={styles.indexCardTitle}>{item.title}</h2>
                {item.description ? (
                  <p className={styles.featureBody}>
                    {item.description.slice(0, 140)}
                    {item.description.length > 140 ? "…" : ""}
                  </p>
                ) : null}
              </div>
              <div
                className={styles.indexCardMeta}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{item.slug}</span>
                <ArrowUpRight size={16} strokeWidth={1.75} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

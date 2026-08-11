import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SolutionBlocks } from "@/components/blocks/SolutionBlocks";
import styles from "@/components/blocks/blocks.module.css";
import {
  isLocale,
  UI_COPY,
  withLocale,
  type Locale,
} from "@/lib/i18n/config";
import {
  getLocalizedPage,
  listSolutionSlugs,
} from "@/lib/content/listSolutions";
import { LOCALES } from "@/lib/content/blocks";

export const dynamicParams = false;
export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const slugs = listSolutionSlugs();
  return LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return { title: "Not found" };
  try {
    const { title, description } = getLocalizedPage(slug, localeParam);
    return {
      title,
      description: description || undefined,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, withLocale(l, `/solutions/${slug}`)]),
        ),
      },
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function LocalizedSolutionPage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  let page;
  let title: string;
  try {
    const localized = getLocalizedPage(slug, locale);
    page = localized.page;
    title = page.titles[locale] || page.titles.en || slug;
  } catch {
    notFound();
  }

  const copy = UI_COPY[locale];

  return (
    <article className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href={withLocale(locale, "/solutions")}>{copy.solutions}</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span>{title}</span>
        </nav>

        <SolutionBlocks
          blocks={page.blocks}
          locale={locale}
          eyebrow={copy.solutions}
        />
      </div>
    </article>
  );
}

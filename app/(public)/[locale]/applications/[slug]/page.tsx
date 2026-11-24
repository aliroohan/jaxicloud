import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SolutionBlocks } from "@/components/blocks/SolutionBlocks";
import styles from "@/components/blocks/blocks.module.css";
import { getSolutionLayout } from "@/components/solutions/registry";
import {
  isLocale,
  UI_COPY,
  withLocale,
  type Locale,
} from "@/lib/i18n/config";
import {
  getLocalizedPage,
  listApplicationSlugs,
} from "@/lib/content/listSolutions";
import { LOCALES } from "@/lib/content/blocks";

export const dynamicParams = true;
export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const slugs = listApplicationSlugs();
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
          LOCALES.map((l) => [l, withLocale(l, `/applications/${slug}`)]),
        ),
      },
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function ApplicationSlugPage({ params }: Props) {
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
  const Layout = getSolutionLayout(slug);
  const contactHref = withLocale(locale, "/contact");

  if (Layout) {
    return (
      <Layout
        page={page}
        locale={locale}
        eyebrow="Applications"
        requestDemoLabel={copy.requestDemo}
        contactHref={contactHref}
      />
    );
  }

  return (
    <article className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href={withLocale(locale, "/applications")}>Applications</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span>{title}</span>
        </nav>

        <SolutionBlocks
          blocks={page.blocks}
          locale={locale}
          eyebrow="Applications"
        />
      </div>
    </article>
  );
}

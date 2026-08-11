import fs from "node:fs";
import path from "node:path";
import { getPageDataUncached, listPageSlugs } from "@/lib/content/getPageData";
import type { Locale, SolutionPage } from "@/lib/content/blocks";

const PAGES_DIR = path.join(process.cwd(), "data", "pages");

/** Solution-kind content pages (excludes marketing/legal orphans). */
export function listSolutionSlugs(): string[] {
  return listPageSlugs().filter((slug) => {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(PAGES_DIR, `${slug}.json`), "utf8"),
      ) as { pageKind?: string };
      return raw.pageKind === "solution";
    } catch {
      return false;
    }
  });
}

export function listContentSlugsByKind(
  kind: "solution" | "marketing" | "legal" | "blog" | "system",
): string[] {
  return listPageSlugs().filter((slug) => {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(PAGES_DIR, `${slug}.json`), "utf8"),
      ) as { pageKind?: string };
      return raw.pageKind === kind;
    } catch {
      return false;
    }
  });
}

export function getLocalizedPage(
  slug: string,
  locale: Locale,
): { page: SolutionPage; title: string; description: string | null } {
  const page = getPageDataUncached(slug);
  const title =
    page.titles[locale] || page.titles.en || page.slug;
  const seo = page.seo[locale] || page.seo.en;
  return {
    page,
    title: seo?.title || title,
    description: seo?.description || null,
  };
}

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { ZodError } from "zod";
import {
  solutionPageSchema,
  type SolutionPage,
} from "@/lib/content/blocks";

const PAGES_DIR = path.join(process.cwd(), "data", "pages");

function formatZodError(slug: string, err: ZodError): string {
  const lines = err.issues.slice(0, 20).map((issue) => {
    const where = issue.path.length ? issue.path.join(".") : "(root)";
    return `  - ${where}: ${issue.message}`;
  });
  const more =
    err.issues.length > 20 ? `\n  …and ${err.issues.length - 20} more` : "";
  return (
    `Invalid page data for "${slug}" (${path.join("data/pages", `${slug}.json`)}):\n` +
    lines.join("\n") +
    more
  );
}

/**
 * Load and validate a merged solution/marketing page from `data/pages/{slug}.json`.
 * Throws a loud, path-aware error on missing files or Zod failures so bad content
 * fails at build time instead of silently in production.
 */
export function getPageDataUncached(slug: string): SolutionPage {
  const safe = slug.replace(/[^a-z0-9-_]/gi, "");
  if (!safe || safe !== slug) {
    throw new Error(`Invalid page slug: ${JSON.stringify(slug)}`);
  }

  const filePath = path.join(PAGES_DIR, `${safe}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Page data not found: data/pages/${safe}.json`);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    throw new Error(
      `Failed to parse data/pages/${safe}.json: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const result = solutionPageSchema.safeParse(raw);
  if (!result.success) {
    // Attach block id when the path points into blocks[n]
    const blockHints = result.error.issues
      .map((issue) => {
        if (issue.path[0] === "blocks" && typeof issue.path[1] === "number") {
          const blocks = (raw as { blocks?: Array<{ id?: string }> }).blocks;
          const id = blocks?.[issue.path[1]]?.id;
          return id ? `block ${id}` : null;
        }
        return null;
      })
      .filter(Boolean);
    const hint =
      blockHints.length > 0 ? `\n  Affected: ${[...new Set(blockHints)].join(", ")}` : "";
    throw new Error(formatZodError(safe, result.error) + hint);
  }

  return result.data;
}

/** Cached loader for server components / generateStaticParams. */
export const getPageData = cache(getPageDataUncached);

/** List all merged page slugs (excludes report files). */
export function listPageSlugs(): string[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/**
 * Legacy CMS route — send visitors to the localized content pages.
 * Special-case `construction` stays on its dedicated client page.
 */
export default async function LegacySolutionRedirect({ params }: Props) {
  const { slug } = await params;
  if (slug === "construction") {
    redirect("/solutions/construction");
  }
  redirect(`/en/solutions/${slug}`);
}

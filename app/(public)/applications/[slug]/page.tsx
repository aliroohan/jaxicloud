import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function LegacyApplicationRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/en/applications/${slug}`);
}

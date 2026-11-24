import type { ContentBlock, Locale, SolutionPage } from "@/lib/content/blocks";

export type SolutionLayoutProps = {
  page: SolutionPage;
  locale: Locale;
  eyebrow: string;
  requestDemoLabel: string;
  contactHref: string;
};

export type LocalizedText = {
  heading: string | null;
  body: string | null;
  bodyHtml: string | null;
  listItems: string[];
  links: { label: string; href: string }[];
  ctaLabel: string | null;
  ctaUrl: string | null;
  imageAlts: string[];
};

export type ResolvedBlock = {
  block: ContentBlock;
  text: LocalizedText;
};

export type ContentSection = {
  heading: ResolvedBlock | null;
  bodies: ResolvedBlock[];
  images: ResolvedBlock[];
  videos: ResolvedBlock[];
  features: ResolvedBlock[];
  stats: ResolvedBlock[];
  list: ResolvedBlock | null;
  ctas: ResolvedBlock[];
  gallery: ResolvedBlock | null;
  form: ResolvedBlock | null;
};

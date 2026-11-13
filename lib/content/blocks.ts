import { z } from "zod";

export const LOCALES = ["da", "en", "de", "fr", "nl", "nb", "sv", "tr"] as const;
export type Locale = (typeof LOCALES)[number];

export const localeSchema = z.enum(LOCALES);

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const imageSchema = z.object({
  src: z.string().min(1),
  width: z.number().nullable(),
  height: z.number().nullable(),
});

const videoSchema = z.object({
  src: z.string().min(1),
  provider: z.enum(["hosted", "youtube", "vimeo", "unknown"]).or(z.string()),
  poster: z.string().nullable(),
  lightbox: z.boolean(),
});

const layoutSchema = z.object({
  imagePosition: z
    .enum(["left", "right", "none", "full"])
    .nullable(),
  columnCount: z.number().int().nonnegative(),
  columnIndex: z.number().int().nonnegative(),
  isFullWidth: z.boolean(),
  reverseMobile: z.boolean(),
  image: z.string().nullable(),
});

const translationSchema = z.object({
  heading: z.string().nullable(),
  body: z.string().nullable(),
  bodyHtml: z.string().nullable(),
  listItems: z.array(z.string()),
  links: z.array(linkSchema),
  ctaLabel: z.string().nullable(),
  ctaUrl: z.string().nullable(),
  imageAlts: z.array(z.string()),
});

const translationsSchema = z
  .partialRecord(localeSchema, translationSchema)
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "translations must include at least one locale",
  });

const blockBaseSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().nonnegative(),
  sectionIndex: z.number().int().nonnegative(),
  widgetType: z.string().min(1),
  layout: layoutSchema,
  images: z.array(imageSchema),
  videos: z.array(videoSchema),
  statValue: z.string().nullable(),
  translations: translationsSchema,
});

/** All observed taxonomy types from docs/block-taxonomy.md */
export const BLOCK_TYPES = [
  "hero",
  "heading",
  "richText",
  "image",
  "imageTextRow",
  "featureCard",
  "featureCardGrid",
  "statCounter",
  "statGrid",
  "iconList",
  "ctaButton",
  "dualCta",
  "videoEmbed",
  "logoGrid",
  "teamMember",
  "testimonial",
  "faqAccordion",
  "timeline",
  "formEmbed",
  "gallery",
  "mapEmbed",
  "blogPosts",
  "slides",
  "socialIcons",
  "spacer",
  "unknown",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

function blockOf<T extends BlockType>(type: T) {
  return blockBaseSchema.extend({ type: z.literal(type) });
}

export const heroBlockSchema = blockOf("hero");
export const headingBlockSchema = blockOf("heading");
export const richTextBlockSchema = blockOf("richText");
export const imageBlockSchema = blockOf("image");
export const imageTextRowBlockSchema = blockOf("imageTextRow");
export const featureCardBlockSchema = blockOf("featureCard");
export const featureCardGridBlockSchema = blockOf("featureCardGrid");
export const statCounterBlockSchema = blockOf("statCounter");
export const statGridBlockSchema = blockOf("statGrid");
export const iconListBlockSchema = blockOf("iconList");
export const ctaButtonBlockSchema = blockOf("ctaButton");
export const dualCtaBlockSchema = blockOf("dualCta");
export const videoEmbedBlockSchema = blockOf("videoEmbed");
export const logoGridBlockSchema = blockOf("logoGrid");
export const teamMemberBlockSchema = blockOf("teamMember");
export const testimonialBlockSchema = blockOf("testimonial");
export const faqAccordionBlockSchema = blockOf("faqAccordion");
export const timelineBlockSchema = blockOf("timeline");
export const formEmbedBlockSchema = blockOf("formEmbed");
export const galleryBlockSchema = blockOf("gallery");
export const mapEmbedBlockSchema = blockOf("mapEmbed");
export const blogPostsBlockSchema = blockOf("blogPosts");
export const slidesBlockSchema = blockOf("slides");
export const socialIconsBlockSchema = blockOf("socialIcons");
export const spacerBlockSchema = blockOf("spacer");
export const unknownBlockSchema = blockOf("unknown");

export const contentBlockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  headingBlockSchema,
  richTextBlockSchema,
  imageBlockSchema,
  imageTextRowBlockSchema,
  featureCardBlockSchema,
  featureCardGridBlockSchema,
  statCounterBlockSchema,
  statGridBlockSchema,
  iconListBlockSchema,
  ctaButtonBlockSchema,
  dualCtaBlockSchema,
  videoEmbedBlockSchema,
  logoGridBlockSchema,
  teamMemberBlockSchema,
  testimonialBlockSchema,
  faqAccordionBlockSchema,
  timelineBlockSchema,
  formEmbedBlockSchema,
  galleryBlockSchema,
  mapEmbedBlockSchema,
  blogPostsBlockSchema,
  slidesBlockSchema,
  socialIconsBlockSchema,
  spacerBlockSchema,
  unknownBlockSchema,
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type BlockTranslation = z.infer<typeof translationSchema>;

export const solutionPageSchema = z.object({
  slug: z.string().min(1),
  pageKind: z.string().min(1),
  titles: z.partialRecord(localeSchema, z.string()),
  seo: z.partialRecord(
    localeSchema,
    z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
    }),
  ),
  links: z.partialRecord(localeSchema, z.string()),
  blocks: z.array(contentBlockSchema),
});

export type SolutionPage = z.infer<typeof solutionPageSchema>;



export function resolveBlockTranslation(
  block: ContentBlock,
  locale: Locale,
): BlockTranslation | null {
  const t = block.translations;
  return t[locale] ?? t.en ?? Object.values(t)[0] ?? null;
}

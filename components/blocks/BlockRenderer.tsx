import type { ContentBlock, Locale } from "@/lib/content/blocks";
import { resolveBlockTranslation } from "@/lib/content/blocks";
import { UnhandledBlock } from "@/components/blocks/UnhandledBlock";
import {
  BlogPostsBlock,
  CtaButtonBlock,
  DualCtaBlock,
  FaqAccordionBlock,
  FeatureCardBlock,
  FormEmbedBlock,
  GalleryBlock,
  HeadingBlock,
  HeroBlock,
  IconListBlock,
  ImageBlock,
  ImageTextRowBlock,
  LogoGridBlock,
  MapEmbedBlock,
  RichTextBlock,
  SlidesBlock,
  SocialIconsBlock,
  SpacerBlock,
  StatCounterBlock,
  TeamMemberBlock,
  TestimonialBlock,
  TimelineBlock,
  VideoEmbedBlock,
} from "@/components/blocks/renderers";

type Props = {
  block: ContentBlock;
  locale: Locale;
};

/**
 * Dispatches a content block to its renderer.
 * Unknown/unimplemented types fall through to UnhandledBlock.
 */
export function BlockRenderer({ block, locale }: Props) {
  const translation = resolveBlockTranslation(block, locale);
  const props = { block, locale, translation };

  switch (block.type) {
    case "hero":
      return <HeroBlock {...props} />;
    case "heading":
      return <HeadingBlock {...props} />;
    case "richText":
      return <RichTextBlock {...props} />;
    case "image":
      return <ImageBlock {...props} />;
    case "imageTextRow":
      return <ImageTextRowBlock {...props} />;
    case "featureCard":
      return <FeatureCardBlock {...props} />;
    case "statCounter":
      return <StatCounterBlock {...props} />;
    case "iconList":
      return <IconListBlock {...props} />;
    case "ctaButton":
      return <CtaButtonBlock {...props} />;
    case "dualCta":
      return <DualCtaBlock {...props} />;
    case "videoEmbed":
      return <VideoEmbedBlock {...props} />;
    case "logoGrid":
      return <LogoGridBlock {...props} />;
    case "teamMember":
      return <TeamMemberBlock {...props} />;
    case "testimonial":
      return <TestimonialBlock {...props} />;
    case "faqAccordion":
      return <FaqAccordionBlock {...props} />;
    case "timeline":
      return <TimelineBlock {...props} />;
    case "formEmbed":
      return <FormEmbedBlock {...props} />;
    case "gallery":
      return <GalleryBlock {...props} />;
    case "mapEmbed":
      return <MapEmbedBlock />;
    case "blogPosts":
      return <BlogPostsBlock {...props} />;
    case "slides":
      return <SlidesBlock {...props} />;
    case "socialIcons":
      return <SocialIconsBlock {...props} />;
    case "spacer":
      return <SpacerBlock />;
    case "featureCardGrid":
    case "statGrid":
    case "unknown":
    default:
      return (
        <UnhandledBlock
          block={block}
          locale={locale}
          hasTranslation={!!translation}
        />
      );
  }
}

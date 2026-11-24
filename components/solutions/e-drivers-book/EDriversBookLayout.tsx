import {
  bodyText,
  headingText,
  resolve,
  stripHtml,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
  Breadcrumb,
  DemoCta,
  SolutionShell,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type {
  ResolvedBlock,
  SolutionLayoutProps,
} from "@/components/solutions/shared/types";
import { Reveal } from "@/components/blocks/Motion";
import { withLocale } from "@/lib/i18n/config";
import {
  BadgeCheck,
  Clock3,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import styles from "./EDriversBookLayout.module.css";

/** Resolve a block by stable `order` so layout mapping stays locale-agnostic. */
function at(
  blocks: SolutionLayoutProps["page"]["blocks"],
  locale: SolutionLayoutProps["locale"],
  order: number,
): ResolvedBlock | null {
  const block = blocks.find((b) => b.order === order);
  return block ? resolve(block, locale) : null;
}

function proseHtml(r: ResolvedBlock | null): string {
  if (!r) return "";
  if (r.text.bodyHtml?.trim()) return r.text.bodyHtml;
  const plain = bodyText(r) || stripHtml(r.text.bodyHtml);
  return plain ? `<p>${plain}</p>` : "";
}

function hasMedia(r: ResolvedBlock | null): boolean {
  return Boolean(r && (r.block.images[0]?.src || r.block.layout.image));
}

const FEATURE_ICONS = [MapPinned, Clock3, BadgeCheck, ShieldCheck];

function FeatureCard({
  text,
  index,
}: {
  text: string;
  index: number;
}) {
  if (!text) return null;
  const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
  return (
    <Reveal delay={0.06 + index * 0.05} className={styles.featureCard}>
      <span className={styles.featureIcon} aria-hidden>
        <Icon size={20} strokeWidth={2} />
      </span>
      <p className={styles.featureText}>{text}</p>
    </Reveal>
  );
}

function ShotPair({
  a,
  b,
  frameClass,
  startIndex,
}: {
  a: ResolvedBlock | null;
  b: ResolvedBlock | null;
  frameClass: string;
  startIndex: number;
}) {
  const showA = hasMedia(a);
  const showB = hasMedia(b);
  if (!showA && !showB) return null;
  return (
    <div className={styles.shotRow}>
      {showA && a ? (
        <Reveal delay={0.04} from="left" className={styles.shotSlot}>
          <BlockMedia
            block={a}
            className={frameClass}
            priority={startIndex === 0}
          />
        </Reveal>
      ) : null}
      {showB && b ? (
        <Reveal delay={0.09} from="right" className={styles.shotSlot}>
          <BlockMedia block={b} className={frameClass} />
        </Reveal>
      ) : null}
    </div>
  );
}

export function EDriversBookLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const blocks = page.blocks;

  const pageTitle = at(blocks, locale, 0);
  const introH = at(blocks, locale, 1);
  const introBody = at(blocks, locale, 2);
  const introImg = at(blocks, locale, 3);

  const feature1 = at(blocks, locale, 4);
  const feature2 = at(blocks, locale, 5);
  const feature3 = at(blocks, locale, 6);
  const feature4 = at(blocks, locale, 7);

  const desktopShot1 = at(blocks, locale, 8);
  const desktopShot2 = at(blocks, locale, 9);

  const mobileShot1 = at(blocks, locale, 10);
  const mobileShot2 = at(blocks, locale, 11);

  const heroTitle = headingText(pageTitle) || title;
  const introHeading = headingText(introH);
  const introHtml = proseHtml(introBody);

  const features = [feature1, feature2, feature3, feature4]
    .map((f) => bodyText(f) || stripHtml(f?.text.bodyHtml))
    .filter(Boolean) as string[];

  const introHasMedia = hasMedia(introImg);

  return (
    <SolutionShell className={styles.page}>
      <Wrap>
        <Breadcrumb
          localeHref={withLocale(locale, "/solutions")}
          label={eyebrow}
          title={title}
        />
      </Wrap>

      <Wrap>
        <section className={styles.hero}>
          <Reveal>
            <h1 className={`${p.display} ${styles.title}`}>{heroTitle}</h1>
          </Reveal>
        </section>

        {(introHeading || introHtml || introHasMedia) && (
          <section className={styles.intro}>
            <Reveal from="left" className={styles.introCopy}>
              <div className={styles.copy}>
                {introHeading ? (
                  <h2 className={`${p.display} ${styles.introHeading}`}>
                    {introHeading}
                  </h2>
                ) : null}
                {introHtml ? (
                  <div
                    className={styles.introProse}
                    dangerouslySetInnerHTML={{ __html: introHtml }}
                  />
                ) : null}
              </div>
            </Reveal>
            <Reveal delay={0.05} from="right" className={styles.introMediaSlot}>
              {introHasMedia && introImg ? (
                <BlockMedia
                  block={introImg}
                  className={styles.introFrame}
                  priority
                />
              ) : null}
            </Reveal>
          </section>
        )}

        {features.length > 0 && (
          <div className={styles.featureGrid}>
            {features.map((text, i) => (
              <FeatureCard key={i} text={text} index={i} />
            ))}
          </div>
        )}

        <ShotPair
          a={desktopShot1}
          b={desktopShot2}
          frameClass={styles.desktopFrame}
          startIndex={0}
        />

        <ShotPair
          a={mobileShot1}
          b={mobileShot2}
          frameClass={styles.mobileFrame}
          startIndex={2}
        />

        <div className={styles.ctaRow}>
          <DemoCta href={contactHref} label={requestDemoLabel} />
        </div>
      </Wrap>
    </SolutionShell>
  );
}

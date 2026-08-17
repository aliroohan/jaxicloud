import {
  bodyText,
  headingText,
  resolveAll,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
  Breadcrumb,
  DemoCta,
  Eyebrow,
  FeatureTile,
  IconList,
  SolutionShell,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type { SolutionLayoutProps } from "@/components/solutions/shared/types";
import { withLocale } from "@/lib/i18n/config";
import styles from "./JaxicloudPlatformLayout.module.css";

export function JaxicloudPlatformLayout({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;

  const images = resolveAll(
    page.blocks.filter((b) => b.type === "image" || b.type === "gallery"),
    locale,
  );
  const features = resolveAll(
    page.blocks.filter((b) => b.type === "featureCard"),
    locale,
  );
  const lists = resolveAll(
    page.blocks.filter((b) => b.type === "iconList"),
    locale,
  );

  // Hero title (Block 1)
  const heroHeadingBlock = page.blocks.find(
    (b) => b.type === "heading" && b.order === 0,
  );
  const heroTitle = heroHeadingBlock
    ? heroHeadingBlock.translations?.[locale]?.heading ||
      heroHeadingBlock.translations?.en?.heading ||
      title
    : title;

  // Tagline (Block 2: "One Platform. Total Control Over Your Fleet and Assets.")
  const taglineBlock = page.blocks.find(
    (b) => b.type === "heading" && b.order === 1,
  );
  const tagline =
    taglineBlock?.translations?.[locale]?.heading ||
    taglineBlock?.translations?.en?.heading ||
    "";

  // Hero body (Block 3: intro description)
  const bodyBlock = page.blocks.find(
    (b) => b.type === "richText" && b.order === 2,
  );
  const heroBody = bodyBlock
    ? bodyText({
        block: bodyBlock,
        text: {
          heading: null,
          body:
            bodyBlock.translations?.[locale]?.body ||
            bodyBlock.translations?.en?.body ||
            null,
          bodyHtml:
            bodyBlock.translations?.[locale]?.bodyHtml ||
            bodyBlock.translations?.en?.bodyHtml ||
            null,
          listItems: [],
          links: [],
          ctaLabel: null,
          ctaUrl: null,
          imageAlts: [],
        },
      })
    : "";

  const heroImage = images[0];

  // Features section heading (Block 5: "Key Features & Capabilities:")
  const featHeadingBlock = page.blocks.find(
    (b) => b.type === "heading" && b.order === 4,
  );
  const featSectionHeading =
    featHeadingBlock?.translations?.[locale]?.heading ||
    featHeadingBlock?.translations?.en?.heading ||
    "Key Features & Capabilities:";

  // How it works heading (Block 17: "How it works:")
  const howItWorksBlock = page.blocks.find(
    (b) => b.type === "heading" && b.order >= 14,
  );
  const howItWorksHeading =
    howItWorksBlock?.translations?.[locale]?.heading ||
    howItWorksBlock?.translations?.en?.heading ||
    "How it works:";

  const extraImages = images.slice(1);

  return (
    <SolutionShell className={styles.page}>
      {/* Breadcrumb */}
      <Wrap>
        <Breadcrumb
          localeHref={withLocale(locale, "/applications")}
          label={eyebrow}
          title={title}
        />
      </Wrap>

      {/* Hero */}
      <section className={styles.hero}>
        <Wrap>
          <div className={styles.heroPill}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={`${p.display} ${styles.heroTitle}`}>{heroTitle}</h1>
            {tagline && (
              <h2 className={`${p.display} ${styles.heroTagline}`}>
                {tagline}
              </h2>
            )}
            {heroBody && <p className={styles.heroBody}>{heroBody}</p>}
            <div className={styles.heroCta}>
              <DemoCta href={contactHref} label={requestDemoLabel} />
            </div>
          </div>
        </Wrap>
        <div className={styles.heroDeco} aria-hidden>
          <span className={styles.decoRing} />
          <span className={styles.decoGlow} />
        </div>
      </section>

      {/* Hero image - platform screenshot */}
      {heroImage && (
        <div className={styles.heroImageWrap}>
          <Wrap>
            <BlockMedia
              block={heroImage}
              className={styles.heroShot}
              priority
            />
          </Wrap>
        </div>
      )}

      {/* Platform features grid */}
      {features.length > 0 && (
        <section className={styles.featSection}>
          <Wrap>
            {featSectionHeading && (
              <h2 className={`${p.display} ${styles.featHeading}`}>
                {featSectionHeading}
              </h2>
            )}
            <div className={styles.featGrid}>
              {features.map((f, i) => (
                <div
                  key={f.block.id}
                  className={`${styles.featCard} ${
                    i === 0 ? styles.featCardWide : ""
                  }`}
                >
                  <div className={styles.featIconWrap} aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="currentColor"
                        opacity=".12"
                      />
                      <path
                        d="M6 10l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <FeatureTile block={f} />
                </div>
              ))}
            </div>
          </Wrap>
        </section>
      )}

      {/* How it works section */}
      {(howItWorksHeading || lists.length > 0) && (
        <section className={styles.howItWorksSection}>
          <Wrap>
            {extraImages.length > 0 && (
              <div className={styles.howItWorksMedia}>
                {extraImages.map((img) => (
                  <BlockMedia
                    key={img.block.id}
                    block={img}
                    className={styles.howItWorksShot}
                  />
                ))}
              </div>
            )}

            <div className={styles.howItWorksCenter}>
              {howItWorksHeading && (
                <h2 className={`${p.display} ${styles.howItWorksHeading}`}>
                  {howItWorksHeading}
                </h2>
              )}
              {lists.map((l) => (
                <div key={l.block.id} className={styles.listCard}>
                  <IconList block={l} />
                </div>
              ))}
            </div>
          </Wrap>
        </section>
      )}

      {/* CTA */}
      <section className={styles.ctaSection}>
        <Wrap>
          <div className={styles.ctaInner}>
            <h2 className={`${p.display} ${styles.ctaTitle}`}>
              The complete cloud platform for modern fleet management
            </h2>
            <p className={styles.ctaSub}>
              Connect every vehicle, driver, and data point under one unified
              platform.
            </p>
            <DemoCta href={contactHref} label={requestDemoLabel} />
          </div>
        </Wrap>
      </section>
    </SolutionShell>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/blocks/Motion";
import styles from "./primitives.module.css";
import { bodyText, headingText, imageAlt, imageSrc } from "./content";
import type { ResolvedBlock } from "./types";

export function SolutionShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`${styles.shell} ${className ?? ""}`}>{children}</article>
  );
}

export function Wrap({
  children,
  wide,
  className,
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div className={`${wide ? styles.wrapWide : styles.wrap} ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function Breadcrumb({
  localeHref,
  label,
  title,
}: {
  localeHref: string;
  label: string;
  title: string;
}) {
  return (
    <nav className={styles.crumb} aria-label="Breadcrumb">
      <Link href={localeHref}>{label}</Link>
      <span className={styles.crumbSep}>/</span>
      <span>{title}</span>
    </nav>
  );
}

export function Eyebrow({
  children,
  light,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`${styles.eyebrow} ${light ? styles.eyebrowLight : ""}`}>
      {children}
    </p>
  );
}

export function DemoCta({
  href,
  label,
  variant = "solid",
}: {
  href: string;
  label: string;
  variant?: "solid" | "ghost" | "onDark";
}) {
  const cls =
    variant === "ghost"
      ? styles.ctaGhost
      : variant === "onDark"
        ? styles.ctaOnDark
        : styles.cta;
  return (
    <Link href={href} className={cls}>
      <span>{label}</span>
      <span className={styles.ctaIcon} aria-hidden>
        <ArrowUpRight size={14} strokeWidth={2} />
      </span>
    </Link>
  );
}

export function MediaFrame({
  src,
  alt,
  className,
  priority,
  sizes = "(max-width: 900px) 100vw, 60vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`${styles.media} ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={styles.mediaImg}
        priority={priority}
      />
    </div>
  );
}

export function BlockProse({ block }: { block: ResolvedBlock }) {
  if (block.text.bodyHtml) {
    return (
      <div
        className={styles.proseHtml}
        dangerouslySetInnerHTML={{ __html: block.text.bodyHtml }}
      />
    );
  }
  const text = bodyText(block);
  if (!text) return null;
  return <p className={styles.body}>{text}</p>;
}

export function FeatureTile({ block }: { block: ResolvedBlock }) {
  const title = headingText(block);
  const body = bodyText(block);
  return (
    <Reveal>
      <div>
        {title ? <h3 className={styles.featureTitle}>{title}</h3> : null}
        {body ? <p className={styles.featureBody}>{body}</p> : null}
      </div>
    </Reveal>
  );
}

export function StatItem({ block }: { block: ResolvedBlock }) {
  return (
    <div>
      <div className={styles.statValue}>{block.block.statValue || "—"}</div>
      {(headingText(block) || bodyText(block)) && (
        <p className={styles.statLabel}>
          {headingText(block) || bodyText(block)}
        </p>
      )}
    </div>
  );
}

export function IconList({ block }: { block: ResolvedBlock }) {
  const items = block.text.listItems;
  if (!items.length) return null;
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item} className={styles.listItem}>
          <span className={styles.listBullet} aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function BlockMedia({
  block,
  className,
  priority,
}: {
  block: ResolvedBlock;
  className?: string;
  priority?: boolean;
}) {
  const src = imageSrc(block);
  if (!src) return null;
  return (
    <MediaFrame
      src={src}
      alt={imageAlt(block, headingText(block))}
      className={className}
      priority={priority}
    />
  );
}

export { styles as primitiveStyles };

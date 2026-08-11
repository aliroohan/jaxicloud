"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import type { HomeCopy } from "@/lib/i18n/pageCopy";
import { DEFAULT_LOCALE, stripLocale, withLocale } from "@/lib/i18n/config";
import type { BlogPost } from "@/lib/types";
import styles from "./BlogSection.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function BlogSection({ copy }: { copy: HomeCopy }) {
  const pathname = usePathname() || "/";
  const { locale: pathLocale } = stripLocale(pathname);
  const activeLocale = pathLocale || DEFAULT_LOCALE;

  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/blog?page=1&locale=${activeLocale}`)
      .then((res) => (res.ok ? res.json() : { posts: [] }))
      .then((data) => {
        if (!cancelled) setPosts((data.posts || []).slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [activeLocale]);

  const BLOG_POSTS = (posts || []).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    category: post.tags?.[0] || "",
    date: formatDate(post.publishedAt),
    image: post.coverImage?.url || "/blog-ai.png",
    link: withLocale(activeLocale, `/blog/${post.slug}`),
  }));

  const sectionRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const textMasksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  textMasksRef.current = [];
  const addToTextMasks = (el: HTMLSpanElement | null) => {
    if (el) textMasksRef.current.push(el);
  };

  cardsRef.current = [];
  const addToCards = (el: HTMLAnchorElement | null) => {
    if (el) cardsRef.current.push(el);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // 1. Tag Reveal
    if (tagRef.current) {
      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }

    // 2. Title Mask Reveal
    const textMasks = textMasksRef.current;
    if (textMasks.length) {
      tl.fromTo(
        textMasks,
        { y: "120%" },
        { y: "0%", duration: 0.8, stagger: 0.1, ease: "power4.out" },
        "-=0.2"
      );
    }

    // 3. Staggered Cards Reveal
    const cards = cardsRef.current;
    if (cards.length) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
        "-=0.4"
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
    };
  }, [BLOG_POSTS.length]);

  if (posts !== null && posts.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.headerBlock}>
          <div ref={tagRef} className={styles.sectionTag}>
            {copy.blogTag}
          </div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>{copy.blogTitleLine1}</span>
            </span>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={`${styles.textMaskInner} ${styles.sectionTitleHighlight}`}>{copy.blogTitleLine2}</span>
            </span>
          </h2>
        </div>

        {/* Blog Grid */}
        <div ref={cardsContainerRef} className={styles.grid}>
          {BLOG_POSTS.map((post) => (
            <motion.a
              key={post.id}
              href={post.link}
              ref={addToCards}
              className={styles.card}
              initial="rest"
              whileHover="hover"
              variants={{
                rest: { y: 0, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)" },
                hover: { y: -8, boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)" }
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className={styles.imageWrapper}>
                <motion.div
                  className={styles.image}
                  variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.05 }
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </motion.div>
              </div>
              <div className={styles.content}>
                <div className={styles.meta}>
                  <span className={styles.category}>{post.category}</span>
                  <span className={styles.date}>{post.date}</span>
                </div>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <div className={styles.readMore}>
                  {copy.blogReadMore}
                  <motion.div
                    className={styles.arrow}
                    variants={{
                      rest: { x: 0 },
                      hover: { x: 6 }
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}

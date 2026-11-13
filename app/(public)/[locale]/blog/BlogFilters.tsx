"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import styles from "./blog.module.css";

export function BlogFilters({ tags }: { tags: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }
  const activeTag = searchParams.get("tag") || "";
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ q: value || null });
    }, 400);
  };

  const toggleTag = (tag: string) => {
    pushParams({ tag: activeTag === tag ? null : tag });
  };

  return (
    <div className={styles.controls}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search articles..."
          className={styles.searchInput}
          aria-label="Search blog posts"
        />
      </div>
      {tags.length > 0 && (
        <div className={styles.tagRow}>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`${styles.tagChip} ${activeTag === tag ? styles.tagChipActive : ""}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

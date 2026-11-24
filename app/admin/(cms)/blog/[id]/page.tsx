"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import type { BlogPost } from "@/lib/types";

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/blog/${params.id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setPost(data.post);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!post) return <p className="text-slate-600">Loading…</p>;

  return <BlogPostForm initial={post} postId={post.id} />;
}

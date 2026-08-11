"use client";

import { useCallback, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";
import styles from "./RichTextEditor.module.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: placeholder || "Write the post body…",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-content",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        const url = window.prompt(
          data.error ||
            "Upload failed. Paste an image URL instead, or cancel.",
        );
        if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        return;
      }
      editor.chain().focus().setImage({ src: data.url, alt: data.alt || "" }).run();
    } catch {
      const url = window.prompt("Upload failed. Paste an image URL instead, or cancel.");
      if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    }
  }

  if (!editor) {
    return <div className={styles.wrapper} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button
          type="button"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.toolBtn} ${editor.isActive("bold") ? styles.toolBtnActive : ""}`}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.toolBtn} ${editor.isActive("italic") ? styles.toolBtnActive : ""}`}
        >
          <Italic className="h-4 w-4" />
        </button>
        <div className={styles.divider} />
        <button
          type="button"
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${styles.toolBtn} ${editor.isActive("heading", { level: 2 }) ? styles.toolBtnActive : ""}`}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${styles.toolBtn} ${editor.isActive("heading", { level: 3 }) ? styles.toolBtnActive : ""}`}
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <div className={styles.divider} />
        <button
          type="button"
          title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${styles.toolBtn} ${editor.isActive("bulletList") ? styles.toolBtnActive : ""}`}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${styles.toolBtn} ${editor.isActive("orderedList") ? styles.toolBtnActive : ""}`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${styles.toolBtn} ${editor.isActive("blockquote") ? styles.toolBtnActive : ""}`}
        >
          <Quote className="h-4 w-4" />
        </button>
        <div className={styles.divider} />
        <button
          type="button"
          title="Link"
          onClick={setLink}
          className={`${styles.toolBtn} ${editor.isActive("link") ? styles.toolBtnActive : ""}`}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button type="button" title="Insert image" onClick={triggerImageUpload} className={styles.toolBtn}>
          <ImageIcon className="h-4 w-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFile}
        />
        <div className={styles.divider} />
        <button
          type="button"
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={styles.toolBtn}
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={styles.toolBtn}
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>
      <div className={styles.editorArea}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

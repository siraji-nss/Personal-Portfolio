'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useState, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Link2, Unlink,
  List, ListOrdered, Heading2, Heading3, Minus,
} from 'lucide-react';

interface Props { name: string; defaultValue?: string }

function Btn({
  onClick, active, title, children,
}: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? 'bg-indigo-600 text-white'
          : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
      }`}
    >
      {children}
    </button>
  );
}

export default function TiptapEditor({ name, defaultValue = '' }: Props) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-indigo-400 underline' } }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-sm max-w-none min-h-[180px] px-4 py-3 focus:outline-none text-zinc-300 leading-relaxed',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.03]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.06] bg-black/20">
        <Btn title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')}>
          <Bold size={13} />
        </Btn>
        <Btn title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')}>
          <Italic size={13} />
        </Btn>
        <Btn title="Underline" onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')}>
          <UnderlineIcon size={13} />
        </Btn>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <Btn title="Heading 2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })}>
          <Heading2 size={13} />
        </Btn>
        <Btn title="Heading 3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })}>
          <Heading3 size={13} />
        </Btn>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <Btn title="Bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')}>
          <List size={13} />
        </Btn>
        <Btn title="Ordered list" onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')}>
          <ListOrdered size={13} />
        </Btn>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <Btn title="Add link" onClick={setLink} active={editor?.isActive('link')}>
          <Link2 size={13} />
        </Btn>
        <Btn title="Remove link" onClick={() => editor?.chain().focus().unsetLink().run()}>
          <Unlink size={13} />
        </Btn>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <Btn title="Divider" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          <Minus size={13} />
        </Btn>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden form field */}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

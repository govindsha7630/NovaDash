// src/components/tiptap/EditorToolbar.tsx
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { useCallback } from "react";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  SquareCode,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Link2Off,
  ImagePlus,
  Youtube,
  Highlighter,
  Subscript,
  Superscript,
  Undo2,
  Redo2,
} from "lucide-react";
import {
    LinkPopover,
    ImagePopover,
    YoutubePopover,
} from "./PopoverTiptap"


// ── Divider between button groups ───────────────────────────────────────────
function Divider() {
  return <div className="w-px h-6 bg-border rounded-full mx-1 flex-shrink-0" />;
}

// ── Single reusable toolbar button ───────────────────────────────────────────
function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Toggle
      pressed={isActive}
      onPressedChange={onClick}
      disabled={disabled}
      title={title}
      className={`
                h-8 w-8 p-0 rounded-md cursor-pointer
                transition-colors duration-150
                ${
                  isActive
                    ? "bg-violet-600/20 text-violet-400 hover:bg-violet-600/30"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
                ${disabled ? "opacity-40 cursor-not-allowed" : ""}
            `}
    >
      {children}
    </Toggle>
  );
}

// ── Highlight color button ───────────────────────────────────────────────────
// Shows a colored dot, applies that color when clicked
function HighlightButton({
  editor,
  color,
  hex,
  label,
}: {
  editor: Editor;
  color: string; // Tailwind class for dot color
  hex: string; // actual hex value passed to Tiptap
  label: string;
}) {
  const isActive = editor.isActive("highlight", { color: hex });

  return (
    <button
      title={label}
      onClick={() =>
        editor.chain().focus().toggleHighlight({ color: hex }).run()
      }
      className={`
                w-6 h-6 rounded-full border-2 transition-all
                ${color}
                ${isActive ? "border-foreground scale-110" : "border-transparent"}
                hover:scale-110 hover:border-foreground/50
            `}
    />
  );
}

// ── Main toolbar ─────────────────────────────────────────────────────────────
function EditorToolbar({ editor }: { editor: Editor }) {
  // useEditorState — reactive state that updates when editor state changes
  // Without this, buttons won't update when format changes
  const s = useEditorState({
    editor,
    selector: (ctx) => ({
      // Text formatting
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isStrike: ctx.editor.isActive("strike"),
      isSubscript: ctx.editor.isActive("subscript"),
      isSuperscript: ctx.editor.isActive("superscript"),

      // Headings
      isH1: ctx.editor.isActive("heading", { level: 1 }),
      isH2: ctx.editor.isActive("heading", { level: 2 }),
      isH3: ctx.editor.isActive("heading", { level: 3 }),

      // Alignment
      isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
      isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
      isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
      isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),

      // Lists
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isTaskList: ctx.editor.isActive("taskList"),

      // Blocks
      isBlockquote: ctx.editor.isActive("blockquote"),
      isCode: ctx.editor.isActive("code"),
      isCodeBlock: ctx.editor.isActive("codeBlock"),

      // Link
      isLink: ctx.editor.isActive("link"),

      // History
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
    }),
  });

  if (!editor) return null;

  // ── Image — prompt for URL ──────────────────────────────────────────────
  const addImage = useCallback(() => {
    const url = window.prompt("Paste image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // ── YouTube — prompt for URL ────────────────────────────────────────────
  const addYouTube = useCallback(() => {
    const url = window.prompt("Paste YouTube URL:");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  // ── Link — set or unset ─────────────────────────────────────────────────
  const setLink = useCallback(() => {
    if (s.isLink) {
      // If link is active — unset it
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("Paste link URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
  }, [editor, s.isLink]);

  return (
    <div
      className="flex items-center flex-wrap gap-0.5
                       px-3 py-2 border-b border-border
                       bg-background sticky top-0 z-10
                       rounded-t-xl"
    >
      {/* ── GROUP 1: Text formatting ────────────────────────── */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={s.isBold}
        title="Bold (Ctrl+B)"
      >
        <Bold size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={s.isItalic}
        title="Italic (Ctrl+I)"
      >
        <Italic size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={s.isUnderline}
        title="Underline (Ctrl+U)"
      >
        <Underline size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={s.isStrike}
        title="Strikethrough"
      >
        <Strikethrough size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        isActive={s.isSubscript}
        title="Subscript"
      >
        <Subscript size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={s.isSuperscript}
        title="Superscript"
      >
        <Superscript size={15} />
      </ToolbarButton>

      <Divider />

      {/* ── GROUP 2: Headings dropdown ──────────────────────── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle
            pressed={s.isH1 || s.isH2 || s.isH3}
            title="Headings"
            className={`
                            h-8 px-2 rounded-md cursor-pointer
                            flex items-center gap-1 text-xs font-medium
                            transition-colors duration-150
                            ${
                              s.isH1 || s.isH2 || s.isH3
                                ? "bg-violet-600/20 text-violet-400"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }
                        `}
          >
            <Heading size={15} />
            <span className="text-[11px]">
              {s.isH1 ? "H1" : s.isH2 ? "H2" : s.isH3 ? "H3" : "H"}
            </span>
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuLabel className="text-xs">Headings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[
            { level: 1, icon: <Heading1 size={15} />, label: "Heading 1" },
            { level: 2, icon: <Heading2 size={15} />, label: "Heading 2" },
            { level: 3, icon: <Heading3 size={15} />, label: "Heading 3" },
          ].map(({ level, icon, label }) => (
            <DropdownMenuItem
              key={level}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 })
                  .run()
              }
              className={`
                                gap-2 cursor-pointer
                                ${
                                  editor.isActive("heading", { level })
                                    ? "text-violet-400 bg-violet-600/10"
                                    : ""
                                }
                            `}
            >
              {icon} {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* ── GROUP 3: Alignment dropdown ─────────────────────── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle
            title="Text Alignment"
            className="h-8 w-8 p-0 rounded-md cursor-pointer
                                   text-muted-foreground hover:bg-muted
                                   hover:text-foreground transition-colors"
          >
            {/* Show the currently active alignment icon */}
            {s.isAlignCenter ? (
              <AlignCenter size={15} />
            ) : s.isAlignRight ? (
              <AlignRight size={15} />
            ) : s.isAlignJustify ? (
              <AlignJustify size={15} />
            ) : (
              <AlignLeft size={15} />
            )}
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuLabel className="text-xs">Alignment</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[
            { align: "left", icon: <AlignLeft size={14} />, label: "Left" },
            {
              align: "center",
              icon: <AlignCenter size={14} />,
              label: "Center",
            },
            { align: "right", icon: <AlignRight size={14} />, label: "Right" },
            {
              align: "justify",
              icon: <AlignJustify size={14} />,
              label: "Justify",
            },
          ].map(({ align, icon, label }) => (
            <DropdownMenuItem
              key={align}
              onClick={() => editor.chain().focus().setTextAlign(align).run()}
              className={`
                                gap-2 cursor-pointer
                                ${
                                  editor.isActive({ textAlign: align })
                                    ? "text-violet-400 bg-violet-600/10"
                                    : ""
                                }
                            `}
            >
              {icon} {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* ── GROUP 4: Lists ──────────────────────────────────── */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={s.isBulletList}
        title="Bullet List"
      >
        <List size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={s.isOrderedList}
        title="Numbered List"
      >
        <ListOrdered size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={s.isTaskList}
        title="Task List (Checkboxes)"
      >
        <ListTodo size={15} />
      </ToolbarButton>

      <Divider />

      {/* ── GROUP 5: Blocks ─────────────────────────────────── */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={s.isBlockquote}
        title="Blockquote"
      >
        <Quote size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={s.isCode}
        title="Inline Code"
      >
        <Code size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={s.isCodeBlock}
        title="Code Block"
      >
        <SquareCode size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus size={15} />
      </ToolbarButton>

      <Divider />

      {/* ── GROUP 6: Highlight colors ───────────────────────── */}
      <div className="flex items-center gap-1.5 px-1" title="Highlight">
        <Highlighter size={13} className="text-muted-foreground" />
        {/* Yellow */}
        <HighlightButton
          editor={editor}
          hex="#FBBF24"
          color="bg-amber-400"
          label="Yellow highlight"
        />
        {/* Red */}
        <HighlightButton
          editor={editor}
          hex="#EF4444"
          color="bg-red-500"
          label="Red highlight"
        />
        {/* Violet — primary brand color */}
        <HighlightButton
          editor={editor}
          hex="#7C5CFC"
          color="bg-violet-600"
          label="Violet highlight"
        />
        {/* Cyan — accent brand color */}
        <HighlightButton
          editor={editor}
          hex="#22D3EE"
          color="bg-cyan-400"
          label="Cyan highlight"
        />
      </div>

      <Divider />

      {/* ── GROUP 7: Link ───────────────────────────────────── */}
      {/* <ToolbarButton
        onClick={setLink}
        isActive={s.isLink}
        title={s.isLink ? "Remove link" : "Add link"}
      >
        {s.isLink ? <Link2Off size={15} /> : <Link size={15} />}
      </ToolbarButton> */}
<LinkPopover editor={editor} isActive={s.isLink} />

      <Divider />

      {/* ── GROUP 8: Media ──────────────────────────────────── */}
      {/* <ToolbarButton onClick={addImage} title="Insert image from URL">
        <ImagePlus size={15} />
      </ToolbarButton>

      <ToolbarButton onClick={addYouTube} title="Embed YouTube video">
        <Youtube size={15} />
      </ToolbarButton> */}
<ImagePopover editor={editor} />
<YoutubePopover editor={editor} />
      <Divider />

      {/* ── GROUP 9: History ────────────────────────────────── */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!s.canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={15} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!s.canRedo}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={15} />
      </ToolbarButton>
    </div>
  );
}

export default EditorToolbar;

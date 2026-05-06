// src/components/tiptap/Tiptap.tsx
import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { useMemo } from "react";
import EditorToolbar from "./EditorToolbar";
import BubbleMenuBar from "./BubbleMenuBar";

// ── Lowlight for syntax highlighted code blocks ─────────────────────────────
// createLowlight(all) registers ALL languages
// This adds syntax highlighting inside code blocks
const lowlight = createLowlight(all);

const Tiptap = ({
  content = 'Type here...',
  onChange,
}: {
  content?: string;
  onChange?: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      // StarterKit — contains Bold, Italic, Strike, Heading,
      // BulletList, OrderedList, Code, Blockquote, HR, History
      // We DISABLE codeBlock from StarterKit because we use
      // CodeBlockLowlight instead (it adds syntax highlighting)
      StarterKit.configure({
        codeBlock: false, // disabled — using CodeBlockLowlight
        link: false,
        underline: false,
      }),

      // // Underline — not in StarterKit, must add separately
      Underline,

      // Highlight with multicolor — allows red, yellow, violet, cyan
      Highlight.configure({ multicolor: true }),

      // Subscript and Superscript — for chemical formulas etc
      Subscript,
      Superscript,

      // TextAlign — adds text-align left/center/right/justify
      // types: which node types can be aligned
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      // Link — clickable hyperlinks
      // openOnClick: false — clicking link in editor doesn't navigate
      // autolink: true — automatically converts URLs to links
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      // Image — with max width constraint
      // We do NOT use resize plugin (it's Pro/paid)
      // Instead we use CSS to control image size
      Image.configure({
        inline: false, // images are block level
        allowBase64: true, // allows base64 images (for local preview)
      }),

      // YouTube — embeds YouTube videos by URL
      Youtube.configure({
        // width: "100%",
        width: 1280,
        height: 400,
        nocookie: true, // uses youtube-nocookie.com (more private)
      }),

      // TaskList + TaskItem — checkbox lists
      // TaskItem must have nested: true to allow sub-tasks
      TaskList,
      TaskItem.configure({
        nested: true,
      }),

      // CodeBlockLowlight — replaces StarterKit's codeBlock
      // Adds syntax highlighting to code blocks
      CodeBlockLowlight.configure({
        lowlight,
      }),

      GlobalDragHandle.configure({
        dragHandleWidth: 20, // width of the drag handle area
        scrollTreshold: 100, // ✅ how close to edge before auto-scroll kicks in
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },

    // editorProps — lets you add HTML attributes to the editor element
    editorProps: {
      attributes: {
        // This is the class Tiptap adds to the div — your CSS targets this
        class: "tiptap",
        spellCheck: "true",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Tab") {
          event.preventDefault();

          // If cursor is inside a list item — indent it
          if (editor?.can().sinkListItem("listItem")) {
            editor.commands.sinkListItem("listItem");
            return true;
          }

          // If cursor is inside a task list item — indent it
          if (editor?.can().sinkListItem("taskItem")) {
            editor.commands.sinkListItem("taskItem");
            return true;
          }

          // Otherwise — insert spaces
          editor?.commands.insertContent("    ");
          return true;
        }

        // Shift+Tab — outdent list items
        if (event.key === "Tab" && event.shiftKey) {
          event.preventDefault();

          if (editor?.can().liftListItem("listItem")) {
            editor.commands.liftListItem("listItem");
            return true;
          }

          return true;
        }

        return false;
      },
    },
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
      {/*
                h-full — fills whatever parent gives it
                flex-col — toolbar on top, content below
                overflow-hidden — this container does NOT scroll
            */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Toolbar — never scrolls */}
        {editor && (
          <div className="flex-shrink-0">
            <EditorToolbar editor={editor} />
          </div>
        )}

        {/*
                    flex-1 — takes ALL remaining height
                    min-h-0 — CRITICAL: allows flex child to shrink below content
                    overflow-y-auto — ONLY this scrolls
                */}
        <div
          className="flex-1 min-h-0 overflow-y-auto tiptap-wrapper"
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent editor={editor} />
        </div>

        {editor && <BubbleMenuBar editor={editor} />}
      </div>
    </EditorContext.Provider>
  );
};

export default Tiptap;

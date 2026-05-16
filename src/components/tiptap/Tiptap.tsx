// src/components/tiptap/Tiptap.tsx
import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
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
import { useEffect, useMemo } from "react";
import EditorToolbar from "./EditorToolbar";
import BubbleMenuBar from "./BubbleMenuBar";

// ── Lowlight for syntax highlighted code blocks ─────────────────────────────
const lowlight = createLowlight(all);

const Tiptap = ({
  content = "Type here...",
  onChange,
}: {
  content?: string;
  onChange?: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // disabled — using CodeBlockLowlight
        link: false,
        underline: false,
      }),

      Underline,

      Highlight.configure({ multicolor: true }),

      Subscript,
      Superscript,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image.configure({
        inline: false, // images are block level
        allowBase64: true, // allows base64 images (for local preview)
      }),

      Youtube.configure({
        // width: "100%",
        width: 1280,
        height: 400,
        nocookie: true, // uses youtube-nocookie.com (more private)
      }),

      TaskList,
      TaskItem.configure({
        nested: true,
      }),

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

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() != content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
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

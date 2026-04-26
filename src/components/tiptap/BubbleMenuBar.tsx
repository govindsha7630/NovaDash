// src/components/tiptap/BubbleMenuBar.tsx
import type { Editor } from "@tiptap/core"
import { BubbleMenu } from "@tiptap/react/menus"
import { useEditorState } from "@tiptap/react"
import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, Underline, Strikethrough, Link, Link2Off } from "lucide-react"
import { useCallback } from "react"

function BubbleMenuBar({ editor }: { editor: Editor }) {
    const s = useEditorState({
        editor,
        selector: (ctx) => ({
            isBold:      ctx.editor.isActive("bold"),
            isItalic:    ctx.editor.isActive("italic"),
            isUnderline: ctx.editor.isActive("underline"),
            isStrike:    ctx.editor.isActive("strike"),
            isLink:      ctx.editor.isActive("link"),
        }),
    })

    const setLink = useCallback(() => {
        if (s.isLink) {
            editor.chain().focus().unsetLink().run()
            return
        }
        const url = window.prompt("Paste link URL:")
        if (url) {
            editor.chain().focus().setLink({ href: url, target: "_blank" }).run()
        }
    }, [editor, s.isLink])

    return (
        // tippyOptions controls the floating popup behaviour
        // offset: positions it above the selection with 8px gap
        <BubbleMenu
            editor={editor}
            // tippyOptions={{ duration: 150, offset: [0, 8] }}
        >
            {/* ✅ Compact popup — not full width */}
            <div
                className="flex items-center gap-0.5 p-1
                           bg-card border border-border
                           rounded-lg shadow-xl shadow-black/20
                           backdrop-blur-sm"
            >
                <Toggle
                    pressed={s.isBold}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                    className={`h-7 w-7 p-0 rounded cursor-pointer
                        ${s.isBold
                            ? "bg-violet-600/20 text-violet-400"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    <Bold size={13} />
                </Toggle>

                <Toggle
                    pressed={s.isItalic}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                    className={`h-7 w-7 p-0 rounded cursor-pointer
                        ${s.isItalic
                            ? "bg-violet-600/20 text-violet-400"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    <Italic size={13} />
                </Toggle>

                <Toggle
                    pressed={s.isUnderline}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                    className={`h-7 w-7 p-0 rounded cursor-pointer
                        ${s.isUnderline
                            ? "bg-violet-600/20 text-violet-400"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    <Underline size={13} />
                </Toggle>

                <Toggle
                    pressed={s.isStrike}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                    className={`h-7 w-7 p-0 rounded cursor-pointer
                        ${s.isStrike
                            ? "bg-violet-600/20 text-violet-400"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    <Strikethrough size={13} />
                </Toggle>

                {/* Divider */}
                <div className="w-px h-4 bg-border mx-0.5" />

                {/* Link toggle */}
                <Toggle
                    pressed={s.isLink}
                    onPressedChange={setLink}
                    title={s.isLink ? "Remove link" : "Add link"}
                    className={`h-7 w-7 p-0 rounded cursor-pointer
                        ${s.isLink
                            ? "bg-cyan-600/20 text-cyan-400"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    {s.isLink ? <Link2Off size={13} /> : <Link size={13} />}
                </Toggle>
            </div>
        </BubbleMenu>
    )
}

export default BubbleMenuBar
// src/components/tiptap/PopoverTiptap.tsx
import { useState, useCallback } from "react"
import type { Editor } from "@tiptap/core"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Label } from "@/components/ui/label"
import { Link, Link2Off, ImagePlus, Youtube } from "lucide-react"

// ─── Shared types ───────────────────────────────────────────────────────────
interface PopoverButtonProps {
    editor: Editor
    isActive?: boolean
}

// ─── LINK POPOVER ───────────────────────────────────────────────────────────
export function LinkPopover({ editor, isActive }: PopoverButtonProps) {
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState("")

    // When popover opens — if link already exists, prefill the URL
    const handleOpenChange = (val: boolean) => {
        if (val) {
            // Read current link href if one exists
            const existingHref = editor.getAttributes("link").href ?? ""
            setUrl(existingHref)
        }
        setOpen(val)
    }

    const applyLink = useCallback(() => {
        if (!url.trim()) return

        // Add https:// if user forgot to type it
        const href = url.startsWith("http") ? url : `https://${url}`

        editor
            .chain()
            .focus()
            .setLink({ href, target: "_blank" })
            .run()

        setUrl("")
        setOpen(false)
    }, [editor, url])

    const removeLink = useCallback(() => {
        editor.chain().focus().unsetLink().run()
        setUrl("")
        setOpen(false)
    }, [editor])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Enter key applies the link
        if (e.key === "Enter") {
            e.preventDefault()
            applyLink()
        }
        // Escape closes the popover
        if (e.key === "Escape") {
            setOpen(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                {/* ✅ onMouseDown preventDefault — keeps editor focused */}
                <Toggle
                    pressed={isActive}
                    onMouseDown={(e) => e.preventDefault()}
                    title={isActive ? "Edit link" : "Add link"}
                    className={`
                        h-8 w-8 p-0 rounded-md cursor-pointer
                        transition-colors duration-150
                        ${isActive
                            ? "bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }
                    `}
                >
                    {isActive ? <Link2Off size={15} /> : <Link size={15} />}
                </Toggle>
            </PopoverTrigger>

            <PopoverContent
                className="w-72 p-3"
                align="start"
                // ✅ Prevents popover from stealing editor focus
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase
                                      tracking-wider text-muted-foreground">
                        Link URL
                    </Label>

                    <Input
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        // ✅ Auto-focus the input when popover opens
                        autoFocus
                        className="h-8 text-sm"
                    />

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={applyLink}
                            disabled={!url.trim()}
                            className="flex-1 h-7 text-xs
                                       bg-violet-600 hover:bg-violet-500
                                       text-white border-0"
                        >
                            Apply Link
                        </Button>

                        {/* Remove button — only shows when link already exists */}
                        {isActive && (
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={removeLink}
                                className="h-7 text-xs px-2"
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

// ─── IMAGE POPOVER ──────────────────────────────────────────────────────────
export function ImagePopover({ editor }: PopoverButtonProps) {
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState("")
    const [alt, setAlt] = useState("")

    const insertImage = useCallback(() => {
        if (!url.trim()) return

        editor
            .chain()
            .focus()
            .setImage({
                src: url.trim(),
                alt: alt.trim() || "Image",
            })
            .run()

        setUrl("")
        setAlt("")
        setOpen(false)
    }, [editor, url, alt])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            insertImage()
        }
        if (e.key === "Escape") setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Toggle
                    onMouseDown={(e) => e.preventDefault()}
                    title="Insert image"
                    className="h-8 w-8 p-0 rounded-md cursor-pointer
                               text-muted-foreground hover:bg-muted
                               hover:text-foreground transition-colors"
                >
                    <ImagePlus size={15} />
                </Toggle>
            </PopoverTrigger>

            <PopoverContent
                className="w-72 p-3"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase
                                      tracking-wider text-muted-foreground">
                        Insert Image
                    </Label>

                    {/* Image URL */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                            Image URL
                        </Label>
                        <Input
                            placeholder="https://example.com/image.jpg"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="h-8 text-sm"
                        />
                    </div>

                    {/* Alt text */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                            Alt text (optional)
                        </Label>
                        <Input
                            placeholder="Describe the image..."
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-8 text-sm"
                        />
                    </div>

                    <Button
                        size="sm"
                        onClick={insertImage}
                        disabled={!url.trim()}
                        className="w-full h-7 text-xs
                                   bg-violet-600 hover:bg-violet-500
                                   text-white border-0"
                    >
                        Insert Image
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

// ─── YOUTUBE POPOVER ─────────────────────────────────────────────────────────
export function YoutubePopover({ editor }: PopoverButtonProps) {
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState("")

    const insertVideo = useCallback(() => {
        if (!url.trim()) return

        editor
            .chain()
            .focus()
            .setYoutubeVideo({ src: url.trim() })
            .run()

        setUrl("")
        setOpen(false)
    }, [editor, url])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            insertVideo()
        }
        if (e.key === "Escape") setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Toggle
                    onMouseDown={(e) => e.preventDefault()}
                    title="Embed YouTube video"
                    className="h-8 w-8 p-0 rounded-md cursor-pointer
                               text-muted-foreground hover:bg-muted
                               hover:text-foreground transition-colors"
                >
                    <Youtube size={15} />
                </Toggle>
            </PopoverTrigger>

            <PopoverContent
                className="w-72 p-3"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase
                                      tracking-wider text-muted-foreground">
                        YouTube Video
                    </Label>

                    <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="h-8 text-sm"
                    />

                    {/* Small hint about supported URLs */}
                    <p className="text-[11px] text-muted-foreground">
                        Supports youtube.com and youtu.be links
                    </p>

                    <Button
                        size="sm"
                        onClick={insertVideo}
                        disabled={!url.trim()}
                        className="w-full h-7 text-xs
                                   bg-red-600 hover:bg-red-500
                                   text-white border-0"
                    >
                        Embed Video
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
// src/pages/articles/CreateArticlePage.tsx
import { ArticleCategorySelect } from "@/components/article/ArticleCategory"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { truncate } from "@/components/utils/miniUtils"
import { Camera, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Tiptap from "@/components/tiptap/Tiptap"

function CreateArticlePage() {
    const [category, setCategory] = useState("")
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [tags, setTags] = useState<string[]>(["Design", "Future", "Web3"])
    const [tagInput, setTagInput] = useState("")

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault()
            setTags([...tags, tagInput.trim()])
            setTagInput("")
        }
    }

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index))
    }

    return (
        // ✅ h-full fills the main area from AppShell
        // overflow-hidden — this page NEVER scrolls
        // p-4 — breathing room around content
        <div className="h-full overflow-hidden flex gap-4 p-4">

            {/* ── LEFT — Editor column ──────────────────────────────── */}
            {/* flex-col so toolbar, editor, buttons stack vertically */}
            {/* overflow-hidden — column itself does not scroll */}
            <div className="flex-1 flex flex-col overflow-hidden
                            rounded-xl border border-border bg-card
                            min-w-0">

                {/* Tiptap — fills ALL remaining space in this column */}
                {/* Toolbar is sticky INSIDE Tiptap component */}
                {/* Only editor content area scrolls */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <Tiptap />
                </div>

                {/* ✅ Save/Publish — always visible at bottom, never scrolls */}
                <div className="flex-shrink-0 flex items-center justify-end
                                gap-3 px-4 py-3
                                border-t border-border bg-background">
                    <Button variant="outline">Save Draft</Button>
                    <Button className="bg-gradient-to-r from-violet-600
                                       to-cyan-500 text-white border-0">
                        Publish
                    </Button>
                </div>

            </div>

            {/* ── RIGHT — Sidebar ───────────────────────────────────── */}
            {/* Fixed width, only the sidebar content scrolls */}
            <aside className="w-72 flex-shrink-0 flex flex-col
                              overflow-hidden rounded-xl">

                {/* ✅ Sidebar cards scroll independently */}
                <div className="flex-1 overflow-y-auto space-y-3
                                pr-1
                                [&::-webkit-scrollbar]:w-1
                                [&::-webkit-scrollbar-thumb]:bg-border
                                [&::-webkit-scrollbar-thumb]:rounded-full">

                    {/* Cover Image */}
                    <Card className="rounded-xl p-4">
                        <span className="block text-xs font-semibold
                                         text-muted-foreground uppercase
                                         tracking-wider mb-2">
                            Cover Image
                        </span>
                        <div className="relative group cursor-pointer
                                        border-2 border-dashed border-border
                                        rounded-xl aspect-video flex flex-col
                                        items-center justify-center gap-2
                                        hover:border-violet-500/50
                                        transition-colors overflow-hidden">
                            <div className="relative z-10 flex flex-col
                                            items-center text-center px-4">
                                <Camera size={24} className="text-muted-foreground mb-1" />
                                <p className="text-sm font-medium text-foreground">
                                    Upload Cover
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                    Recommended: 1200×630px
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Tags */}
                    <Card className="rounded-xl p-4">
                        <span className="block text-xs font-semibold
                                         text-muted-foreground uppercase
                                         tracking-wider mb-2">
                            Tags
                        </span>
                        {/* Tag chips */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {tags.map((tag, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1 px-2 py-0.5
                                               rounded-full text-xs border border-primary
                                               bg-primary/10 text-primary"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(i)}
                                        className="hover:text-red-400 transition-colors"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Input
                            placeholder="Add tag, press Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            className="text-xs h-8"
                        />
                        <div className="mt-3">
                            <span className="block text-xs font-semibold
                                             text-muted-foreground uppercase
                                             tracking-wider mb-2">
                                Category
                            </span>
                            <ArticleCategorySelect
                                value={category}
                                onChange={setCategory}
                            />
                        </div>
                    </Card>

                    {/* SEO Preview */}
                    <Card className="rounded-xl p-4">
                        <span className="block text-xs font-semibold
                                         text-muted-foreground uppercase
                                         tracking-wider mb-2">
                            SEO Preview
                        </span>
                        <div className="p-3 bg-muted rounded-xl space-y-1">
                            <p className="text-xs text-cyan-400 truncate">
                                novadash.com/articles/your-article-title...
                            </p>
                            <p className="text-sm font-bold text-foreground
                                          leading-snug">
                                {truncate("Article Title Preview", 55)}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {truncate(
                                    "Article description will appear here from your content.",
                                    120
                                )}
                            </p>
                        </div>
                    </Card>

                    {/* Settings — Private + Schedule */}
                    <Card className="rounded-xl p-4 space-y-4">

                        {/* Private toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                                Private Article
                            </span>
                            <Switch />
                        </div>

                        {/* Schedule publish */}
                        <div>
                            <span className="block text-xs font-semibold
                                             text-muted-foreground uppercase
                                             tracking-wider mb-2">
                                Schedule Publish
                            </span>
                            <div className="flex items-center gap-2">
                                {/* Date picker */}
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="flex-1 justify-between text-xs
                                                       font-normal h-8 px-2"
                                        >
                                            {date ? format(date, "MMM d") : "Select date"}
                                            <ChevronDownIcon size={12} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto overflow-hidden p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(d) => {
                                                setDate(d)
                                                setOpen(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                {/* Time picker */}
                                <Input
                                    type="time"
                                    defaultValue="10:30"
                                    className="w-24 h-8 text-xs
                                               appearance-none
                                               [&::-webkit-calendar-picker-indicator]:hidden"
                                />
                            </div>
                        </div>
                    </Card>

                </div>
            </aside>

        </div>
    )
}

export default CreateArticlePage
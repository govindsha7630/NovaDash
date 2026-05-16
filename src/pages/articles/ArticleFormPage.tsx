// src/pages/articles/CreateArticlePage.tsx renamed to ArticleFormPage.tsx
import { tablesDB } from "@/appwrite/config";
import env from "@/appwrite/env";
import { ArticleCategorySelect } from "@/components/article/ArticleCategory";
import { useCreateArticle, useUpdateArticle } from "@/hooks/useArticle";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateSlug, truncate } from "@/components/utils/miniUtils";
import { Camera, X, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import { format, set } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Tiptap from "@/components/tiptap/Tiptap";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { deleteFile, getFileUrl, uploadFile } from "@/appwrite/storage";

const articleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be under 200 characters"),
  content: z.string(),
  excerpt: z.string(),
  coverImage: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  isPrivate: z.boolean(),
  publishAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string(),
});
type ArticleFormData = z.infer<typeof articleSchema>;

function ArticleFormPage() {
  const { slugwithid } = useParams();
  const isEditMode = Boolean(slugwithid);
  const articleIdFromUrl = slugwithid?.split("-").at(-1);
  const [editorContent, setEditorContent] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [articleId, setArticleId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    // reset,
    // control,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      coverImage: "",
      status: "draft",
      isPrivate: false,
      tags: [],
      category: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate image
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    // Save real file
    setCoverFile(file);

    // Create preview URL
    const localUrl = URL.createObjectURL(file);

    // Save preview URL
    setPreviewUrl(localUrl);
    e.target.value = "";
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  useEffect(() => {
    // Step 1 — need both date AND time to build ISO string
    // if either is missing, clear publishAt and stop
    if (!date || !time) {
      setValue("publishAt", undefined);
      return;
    }

    // Step 2 — time is "HH:mm" e.g. "10:30"
    // split by ":" gives ["10", "30"]
    // Number() converts "10" → 10
    const [hours, minutes] = time.split(":").map(Number);

    // Step 3 — take the calendar date, replace its hours + minutes
    // with what user picked in the time input
    const combined = set(date, { hours, minutes, seconds: 0 });

    // Step 4 — convert to ISO string and store in form
    setValue("publishAt", combined.toISOString());
  }, [date, time, setValue]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      // ✅ prevent duplicates + max 10 tags
      if (!tags.includes(newTag) && tags.length < 10) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const currentTitle = watch("title");

  useEffect(() => {
    if (!isEditMode || !articleIdFromUrl) return;

    const fetchArticle = async () => {
      try {
        const row = await tablesDB.getRow({
          databaseId: env.appwriteDatabaseId,
          tableId: env.appwriteCollectionArticles,
          rowId: articleIdFromUrl,
        });

        if (row.coverImage) setPreviewUrl(getFileUrl(row.coverImage));

        setValue("coverImage", row.coverImage || "")
        setArticleId(row.$id);

        setEditorContent(row.content);

        setValue("title", row.title || "");

        setValue("category", row.category || "");
        setValue("isPrivate", row.isPrivate || false);
        setValue("tags", row.tags || []);

        setTags(row.tags || []);

        if (row.publishAt) {
          const publishDate = new Date(row.publishAt);

          setDate(publishDate);

          setTime(format(publishDate, "HH:mm"));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load article");
      }
    };

    fetchArticle();
  }, [isEditMode, articleIdFromUrl, setValue]);

  const saveDraft = async () => {
    try {
      const title = getValues("title");
      if (!title || title.length < 3) {
        toast.error("Title must be at least 3 characters");
        return;
      }

      // Start with existing file ID from form (empty string if none)
      let coverImageId = getValues("coverImage");

      if (coverFile) {
        // Upload new file first — confirm it works before deleting old
        const uploaded = await uploadFile(coverFile);

        // Only delete old file if one existed
        if (coverImageId) {
          try {
            await deleteFile(coverImageId);
          } catch {
            // Non-critical — log and continue, don't block save
            console.warn("Old cover image could not be deleted");
          }
        }

        coverImageId = uploaded.$id;
        setValue("coverImage", coverImageId);
        setCoverFile(null); // clear so re-saving doesn't re-upload same file
      }

      const payload = {
        title,
        content: getValues("content"),
        tags: getValues("tags"),
        category: getValues("category"),
        coverImage: coverImageId,
        publishAt: getValues("publishAt"),
        status: "draft" as const,
      };

      if (articleId) {
        updateArticle.mutate(
          { id: articleId, data: payload },
          {
            onSuccess: () => toast.success("Draft updated!"),
            onError: (err) => toast.error(err.message),
          },
        );
      } else {
        createArticle.mutate(payload, {
          onSuccess: (result) => {
            setArticleId(result.$id);
            toast.success("Draft saved!");
          },
          onError: (err) => toast.error(err.message),
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save draft");
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    try {
      let coverImageId = data.coverImage;

      if (coverFile) {
        const uploaded = await uploadFile(coverFile);

        if (coverImageId) {
          try {
            await deleteFile(coverImageId);
          } catch {
            console.warn("Old cover image could not be deleted");
          }
        }

        coverImageId = uploaded.$id;
        setCoverFile(null);
      }

      const payload = {
        title: data.title,
        content: data.content,
        category: data.category,
        publishAt: data.publishAt,
        isPrivate: data.isPrivate,
        coverImage: coverImageId,
        tags: data.tags,
        status: "published" as const,
      };

      if (articleId) {
        updateArticle.mutate(
          { id: articleId, data: payload },
          {
            onSuccess: () => {
              toast.success("Article updated!");
              navigate("/articles");
            },
            onError: (err) => toast.error(err.message),
          },
        );
      } else {
        createArticle.mutate(payload, {
          onSuccess: () => {
            toast.success("Article published!");
            navigate("/articles");
          },
          onError: (err) => toast.error(err.message),
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish article");
    }
  };

  // -----------------------------------------------------------

  return (
    /*
              h-full — fills the main area from AppShell
              overflow-hidden — page itself never scrolls
          */
    <div className="h-full overflow-hidden flex gap-4 p-4">
      {/* LEFT — editor column */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col h-full overflow-hidden
                    rounded-xl border border-border  min-w-0"
      >
        {/* Tiptap fills all space — toolbar inside is sticky */}

        {/* Title input — above editor */}
        <div className="flex-shrink-0 px-4 pt-4">
          <input
            type="text"
            placeholder="Article title..."
            {...register("title")}
            className="w-full  text-2xl font-bold 
               text-foreground placeholder:text-muted-foreground/40
               outline-none   focus:ring-0
               pb-3 border-b-2 border-border"
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title?.message}</p>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden bg-card ">
          <Tiptap
            content={editorContent}
            onChange={(content) => setValue("content", content)}
          />
        </div>

        {/* Buttons — always at bottom, never scrolls */}
        <div
          className="flex-shrink-0 flex justify-end gap-3
                                  px-4 py-3 border-t border-border"
        >
          {/* Save Draft Id */}
          <Button
            variant="outline"
            type="button"
            onClick={saveDraft}
            disabled={createArticle.isPending || updateArticle.isPending}
          >
            {createArticle.isPending || updateArticle.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Save Draft"}
          </Button>

          <Button
            type="submit"
            disabled={createArticle.isPending || updateArticle.isPending}
            className="bg-gradient-to-r from-violet-600
                        to-cyan-500 text-white border-0"
          >
            {createArticle.isPending || updateArticle.isPending
              ? "Publishing..."
              : isEditMode
                ? "Update Article"
                : "Publish"}
          </Button>
        </div>
      </form>

      {/* ── RIGHT — Sidebar ───────────────────────────────────── */}
      {/* Fixed width, only the sidebar content scrolls */}
      <aside
        className="w-72 flex-shrink-0 flex flex-col
                                overflow-hidden rounded-xl"
      >
        {/* ✅ Sidebar cards scroll independently */}
        <div
          className="flex-1 overflow-y-auto space-y-4 px-1 py-1
                                  pr-1
                                  [&::-webkit-scrollbar]:w-1
                                  [&::-webkit-scrollbar-thumb]:bg-border
                                  [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {/* Cover Image */}
          <Card className="rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span
                className="block text-xs font-semibold
                              text-muted-foreground uppercase
                              tracking-wider"
              >
                Cover Image
              </span>

              {previewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl("");
                    setCoverFile(null);
                    setValue("coverImage", "");
                  }}
                >
                  <XCircle color="#7C5CFC" size={18} />
                </button>
              )}
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer
                          border-2 border-dashed border-border
                          rounded-xl aspect-video flex flex-col
                          items-center justify-center gap-2
                          hover:border-violet-500/50
                          transition-colors overflow-hidden"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="w-full h-full object-center object-cover"
                  alt=""
                />
              ) : (
                <div
                  className="relative z-10 flex flex-col
                              items-center text-center px-4"
                >
                  <Camera size={24} className="text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">
                    Upload Cover
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Recommended: 1200×630px
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Upload Cover Image here */}

          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {/* Tags */}
          <Card className="rounded-xl p-4">
            <span
              className="block text-xs font-semibold
                        text-muted-foreground uppercase
                        tracking-wider mb-2"
            >
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
                    type="button"
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
            {/* Category */}
            <div className="mt-2">
              <span
                className="block text-xs font-semibold
                                              text-muted-foreground uppercase
                                              tracking-wider mb-2"
              >
                Category
              </span>
              <ArticleCategorySelect
                value={watch("category")}
                onChange={(val) => setValue("category", val)}
              />
              {errors.category && (
                <div className="text-xs text-destructive">
                  {errors.category?.message}
                </div>
              )}
            </div>
          </Card>

          {/* SEO Preview */}
          <Card className="rounded-xl p-4">
            <span
              className="block text-xs font-semibold
                                          text-muted-foreground uppercase
                                          tracking-wider mb-2"
            >
              SEO Preview
            </span>
            <div className="p-3 bg-muted rounded-xl space-y-1">
              <p className="text-xs text-cyan-400 truncate">
                {generateSlug(currentTitle || "your-article-title...")}
              </p>
              <p
                className="text-sm font-bold text-foreground
                                            leading-snug"
              >
                {truncate(currentTitle || "Article Title Preview", 55)}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {truncate(
                  watch("content")
                    .replace(/<[^>]*>/g, "")
                    .slice(0, 120) ||
                    "Article description will appear here from your content.",
                  120,
                )}
              </p>
            </div>
          </Card>

          {/* Settings — Private + Schedule */}
          <Card className="rounded-xl p-4 space-y-2">
            {/* Private toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Private Article
              </span>
              <Switch
                checked={watch("isPrivate")}
                onCheckedChange={(val) => setValue("isPrivate", val)}
              />
            </div>

            {/* Schedule publish */}
            <div>
              <span
                className="block text-xs font-semibold
                                              text-muted-foreground uppercase
                                              tracking-wider mb-2"
              >
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
                        setDate(d);
                        setOpen(false);
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
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </Card>
        </div>
      </aside>
    </div>
  );
}

export default ArticleFormPage;

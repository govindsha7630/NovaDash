import { tablesDB } from "@/appwrite/config";
import env from "@/appwrite/env";
import type { Article } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import "@/styles/tiptap.css";
import { Button } from "@/components/ui/button";
import { useUpdateArticle } from "@/hooks/useArticle";
import { toast } from "sonner";
import { getFileUrl } from "@/appwrite/storage";
import { ArrowLeft } from "lucide-react";

function ArticleDetailPage() {
  const { slugwithid } = useParams<{ slugwithid: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const updateArticle = useUpdateArticle();
  const separatedId = slugwithid?.split("-").at(-1);

  useEffect(() => {
    if (!slugwithid) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const row = await tablesDB.getRow({
          databaseId: env.appwriteDatabaseId,
          tableId: env.appwriteCollectionArticles,
          rowId: separatedId!,
        });

        setArticle(row as unknown as Article);
      } catch (error) {
        console.error("Failed to Fetch Article", error);
        navigate("/articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slugwithid, navigate]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!article) return null;


  const nextStatus = (
    article?.status === "published" ? "archived" : "published"
  ) as Article["status"];

  const updateArticleStatus = () => {
    if (separatedId) {
      updateArticle.mutate(
        { id: separatedId, data: { status: nextStatus } },
        {
          onSuccess: () => {
            setArticle((prev) =>
              prev ? { ...prev, status: nextStatus } : prev,
            );
          },
          onError: (err) => {
            toast.error(err.message);
          },
        },
      );
    }
  };

  return (
  <div className="h-full p-4 space-y-4 overflow-y-auto">
    {/* Action buttons */}
    <div className="flex items-center justify-between">
       <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground
                    hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back
      </Button>
      <div className="flex items-center gap-4 justify-between ">

      <Button
        disabled={updateArticle.isPending}
        variant="outline"
        onClick={() => navigate(`/articles/edit/${article.$id}`)}
      >
        Edit Article
      </Button>
      <Button
        disabled={updateArticle.isPending}
        variant="gradient"
        onClick={updateArticleStatus}
      >
        {updateArticle.isPending
          ? "Updating..."
          : article.status === "published"
            ? "Send to Archive"
            : "Publish Article"}
      </Button>

      </div>

    </div>

    {/* Cover image */}
    <div className="w-full relative">
      {article.coverImage ? (
        <img
          className="w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl object-cover"
          src={article.coverImage ? getFileUrl  (article.coverImage) : undefined}
          alt={article.title}
        />
      ) : (
        <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl bg-gradient-to-t from-purple-900 via-purple-600 to-purple-300" />
      )}
      <div className="w-full absolute bottom-0 p-4
                      text-2xl md:text-4xl lg:text-6xl
                      font-bold text-white
                      drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
                      bg-gradient-to-t from-black/80 to-transparent
                      rounded-b-2xl">
        {article.title}
      </div>
    </div>

    {/* Content + TOC */}
    <div className="flex items-start gap-4 relative">
      {/* TOC — hidden on mobile and tablet, visible on lg+ */}
      <div className="hidden lg:block w-1/4 sticky top-0
                      max-h-[calc(100vh-120px)] overflow-hidden
                      border-2 rounded-2xl text-muted-foreground
                      font-bold text-center">
        <div className="p-3 border-b border-border">
          Table of contents
          <span className="block text-accent text-xs font-normal mt-0.5">
            Coming Soon
          </span>
        </div>
        <div className="mt-4 px-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="h-3 w-full rounded bg-border animate-pulse mb-3"
            />
          ))}
        </div>
      </div>

      {/* Article content — full width on mobile, 3/4 on desktop */}
      <div
        className="w-full lg:w-3/4 tiptap
                   px-4 md:px-8 lg:px-16
                   py-4 space-y-4"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(article.content),
        }}
      />
    </div>

  </div>
)
}

export default ArticleDetailPage;
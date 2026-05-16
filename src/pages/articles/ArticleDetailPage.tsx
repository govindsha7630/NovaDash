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
      <div className="flex items-center justify-between">
        <Button
        disabled={updateArticle.isPending}
          variant="outline"
          onClick={() => navigate(`/articles/edit/${article?.$id}`)}
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
            : article?.status === "published"
              ? "Send to Archive"
              : "Publish Article"}
        </Button>
      </div>

      <div className="w-full relative ">
        {article.coverImage ? (
          <img
            className=" w-full h-[400px] rounded-2xl object-cover"
            src={article.coverImage}
            alt=""
          />
        ) : (
          <div className="w-full h-[400px] rounded-2xl bg-gradient-to-t from-purple-900 via-purple-600 to-purple-300" />
        )}
        <div className="w-full text-6xl  font-bold  absolute bottom-0 p-4 text-pretty  drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-wrap">
          {article.title}
        </div>
      </div>
      <div className="z-20 flex items-start relative lg:p-4 lg:my-4 ">

        <div className="lg:w-1/4  sm:hidden sticky top-0  max-h-[calc(100vh-120px)] overflow-hidden border-2 rounded-2xl   text-muted-foreground font-bold text-center my-2">
          <div className="sticky top-0 ">Table of content <span className="text-accent text-xs">Coming Soon Feature</span></div>
          <div className="mt-6 overflow-y-auto  max-h-[calc(100vh-120px)]  ">
            {Array.from({ length: 44 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-full rounded bg-gray-300 animate-pulse mb-2"
              />
            ))}
          </div>
        </div>
        <div
          className="lg:w-3/4 sm:h-full tiptap px-16 py-4 space-y-4 overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(article?.content),
          }}
        />
      </div>
    </div>
  );
}

export default ArticleDetailPage;


import { tablesDB } from "@/appwrite/config";
import env from "@/appwrite/env";
import type { Article } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import '@/styles/tiptap.css'

function ArticleDetailPage() {
  const { slugwithid } = useParams<{ slugwithid: string }>();
  const purify = DOMPurify();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugwithid) return;
    const seperatedId = slugwithid?.split("-").at(-1);

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const row = await tablesDB.getRow({
          databaseId: env.appwriteDatabaseId,
          tableId: env.appwriteCollectionArticles,
          rowId: seperatedId!,
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

  return (
    <div className="h-full p-4 space-y-4 overflow-y-auto flex items-center flex-col">
      {`${article.$id},
    
    ${article.title},`}

    <div className=" tiptap border-2 " dangerouslySetInnerHTML={{ __html: purify.sanitize(article.content) }} />;
    </div>
  );
}

export default ArticleDetailPage;

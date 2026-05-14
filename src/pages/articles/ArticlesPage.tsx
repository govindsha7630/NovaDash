import { Button } from "@/components/ui/button";
import { createSlug, timeAgo, truncate } from "@/components/utils/miniUtils";
import { useArticles } from "@/hooks/useArticle";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const FILTERS = [
  { label: "All", key: null, value: null },
  { label: "Published", key: "status", value: "published" },
  { label: "Draft", key: "status", value: "draft" },
  { label: "Archived", key: "status", value: "archived" },
];

function ArticlesPage() {
  const { data: articles, isLoading } = useArticles();
  // console.log(articles, isLoading);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const statusParam = searchParams.getAll("status");

  const clearFilter = () => {
    navigate("/articles");
  };

  const updateQuery = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams);
    console.log(params.toString());
    updater(params);

    const query = params.toString();
    // console.log("doff", params.toString(), query);

    navigate(`/articles${query ? `?${query}` : ""}`, { replace: true });
  };

  const updateFilter = (key: string | null, value: string | null) => {
    if (!key) {
      clearFilter();
      return;
    }

    updateQuery((params) => {
      const values = new Set(params.getAll(key));

      if (values.has(value!)) {
        values.delete(value!);
      } else {
        values.add(value!);
      }

      // Must delete first then re-append — URLSearchParams
      // doesn't have a "replace all" method for multi-value keys
      params.delete(key);
      values.forEach((v) => params.append(key, v));

      params.delete("page");
    });
  };

  const filteredArticles = (articles ?? []).filter((article) => {
    if (statusParam.length > 0 && !statusParam.includes(article.status))
      return false;
    // if (statusParam === "archived" && article.status !== "archived")
    // return false;
    // if (statusParam === "draft" && article.status !== "draft") return false;

    return true;
  });

  // console.log("statusparam", statusParam, "==");

  // console.log(filteredArticles.map((art) => art.status));
  return (
    <div className="h-full p-4 space-y-4 overflow-y-auto">
      <div className="font-bold text-3xl">
        My Articles
        <p className="text-xs font-medium text-muted-foreground">
          Manage and publish your architectural thoughts
        </p>
      </div>
      {/* BUTTON Section */}
      <div className="flex gap-2 items-center justify-between ">
        <div className="flex gap-2 items-center justify-start">
          {FILTERS.map((filter) => (
            <Button
              key={filter.label}
              onClick={() => updateFilter(filter.key, filter.value)}
              variant="outline"
              size="sm"
              className="hover:text-accent rounded-4xl"
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <div>
          <Button className="px-4 py-6" variant="gradient">
            <Link to={"/articles/create"}>+ New Article</Link>
          </Button>
        </div>
      </div>

      {/* CARDS  */}
      <div className=" grid grid-cols-5 gap-4 ">
        {(filteredArticles ?? []).map((article) => (
          <div className=" " key={article.$id}>
            <div className="border-2 h-40  rounded-t-2xl">
              <img src={article.coverImage || null!} alt="cover Image" />
            </div>
            <div className="p-4 bg-[#0D121E] rounded-b-3xl">
              <div className="font-bold mb-1">
                <Link
                  to={`/articles/${createSlug(article.title, article.$id)}`}
                >
                  {truncate(article.title, 50)}
                </Link>
              </div>

              <div className="text-xs text-muted-foreground">
                {truncate(article.content, 70)}
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mt-2">
                <span className="bg-accent/10 p-1 rounded-3xl text-accent border-2 border-accent">
                  {timeAgo(article.$updatedAt)}
                </span>
                <span
                  className={`p-1  rounded-3xl  text-yellow-400 bg-yellow-200/5 border-2 border-yellow-400 `}
                >
                  {article.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ArticlesPage;

import { getFileUrl } from "@/appwrite/storage";
import { Button } from "@/components/ui/button";
import { createSlug, timeAgo, truncate } from "@/components/utils/miniUtils";
import { useArticles } from "@/hooks/useArticle";
import { Plus, FileText } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const FILTERS = [
  { label: "All",       key: null,     value: null },
  { label: "Published", key: "status", value: "published" },
  { label: "Draft",     key: "status", value: "draft" },
  { label: "Archived",  key: "status", value: "archived" },
];

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  draft:     "bg-amber-500/10  text-amber-400  border-amber-500/30",
  archived:  "bg-muted         text-muted-foreground border-border",
};

function ArticlesPage() {
  const { data: articles, isLoading } = useArticles();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const statusParam = searchParams.getAll("status");

  const updateQuery = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams);
    updater(params);
    const query = params.toString();
    navigate(`/articles${query ? `?${query}` : ""}`, { replace: true });
  };

  const updateFilter = (key: string | null, value: string | null) => {
    if (!key) { navigate("/articles"); return; }
    updateQuery((params) => {
      const values = new Set(params.getAll(key));
      values.has(value!) ? values.delete(value!) : values.add(value!);
      params.delete(key);
      values.forEach((v) => params.append(key, v));
      params.delete("page");
    });
  };

  const isFilterActive = (key: string | null, value: string | null) => {
    if (!key) return statusParam.length === 0;
    return statusParam.includes(value!);
  };

  const filteredArticles = (articles ?? []).filter((article) => {
    if (statusParam.length > 0 && !statusParam.includes(article.status))
      return false;
    return true;
  });

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Articles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="gradient"
          className="gap-2"
          onClick={() => navigate("/articles/create")}
        >
          <Plus size={16} />
          New Article
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => updateFilter(filter.key, filter.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium
                        border transition-all duration-150
                        ${isFilterActive(filter.key, filter.value)
                          ? "bg-violet-600/20 border-violet-500 text-violet-400"
                          : "bg-muted border-transparent text-muted-foreground hover:text-foreground"
                        }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border
                                    rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredArticles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex
                          items-center justify-center mb-4">
            <FileText size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            No articles yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Write your first article to get started
          </p>
          <Button
            variant="gradient"
            onClick={() => navigate("/articles/create")}
          >
            <Plus size={16} className="mr-2" />
            New Article
          </Button>
        </div>
      )}

      {/* Cards grid */}
      {!isLoading && filteredArticles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.$id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Article Card ─────────────────────────────────────────────
function ArticleCard({ article }: { article: any }) {
  const plainText = article.content?.replace(/<[^>]*>/g, "") ?? "";
  const coverUrl = article.coverImage
    ? getFileUrl(article.coverImage)
    : null;

  return (
    <Link
      to={`/articles/${createSlug(article.title, article.$id)}`}
      className="group flex flex-col bg-card border border-border
                 rounded-2xl overflow-hidden
                 hover:border-violet-500/40 hover:shadow-lg
                 hover:shadow-violet-500/5
                 transition-all duration-200"
    >
      {/* Cover image */}
      <div className="relative h-44 flex-shrink-0 overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={article.title}
            className="w-full h-full object-cover
                       group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br
                          from-violet-900/60 to-cyan-900/40
                          flex items-center justify-center">
            <FileText size={32} className="text-violet-400/50" />
          </div>
        )}

        {/* Category badge — overlaid on image */}
        {article.category && (
          <span className="absolute top-3 left-3
                           bg-black/60 backdrop-blur-sm
                           text-white text-[11px] font-medium
                           px-2.5 py-1 rounded-full border border-white/10">
            {article.category}
          </span>
        )}

        {/* Status badge — overlaid on image */}
        <span className={`absolute top-3 right-3
                          text-[11px] font-medium px-2.5 py-1
                          rounded-full border backdrop-blur-sm
                          ${STATUS_STYLES[article.status] ?? STATUS_STYLES.draft}`}>
          {article.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* Title */}
        <h3 className="font-semibold text-foreground leading-snug
                       group-hover:text-violet-400 transition-colors
                       line-clamp-2">
          {article.title || "Untitled"}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {truncate(plainText, 100) || "No content yet..."}
        </p>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {article.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full
                           bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full
                               bg-muted text-muted-foreground">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer — date */}
        <div className="flex items-center justify-between
                        pt-2 border-t border-border mt-auto">
          <span className="text-[11px] text-muted-foreground">
            {timeAgo(article.$updatedAt)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {new Date(article.$createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ArticlesPage;
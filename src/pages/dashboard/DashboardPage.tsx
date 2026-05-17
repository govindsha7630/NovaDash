import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardClock,
  Dot,
  ListTodo,
  Text,
} from "lucide-react";
import {
  truncate,
  capitalize,
  formatDate,
  recentTaskTagColor,
  timeAgo,
  createSlug,
} from "@/components/utils/miniUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodos, useToggleTodo } from "@/hooks/useTodos";
import StatCard from "@/pages/dashboard/StatCard";
import { useTaskModalStore } from "@/store/taskModalStore";
import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticle";
import { getFileUrl } from "@/appwrite/storage";
import { useAuthStore } from "@/store/authStore";

// ── Status badge styles ──────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  draft: "bg-amber-500/10  text-amber-400  border border-amber-500/30",
  archived: "bg-muted text-muted-foreground border border-muted-foreground/30 ",
};

// ── Dynamic greeting based on time of day ───────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// ── Dynamic date string ──────────────────────────────────────
function getTodayString() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DashboardPage() {
  const { data: todos, isLoading } = useTodos();
  const { data: articles } = useArticles();
  const toggleTodo = useToggleTodo();
  const openModal = useTaskModalStore((state) => state.openModal);
  const user = useAuthStore((state) => state.user);

  const totalTodos = todos?.length ?? 0;
  const completedTodos = todos?.filter((t) => t.completed).length ?? 0;
  const pendingTodos = todos?.filter((t) => !t.completed).length ?? 0;
  const recentTodos = todos?.slice(0, 5) ?? [];

  const totalArticles = articles?.length ?? 0;
  const recentArticles = articles?.slice(0, 5) ?? [];

  // First name only from user's name
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <main className="h-full overflow-y-auto p-4 space-y-6">
      {/* ── Header ───────────────────────────────────────────── */}
      <section className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {getTodayString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button variant="gradient" onClick={() => openModal()}>
            Create New Task
          </Button>
        </div>
      </section>

      {/* ── Stat Cards ───────────────────────────────────────── */}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/todos">
          <StatCard
            icon={
              <ListTodo
                color="#8764FF"
                size="52px"
                className="dark:bg-[#181934] bg-violet-100 rounded-sm p-2"
              />
            }
            title="Total Todos"
            count={totalTodos}
            isLoading={isLoading}
            trend={12}
          />
        </Link>
        <Link to="/todos?status=completed">
          <StatCard
            icon={
              <CheckCircle
                color="#35D89D"
                size="52px"
                className="dark:bg-[#10262A] bg-emerald-100 rounded-sm p-2"
              />
            }
            title="Completed"
            count={completedTodos}
            isLoading={isLoading}
            trend={8}
          />
        </Link>
        <Link to="/todos?status=active">
          <StatCard
            icon={
              <ClipboardClock
                color="#FBBF24"
                size="52px"
                className="dark:bg-[#25231E] bg-amber-100 rounded-sm p-2"
              />
            }
            title="Pending Tasks"
            count={pendingTodos}
            isLoading={isLoading}
            trend={-3}
          />
        </Link>
        <Link to="/articles">
          <StatCard
            icon={
              <Text
                color="#22D3EE"
                size="52px"
                className="dark:bg-[#0E2632] bg-cyan-100 rounded-sm p-2"
              />
            }
            title="Total Articles"
            count={totalArticles}
            isLoading={isLoading}
            trend={24}
          />
        </Link>
      </section>

      {/* ── Recent Todos + Recent Articles ───────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Todos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Todos</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link
                to="/todos"
                className="text-sm text-primary font-semibold hover:text-primary"
              >
                View All
              </Link>
            </Button>
          </div>
          <div className="h-px bg-border mb-4" />

          <div className="space-y-1">
            {recentTodos.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                No tasks yet
              </p>
            )}
            {recentTodos.map((todo) => (
              <div
                key={todo.$id}
                className="flex items-center justify-between
                           py-3 border-b border-border last:border-0 gap-3"
              >
                {/* Left — checkbox + title */}
                <div className="flex items-center gap-3 min-w-0">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() =>
                      toggleTodo.mutate({
                        id: todo.$id,
                        completed: !todo.completed,
                      })
                    }
                    disabled={toggleTodo.isPending}
                    className="flex-shrink-0 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/todos/${todo.$id}`}
                      className={`text-sm font-medium transition-colors
                                  hover:text-violet-400 block truncate
                                  ${
                                    todo.completed
                                      ? "line-through text-muted-foreground"
                                      : "text-foreground"
                                  }`}
                    >
                      {truncate(todo.title, 40)}
                    </Link>
                    <span className="text-xs text-muted-foreground flex items-center">
                      {todo.tags?.length ? todo.tags[0] : "No tags"}
                      <Dot size={16} />
                      {timeAgo(todo.$updatedAt)}
                    </span>
                  </div>
                </div>

                {/* Right — priority + date */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={recentTaskTagColor(todo.priority)}>
                    {capitalize(todo.priority)}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Calendar size={12} />
                    {formatDate(todo.dueDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Articles */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">
              Recent Articles
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link
                to="/articles"
                className="text-sm text-primary font-semibold hover:text-primary"
              >
                Manage Library
              </Link>
            </Button>
          </div>
          <div className="h-px bg-border mb-4" />

          <div className="space-y-1">
            {recentArticles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                No articles yet
              </p>
            )}
            {recentArticles.map((article) => (
              <Link
                key={article.$id}
                to={`/articles/${createSlug(article.title, article.$id)}`}
                className="flex items-center gap-3 py-3
                           border-b border-border last:border-0
                           group hover:bg-muted/30 rounded-lg px-2 -mx-2
                           transition-colors"
              >
                {/* Thumbnail */}
                <div
                  className="flex-shrink-0 w-16 h-12 rounded-xl
                                overflow-hidden bg-muted"
                >
                  {article.coverImage ? (
                    <img
                      src={getFileUrl(article.coverImage)}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-gradient-to-br
                                    from-violet-900/40 to-cyan-900/30"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-foreground
                                truncate group-hover:text-violet-400
                                transition-colors"
                  >
                    {truncate(article.title, 45)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(article.$updatedAt)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5
                                      rounded-full uppercase tracking-wide
                                      ${
                                        STATUS_STYLES[article.status] ??
                                        STATUS_STYLES.draft
                                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                  size={16}
                  className="text-muted-foreground flex-shrink-0
                             group-hover:text-violet-400 transition-colors"
                />
              </Link>
            ))}
          </div>
        </Card>
      </section>

      {/* ── Activity Timeline ── build yourself below this line ── */}
    </main>
  );
}

export default DashboardPage;

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
import { useMemo } from "react";
import { useActivityEvents } from "@/hooks/useActivityEvents";
import { useNotificationStore } from "@/store/notificationStore";

// ── Moved OUTSIDE component — recreating types inside = bad practice
type ActivityEvent = {
  id: string;
  type: "todo" | "article";
  title: string;
  action: string;
  timestamp: string;
  link: string;
};

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  draft: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  archived: "bg-muted text-muted-foreground border border-muted-foreground/30",
};

// Dot color per event type — violet for todos, cyan for articles
const DOT_COLOR: Record<ActivityEvent["type"], string> = {
  todo: "bg-violet-500",
  article: "bg-cyan-500",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getTodayString() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function calcTrend(items: any[]) {
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  const thisWeek = items.filter((item) => {
    const created = new Date(item.$createdAt).getTime();
    return created >= now - oneWeek;
  }).length;

  const lastWeek = items.filter((item) => {
    const created = new Date(item.$createdAt).getTime();
    return created >= now - 2 * oneWeek && created < now - oneWeek;
  }).length;

  if (lastWeek === 0) return thisWeek > 0 ? 100 : 0;
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
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

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const lastChecked = useNotificationStore((s) => s.lastChecked);
  const { limited: allEvents } = useActivityEvents(10, lastChecked);

  // Then use it:
  const todoTrend = calcTrend(todos ?? []);
  const articleTrend = calcTrend(articles ?? []);
  const completedTrend = calcTrend((todos ?? []).filter((t) => t.completed));
  const pendingTrend = calcTrend((todos ?? []).filter((t) => !t.completed));

  return (
    <main className="h-full overflow-y-auto p-4 space-y-6">
      {/* Header */}
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

      {/* Stat Cards */}
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
            trend={todoTrend}
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
            trend={completedTrend}
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
            trend={pendingTrend}
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
            trend={articleTrend}
          />
        </Link>
      </section>

      {/* Recent Todos + Articles */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Todos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Todos</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/todos" className="text-sm text-primary font-semibold">
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
                className="flex items-center justify-between py-3
                           border-b border-border last:border-0 gap-3"
              >
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
            <h2 className="text-lg font-bold">Recent Articles</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link
                to="/articles"
                className="text-sm text-primary font-semibold"
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
                className="flex items-center gap-3 py-3 border-b border-border
                           last:border-0 group hover:bg-muted/30 rounded-lg
                           px-2 -mx-2 transition-colors"
              >
                <div className="flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden bg-muted">
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
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-foreground truncate
                                group-hover:text-violet-400 transition-colors"
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

      {/* ── Activity Timeline ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Activity Timeline
          </h2>
          <span className="text-xs text-muted-foreground">
            Last {allEvents.length} actions
          </span>
        </div>

        <Card className="p-6">
          {allEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No activity yet
            </p>
          ) : (
            /*
              The vertical line:
              border-l-2 draws a 2px left border on this container
              pl-6 pushes all content 24px right — away from the line
              space-y-6 adds gap between each event row
            */
            <div className="relative border-l-2 border-border pl-8 space-y-6">
              {allEvents.map((event, index) => (
                <div key={`${event.id}-${index}`} className="relative">
                  {/*
                    The dot:
                    absolute — positioned relative to this event div
                    -left-[calc(1.5rem+1px)] — moves left by 24px (pl-6) + 1px
                    to sit exactly centered on the 2px border line
                    top-1 — aligns with first line of text
                    w-3 h-3 — small dot
                    rounded-full — circle shape
                    border-2 border-background — white ring around dot
                    so it looks punched out of the line
                  */}
                  <div
                    className={`absolute -left-[calc(1.5rem+1px)] top-1
                                   w-3 h-3 rounded-full
                                   border-2 border-background
                                   ${DOT_COLOR[event.type]}`}
                  />

                  {/* Event content row */}
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {/* action text in muted */}
                      <span className="text-muted-foreground">
                        {event.action}{" "}
                      </span>
                      {/* title as a clickable link */}
                      <Link
                        to={event.link}
                        className={`font-medium hover:underline
                                    underline-offset-2
                                    ${
                                      event.type === "todo"
                                        ? "text-violet-400"
                                        : "text-cyan-400"
                                    }`}
                      >
                        "{truncate(event.title, 45)}"
                      </Link>
                    </p>

                    {/* timestamp — right aligned, never wraps */}
                    <span
                      className="text-xs text-muted-foreground
                                     flex-shrink-0 mt-0.5"
                    >
                      {timeAgo(event.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}

export default DashboardPage;

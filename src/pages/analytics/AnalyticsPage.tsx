import { useArticles } from "@/hooks/useArticle";
import { useTodos } from "@/hooks/useTodos";
import StatCard from "../dashboard/StatCard";
import {
  AlertCircle,
  CalendarClockIcon,
  CalendarDays,
  CircleCheckBig,
  ClipboardPen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useMemo } from "react";
import { getArticleAnalytics } from "@/hooks/useAnalytics";

function AnalyticsPage() {
  const { isLoading, data: todos } = useTodos();
  const { data: articles } = useArticles();
  // console.log(todos);
  console.log(articles);

  const publishedArtiCount = articles?.filter(
    (t) => t.status === "published",
  ).length;

  const overdueTodosCount = todos?.filter(
    (t) => t.dueDate && !t.completed && new Date(t.dueDate) < new Date(),
  ).length;

  const highPriorityCount = todos?.filter((t) => t.priority === "high").length;

  const completedCount = todos?.filter((t) => t.completed === true).length ?? 0;
  const total = todos?.length ?? 0;
  const rate =
    total === 0 ? 0 : Number(((completedCount / total) * 100).toFixed(1));

  // ------------------------------------------------

  const tasksOverTime = useMemo(() => {
    // Phase 1 — build buckets
    const buckets: { day: string; dateKey: string; tasks: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      buckets.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        dateKey: date.toLocaleDateString("en-CA"),
        tasks: 0,
      });
    }

    // Phase 2 — fill buckets
    todos?.forEach((t) => {
      const creAt = new Date(t.$createdAt).toLocaleDateString("en-CA");
      const bucket = buckets.find((b) => b.dateKey === creAt);
      if (bucket) bucket.tasks++;
    });

    // Phase 3 — strip dateKey
    return buckets.map(({ dateKey, ...rest }) => rest);
  }, [todos]); // only recomputes when todos changes

  console.log(tasksOverTime);
  // ------------------------------------------------

  const articleAnalytics = useMemo(
    () => (articles ? getArticleAnalytics(articles, "week") : []),
    [articles], // ← only recomputes when articles array changes
  );
  console.log(articleAnalytics);
  // ------------------------------------------------

  return (
    <div className="px-4 py-6 space-y-6 h-full overflow-y-auto ">
      {/* Heading and Date Filter Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col justify-start">
          <span className="text-2xl">Performace Analytics</span>
          <span className="text-sm text-muted-foreground">
            Real-time overview of your productivity and content reach.
          </span>
        </div>
        {/* Date Filter Section  */}
        <div className="bg-background-muted text-muted-foreground rounded-xl flex items-center gap-8 h-12 py-2 px-4">
          <button>Today</button>
          <button>Weekly</button>
          <button>Last 30 Days</button>
          <div className="border h-full" />
          <button>
            <CalendarDays />
          </button>
        </div>
      </div>

      {/* Stats Card  */}
      <div className="flex items-center justify-between gap-8">
        <StatCard
          icon={
            <CircleCheckBig
              color="#7C5CFC"
              size="52px"
              className="bg-primary/10 rounded-sm p-2"
            />
          }
          count={rate || 0}
          title="Completion Rate"
          isLoading={isLoading}
          trend={56}
        />

        <StatCard
          icon={
            <AlertCircle
              color="#FBBF24"
              size="52px"
              className="dark:bg-[#25231E] bg-amber-100 rounded-sm p-2"
            />
          }
          count={highPriorityCount || 0}
          title="High Priority Todos"
          isLoading={isLoading}
          trend={56}
        />

        <StatCard
          icon={
            <ClipboardPen
              color="#22D3EE"
              size="52px"
              className="bg-accent/10 rounded-sm p-2"
            />
          }
          count={publishedArtiCount || 0}
          title="Published Articles"
          isLoading={isLoading}
          trend={56}
        />

        <StatCard
          icon={
            <CalendarClockIcon
              color="red"
              size="52px"
              className="bg-red-500/10 rounded-sm p-2"
            />
          }
          count={overdueTodosCount || 0}
          title="Overdue Todos"
          isLoading={isLoading}
          trend={56}
        />
      </div>

      {/* Todo And Article Card */}
      <div className="flex items-center justify-between gap-8">
        <Card className="p-4 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col  justify-start">
              <span className="text-xl font-bold">Tasks Over Time</span>
              <span className="text-xs text-muted-foreground">
                Productivity Throughout
              </span>
            </div>
            <span className="flex items-center gap-2 bg-muted-foreground/10 p-2 rounded-md ">
              <div className="bg-primary h-2.5 w-2.5 rounded-full " />
              Tasks
            </span>
          </div>

          <div className="h-60 ">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={tasksOverTime}
                margin={{ top: 5, right: 0, left: 20, bottom: 0 }}
              >
                <XAxis dataKey="day" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#7C5CFC"
                  fill="#7C5CFC"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col  justify-start">
              <span className="text-xl font-bold">Content Creation</span>
              <span className="text-xs text-muted-foreground">
                Articles published per month
              </span>
            </div>
            <span className="flex items-center gap-2 bg-muted-foreground/10 p-2 rounded-md ">
              <div className="bg-accent h-2.5 w-2.5 rounded-full " />
              Articles
            </span>
          </div>

          <div className="h-60">
            {/* Content Creation — needs its own data */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={articleAnalytics}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
              >
                {/* <XAxis dataKey="month" /> */}
                <XAxis dataKey="label" />
                <Tooltip />
                <Bar dataKey="articles" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                {/* <Bar dataKey="tasks" fill="#22D3EE" radius={[4, 4, 0, 0]} /> */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="flex  justify-between items-stretch gap-8">
        <Card className="flex-1 p-4">
          <div className="text-lg text-muted-foreground font-semibold">
            Todos By Priority
          </div>
          <div className="border-2">chart</div>

          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 justify-start text-xs text-[#d7d5c2]">
                {" "}
                <div className="w-2 h-2 bg-rose-500  rounded-full " />
                High Priority
              </span>{" "}
              <span className="text-muted-foreground">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 justify-start text-xs text-[#d7d5c2]">
                {" "}
                <div className="w-2 h-2 bg-cyan-500  rounded-full " />
                Medium Priority
              </span>{" "}
              <span className="text-muted-foreground">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 justify-start text-xs text-[#d7d5c2]">
                {" "}
                <div className="w-2 h-2 bg-amber-500 rounded-full " />
                Low Priority
              </span>{" "}
              <span className="text-muted-foreground">60%</span>
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-4">
          <div className="text-lg text-muted-foreground font-semibold">
            Completion Trend
          </div>
          <div className="border-2">Linechart</div>
        </Card>
        <Card className="flex-1 p-4">
          <div className="text-lg text-muted-foreground font-semibold">
            Top Article
          </div>
          <div className="border-2">Horizontal BarChart</div>
        </Card>
        <Card className="flex-1 p-4">
          <div className="text-lg text-muted-foreground font-semibold">
            Tags Usage
          </div>
          <div className="border-2">Horizontal BarChart</div>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsPage;

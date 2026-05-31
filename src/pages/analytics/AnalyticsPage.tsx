import type { Payload } from "recharts/types/component/DefaultTooltipContent";
import type { TooltipProps } from "recharts";
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
  RadialBar,
  RadialBarChart,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";

import { useAnalytics } from "@/hooks/useAnalytics";

function AnalyticsPage() {
  const {
    rate,
    highPriorityCount,
    publishedArtiCount,
    overdueTodosCount,
    tasksOverTime,
    articleAnalytics,
    isLoading,
  } = useAnalytics();
  // ------------------------------------------------
  // console.log(articleAnalytics);
  // ------------------------------------------------

  return (
    <div className="px-4 py-6 space-y-6 h-full overflow-y-auto">
      {/* Heading and Date Filter Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col justify-start">
          <span className="text-2xl">Performace Analytics</span>
          <span className="text-sm text-muted-foreground">
            Real-time overview of your productivity and content reach.
          </span>
        </div>
        {/* Date Filter Section  */}
        <div className="bg-background-muted text-muted-foreground rounded-xl flex items-center gap-4 sm:gap-8 h-12 py-2 px-4 w-full md:w-auto overflow-x-auto whitespace-nowrap">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <Card className="p-4 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-start">
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

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={tasksOverTime}
                margin={{ top: 5, right: 0, left: 20, bottom: 0 }}
              >
                <XAxis dataKey="day" />
                <Tooltip content={<TaskTooltip />} />
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
            <div className="flex flex-col justify-start">
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

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={articleAnalytics}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
              >
                   
                <XAxis dataKey="label"  width={12} />
                <Tooltip
                  content={<ArticleTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar dataKey="articles" fill="#22D3EE"  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-stretch gap-4 md:gap-8">
        <Card className="flex-1 p-4 justify-between">
          <div className="text-lg text-muted-foreground font-semibold">
            Todos By Priority
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                data={articleAnalytics}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
              >
                <Tooltip
                  content={<ArticleTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Pie dataKey="articles" fill="#22D3EE" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 justify-start text-xs text-[#d7d5c2]">
                <div className="w-2 h-2 bg-rose-500 rounded-full " />
                High Priority
              </span>
              <span className="text-muted-foreground">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 justify-start text-xs text-[#d7d5c2]">
                <div className="w-2 h-2 bg-cyan-500 rounded-full " />
                Medium Priority
              </span>
              <span className="text-muted-foreground">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 justify-start text-xs text-[#d7d5c2]">
                <div className="w-2 h-2 bg-amber-500 rounded-full " />
                Low Priority
              </span>
              <span className="text-muted-foreground">60%</span>
            </div>
          </div>
        </Card>
        
        <Card className="flex-1 p-4 justify-between">
          <div className="text-lg text-muted-foreground font-semibold">
            Completion Trend
          </div>
          
          {/* 1. Increased height from h-80 to h-[420px] to give 12 months room */}
          <div className="h-96 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={articleAnalytics}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <XAxis type="number" />
                
                {/* 2. Added interval={0} to stop Recharts from hiding labels */}
                {/* Added width={60} to ensure the text doesn't get clipped */}
                <YAxis 
                  dataKey="label" 
                  type="category" 
                  interval={0} 
                  width={60} 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-muted-foreground"
                />
                
                <Tooltip
                  content={<ArticleTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                
                <Bar
                  dataKey="articles"
                  fill="#22D3EE"
                  radius={[0, 4, 4, 0]}
                  barSize={16} // Shrunk slightly to fit 12 bars comfortably
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="flex-1 p-4 justify-between">
          <div className="text-lg text-muted-foreground font-semibold">
            Top Article
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={articleAnalytics}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
              >
                <Legend />
                <Tooltip
                  content={<ArticleTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Line dataKey="articles" fill="#22D3EE" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="flex-1 p-4 justify-between">
          <div className="text-lg text-muted-foreground font-semibold">
            Tags Usage
          </div>
          <div className="border-2 mt-4 p-4 text-center rounded-md text-muted-foreground">
            Horizontal BarChart
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsPage;

// --- FIXED TOOLTIP TYPES ---

interface TaskDataPoint {
  day: string;
  tasks: number;
}

interface ArticleDataPoint {
  label: string;
  articles: number;
}

// Creating a custom interface to bypass the Recharts generic issue
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const TaskTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const data = item.payload as TaskDataPoint;

  return (
    <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-foreground">{data.day}</p>
      <p className="text-primary">
        Tasks: <span className="font-bold">{item.value}</span>
      </p>
    </div>
  );
};

const ArticleTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const data = item.payload as ArticleDataPoint;

  return (
    <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-foreground">{data.label}</p>
      <p className="text-accent">
        Articles: <span className="font-bold">{item.value}</span>
      </p>
    </div>
  );
};
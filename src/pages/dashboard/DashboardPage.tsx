import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  ClipboardClock,
  Dot,
  ListTodo,
  Text,
  TrendingUp,
} from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import StatCard from "@/pages/dashboard/StatCard";

function DashboardPage() {
  const { data: todos, isLoading } = useTodos();

  // Derive what you need
  const totalTodos = todos?.length ?? 0;
  const completedTodos = todos?.filter((t) => t.completed).length ?? 0;
  const pendingTodos = todos?.filter((t) => !t.completed).length ?? 0;
  const recentTodos = todos?.slice(0, 4) ?? [];
  console.log("dhsbhb", recentTodos);
  return (
    <main className="space-y-4">
      <section className="flex items-center  justify-between ">
        <div>
          <div className="text-xl font-bold">
            Good Morning ,<span> Alex👋</span>
          </div>
          <div className="text-xs">Monday, October 30</div>
        </div>
        <div className="flex gap-2 hidden">
          <Button variant="outline">Download Report</Button>
          <Button variant="default">Create New Task</Button>
        </div>
      </section>
      <section className=" gap-8 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Todo/Task */}
        <StatCard
          icon={
            <ListTodo
              color="#8764FF"
              size="52px"
              className="dark:bg-[#181934] bg-amber-100  rounded-sm p-2"
            />
          }
          title="Total"
          count={totalTodos}
          isLoading={isLoading}
          trend={1}
        />
        {/* Completed Todo/Task */}

        <StatCard
          icon={
            <CheckCircle
              color="#35D89D"
              size="52px"
              className="dark:bg-[#10262A] bg-amber-100  rounded-sm p-2"
            />
          }
          title="Completed"
          count={completedTodos}
          isLoading={isLoading}
          trend={1}
        />

        <StatCard
          icon={
            <ClipboardClock
              color="#FBBF24"
              size="52px"
              className="dark:bg-[#25231E] bg-amber-100  rounded-sm p-2"
            />
          }
          title="Pending Task"
          count={pendingTodos}
          isLoading={isLoading}
          trend={1}
        />
        <StatCard
          icon={
            <Text
              color="#22D3EE"
              size="52px"
              className="dark:bg-[#0E2632]   rounded-sm p-2"
            />
          }
          title="Total Articles"
          count={pendingTodos}
          isLoading={isLoading}
          trend={1}
        />
      </section>
      <section className=" flex  gap-8">
        <div className="w-1/2">
          <Card className="px-4 py-6">
            {/* {recentTodos.map((p)=>(
  
))} */}
            <div className="flex items-center justify-between my-1">
              <span className="text-lg font-bold ">Recent Todos</span>
              <span className="text-sm text-primary font-black">View All</span>
            </div>
            <div className="border-2" />
            <div>
              <div className="key pb-2 mb-2 border-b-2 flex items-center justify-between">
                <div className="flex flex-col ">
                  <span className="text-md"> Finalizing the mooment boss bay.</span>
                  <span className="flex items-center  text-muted-foreground">
                    Marketing <span><Dot size={40} className=" -m-2"/> </span> <span> created 2h ago</span>
                  </span>
                </div>
                <div className="flex gap-2 ">
                  <span className={`bg-[rgba(255,86,86,0.12)] p-1 rounded-sm text-red-400 text-xs  `}>High Priority</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={16} /> Oct 25
                  </div>
                </div>
              </div>

              
            </div>
          </Card>
        </div>
        <div className="w-1/2 border-amber-600 border-2">right</div>
      </section>
    </main>
  );
}

export default DashboardPage;

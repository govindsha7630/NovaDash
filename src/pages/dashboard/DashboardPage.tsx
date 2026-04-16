import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
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
} from "@/components/utils/miniUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodos } from "@/hooks/useTodos";
import StatCard from "@/pages/dashboard/StatCard";
import { useTaskModalStore } from "@/store/taskModalStore";
import { Link } from "react-router-dom";
// Add this import at top
import { useToggleTodo } from "@/hooks/useTodos";

function DashboardPage() {
  const { data: todos, isLoading } = useTodos();
  // Inside DashboardPage function — add this line
  const toggleTodo = useToggleTodo();
  const openModal = useTaskModalStore((state) => state.openModal);

  // Derive what you need
  const totalTodos = todos?.length ?? 0;
  const completedTodos = todos?.filter((t) => t.completed).length ?? 0;
  const pendingTodos = todos?.filter((t) => !t.completed).length ?? 0;
  const recentTodos = todos?.slice(0, 5) ?? [];
  return (
    <main className="space-y-4">
      <section className="flex items-center  justify-between ">
        <div>
          <div className="text-xl font-bold">
            Good Morning ,<span> Alex👋</span>
          </div>
          <div className="text-xs">Monday, October 30</div>
        </div>
        <div className="flex gap-2 ">
          <Button variant="outline">Download Report</Button>
          <Button variant="default" onClick={() => openModal()}>
            Create New Task
          </Button>
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
      <section className=" lg:flex  gap-8">
        <div className="lg:w-1/2">
          <Card className="px-4 py-6">
            <div className="flex items-center justify-between my-1">
              <span className="text-lg font-bold ">Recent Todos</span>
              <span className="text-sm text-primary font-black">
                <Button variant={"ghost"} className="font-bold">
                  <Link to={"/todos"} >View All</Link>
                </Button>
              </span>
            </div>
            <div className="border-2" />
            <div>
              {/* Here is we use map */}
              {recentTodos.map((todo) => (
                <div
                  key={todo.$id}
                  className="pb-2 mb-2 border-b flex items-center  justify-between "
                >
                  <div className="flex gap-2 items-center">
                    {/* ✅ Checkbox — separate from Link, has its own onClick */}
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() =>
                        toggleTodo.mutate({
                          id: todo.$id,
                          completed: !todo.completed,
                        })
                      }
                      disabled={toggleTodo.isPending}
                      className="cursor-pointer"
                    />

                    {/* ✅ Title — this is what navigates, not the checkbox */}
                    <div className="flex flex-col">
                      <Link
                        to={`/todos/${todo.$id}`}
                        className={`text-sm hover:text-violet-400 transition-colors
                                ${
                                  todo.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                      >
                        {truncate(todo.title, 50)}
                      </Link>
                      <span className="flex items-center text-xs text-muted-foreground">
                        {todo.tags?.length ? todo.tags[0] : "No tags"}
                        <Dot size={40} className="-m-2" />
                        created {timeAgo(todo.$updatedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className={recentTaskTagColor(todo.priority)}>
                      {capitalize(todo.priority)} Priority
                    </span>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Calendar size={14} />
                      {formatDate(todo.dueDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:w-1/2 border-amber-600 border-2">right</div>
      </section>
    </main>
  );
}

export default DashboardPage;

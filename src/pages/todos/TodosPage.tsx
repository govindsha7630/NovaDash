import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTodos, useDeleteTodo, useToggleTodo } from "@/hooks/useTodos";
import { Checkbox } from "@/components/ui/checkbox";
import {
  capitalize,
  formatDate,
  recentTaskTagColor,
  truncate,
} from "@/components/utils/miniUtils";

export default function TodosPage() {
  const { data: todos, isLoading } = useTodos();
  const deleteTodo = useDeleteTodo();
  const toggleTodo = useToggleTodo();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">My Todos</h1>
          <span className="text-muted-foreground ">
            Manage your daily architected workflow and tasks.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div>Slider switch Btn for grid and list view</div>
          <Button
            className="p-6 bg-gradient-to-r  from-violet-600 to-cyan-500
                                               hover:from-violet-500 hover:to-cyan-400
                                               text-white border-0 min-w-[110px]"
          >
            + Add Tasks
          </Button>
        </div>
      </section>

      {/* Filter Button ribbon */}
      <section className="flex gap-2 py-8">
        <Button
          variant={"secondary"}
          className="hover:bg-primary hover:text-white text-muted-foreground"
        >
          All
        </Button>
        <Button
          variant={"secondary"}
          className="hover:bg-primary hover:text-white text-muted-foreground"
        >
          Active
        </Button>
        <Button
          variant={"secondary"}
          className="hover:bg-primary hover:text-white text-muted-foreground"
        >
          Completed
        </Button>
        <Button
          variant={"secondary"}
          className="hover:bg-primary hover:text-white text-muted-foreground"
        >
          High Priority
        </Button>
        <Button
          variant={"secondary"}
          className="hover:bg-primary hover:text-white text-muted-foreground"
        >
          Due Today
        </Button>
      </section>
      {/* All Todo/Task Card */}
      <section className="grid grid-cols-4 gap-6">
        {todos?.map((todo) => (
          <Card key={todo.$id}>
            <div className="w-full py-4 px-4 border-2">
              <div className="flex items-center justify-start gap-4 mb-4">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() =>
                    toggleTodo.mutate({
                      id: todo.$id,
                      completed: !todo.completed,
                    })
                  }
                  disabled={toggleTodo.isPending}
                  className="cursor-pointer rounded-full p-4"
                />
                <div className=" text-xl font-medium text-wrap border-2 ">
                    {truncate(todo.title, 30)}
                </div>
              </div>
              <div className="flex gap-4 items-center justify-start mb-4" >
                <span className={recentTaskTagColor(todo.priority)}>
                  {capitalize(todo.priority)}
                </span>
                <span className="bg-muted p-1 rounded-sm text-xs">
                  {formatDate(todo.$createdAt)}
                </span>
                <span className="bg-primary  text-white p-1 rounded-sm text-xs ">
                  {todo.tags?.length ? todo.tags[0] : "No tags"}
                </span>
              </div>
              <div className="text-muted-foreground">
                <div className="mb-2 flex items-center justify-between">
                  <span>Subtask</span>
                  <span>4/5</span>
                </div>
                <div className="h-2 bg-red-500 rounded-3xl">
                  <div className="bg-blue-400 h-2 w-8/10 rounded-3xl"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}

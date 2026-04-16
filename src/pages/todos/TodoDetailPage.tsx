import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { tablesDB } from "@/appwrite/config";
import env from "@/appwrite/env";
import type { Todo } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/components/utils/miniUtils";

function TodoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTodo = async () => {
      try {
        setLoading(true);

        const row = await tablesDB.getRow({
          databaseId: env.appwriteDatabaseId,
          tableId: env.appwriteCollectionTodos,
          rowId: id,
        });

        setTodo(row as unknown as Todo);
      } catch (error) {
        console.error("Failed to fetch todo:", error);
        navigate("/todos"); // redirect if not found
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id, navigate]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!todo) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground
                           hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      {/* Todo detail card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        {/* Title */}
        <h1
          className={`text-2xl font-bold
                    ${
                      todo.completed
                        ? " text-muted-foreground"
                        : "text-foreground"
                    }`}
        >
          {todo.title}
        </h1>

        {/* Priority badge */}
        <span
          className="text-xs px-2 py-1 rounded-full
                                 bg-violet-500/15 text-violet-400"
        >
          {todo.priority} priority
        </span>

        {/* Description */}
        {todo.description && (
          <div className="text-muted-foreground  text-sm leading-relaxed">
            {todo.description}
          </div>
        )}

        {/* Meta */}
        <div
          className="grid grid-cols-2 gap-4 pt-4
                                border-t border-border text-sm"
        >
          <div>
            <p
              className="text-xs text-muted-foreground uppercase
                                      tracking-wider mb-1"
            >
              Due Date
            </p>
            <p className="text-foreground">
              {formatDate(todo.dueDate) ?? "No due date"}
            </p>
          </div>
          <div>
            <p
              className="text-xs text-muted-foreground uppercase
                                      tracking-wider mb-1"
            >
              Status
            </p>
            <p className={todo.completed ? "text-green-500" : "text-amber-500"}>
              {todo.completed ? "Completed" : "Pending"}
            </p>
          </div>
          <div>
            <p
              className="text-xs text-muted-foreground uppercase
                                      tracking-wider mb-1"
            >
              Tags
            </p>
            <div className="flex gap-1 flex-wrap">
              {todo.tags?.length ? (
                todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full
                                                   bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoDetailPage;

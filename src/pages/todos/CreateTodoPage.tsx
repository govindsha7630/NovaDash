import { useCreateTodo } from "@/hooks/useTodos";
import { useNavigate } from "react-router-dom";

export default function CreateTodoPage() {
  const createTodo = useCreateTodo();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const priority = (form.elements.namedItem("priority") as HTMLSelectElement)
      .value as "high" | "medium" | "low";
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;
    const dueDate = (form.elements.namedItem("dueDate") as HTMLInputElement)
      .value;
    const tags = (form.elements.namedItem("tags") as HTMLInputElement).value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    createTodo.mutate(
      { title, priority, description, dueDate, tags },
      {
        // onSuccess here overrides the hook's onSuccess
        // Use this when you need page-specific behavior after mutation
        onSuccess: () => {
          navigate("/todos"); // go back to list after creating
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Todo title" required />
      <input name="description" placeholder="description" required />
      <input name="tags" placeholder="Tags" required />
      <input name="dueDate" placeholder="dueDate" required />

      <select name="priority">
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit" disabled={createTodo.isPending}>
        {createTodo.isPending ? "Creating..." : "Create Todo"}
      </button>
    </form>
  );
}

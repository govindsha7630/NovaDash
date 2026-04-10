import { Button } from "@/components/ui/button"
import { useTodos, useDeleteTodo, useToggleTodo } from "@/hooks/useTodos"

export default function TodosPage() {
    const { data: todos, isLoading } = useTodos()
    const deleteTodo = useDeleteTodo()
    const toggleTodo = useToggleTodo()

    if (isLoading) return <p>Loading...</p>

    return (
        <div>
            {todos?.map(todo => (
                <div key={todo.$id}>

                    {/* Toggle complete */}
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo.mutate({
                            id: todo.$id,
                            completed: !todo.completed
                        })}
                    />

                    <span>{todo.title}</span>

                    {/* Delete */}
                    <Button
                        onClick={() => deleteTodo.mutate(todo.$id)}
                        disabled={deleteTodo.isPending}
                        className="mx-6"
                    >
                        {deleteTodo.isPending ? "Deleting..." : "Delete"}
                    </Button>

                </div>
            ))}
        </div>
    )
}
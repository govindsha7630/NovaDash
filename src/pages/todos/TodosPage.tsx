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
                    <button
                        onClick={() => deleteTodo.mutate(todo.$id)}
                        disabled={deleteTodo.isPending}
                    >
                        {deleteTodo.isPending ? "Deleting..." : "Delete"}
                    </button>

                </div>
            ))}
        </div>
    )
}
import type { Todo, Subtask } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Trash2, Pencil } from "lucide-react"
import { useToggleTodo, useDeleteTodo } from "@/hooks/useTodos"
import { Link } from "react-router-dom"
import { useTaskModalStore } from "@/store/taskModalStore"
import {
    capitalize,
    formatDate,
    recentTaskTagColor,
    truncate,
} from "@/components/utils/miniUtils"

interface TodoCardProps {
    todo: Todo
    view: "grid" | "list"
}

export function TodoCard({ todo, view }: TodoCardProps) {
    const toggleTodo = useToggleTodo()
    const deleteTodo = useDeleteTodo()
    const openModal = useTaskModalStore((state) => state.openModal)

    // Parse subtasks from JSON string
    const subtasks: Subtask[] = (() => {
        try {
            return todo.subtasks ? JSON.parse(todo.subtasks) : []
        } catch {
            return []
        }
    })()

    const completedSubtasks = subtasks.filter((s) => s.completed).length
    const totalSubtasks = subtasks.length
    const progressPercent = totalSubtasks > 0
        ? Math.round((completedSubtasks / totalSubtasks) * 100)
        : 0

    // ─── Grid view card ────────────────────────────────────────────────────
    if (view === "grid") {
        return (
            <div className={`bg-card border border-border rounded-xl p-4
                             hover:border-violet-500/40 hover:-translate-y-0.5
                             transition-all duration-200 group flex flex-col gap-3
                             ${todo.completed ? "opacity-60" : ""}`}>

                {/* Top row — checkbox + priority + actions */}
                <div className="flex items-start justify-between gap-2">
                    <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() =>
                            toggleTodo.mutate({
                                id: todo.$id,
                                completed: !todo.completed,
                            })
                        }
                        disabled={toggleTodo.isPending}
                        className="mt-0.5 flex-shrink-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5 ml-auto">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                         ${recentTaskTagColor(todo.priority)}`}>
                            {capitalize(todo.priority)}
                        </span>
                        {/* Actions — appear on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100
                                        transition-opacity">
                            <button
                                onClick={() => openModal(todo)}
                                className="p-1 rounded hover:bg-muted text-muted-foreground
                                           hover:text-foreground transition-colors"
                            >
                                <Pencil size={12} />
                            </button>
                            <button
                                onClick={() => deleteTodo.mutate(todo.$id)}
                                className="p-1 rounded hover:bg-red-500/10 text-muted-foreground
                                           hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Title — fix: break-words prevents overflow */}
                <Link
                    to={`/todos/${todo.$id}`}
                    className={`text-sm font-semibold leading-snug break-words
                                word-break overflow-wrap-anywhere
                                hover:text-violet-400 transition-colors pr-1
                                ${todo.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                >
                    {todo.title}
                </Link>

                {/* Description */}
                {todo.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed
                                  line-clamp-2">
                        {todo.description}
                    </p>
                )}

                {/* Tags row */}
                <div className="flex flex-wrap gap-1">
                    {todo.tags?.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full
                                       bg-violet-500/10 text-violet-400"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Footer — date + subtask progress */}
                <div className="mt-auto space-y-2">

                    {/* Due date */}
                    {todo.dueDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar size={12} />
                            {formatDate(todo.dueDate)}
                        </div>
                    )}

                    {/* Subtask progress */}
                    {totalSubtasks > 0 && (
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs
                                            text-muted-foreground">
                                <span>Subtasks</span>
                                <span className="font-medium">
                                    {completedSubtasks}/{totalSubtasks}
                                </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${progressPercent}%`,
                                        background: progressPercent === 100
                                            ? "#10B981"
                                            : "linear-gradient(90deg, #7C5CFC, #22D3EE)",
                                    }}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        )
    }

    // ─── List view row ─────────────────────────────────────────────────────
    return (
        <div className={`bg-card border border-border rounded-xl px-4 py-3
                         hover:border-violet-500/40 transition-all duration-200
                         group flex items-center gap-4
                         ${todo.completed ? "opacity-60" : ""}`}>

            {/* Checkbox */}
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

            {/* Title + description */}
            <div className="flex-1 min-w-0">
                <Link
                    to={`/todos/${todo.$id}`}
                    className={`text-sm font-medium block truncate hover:text-violet-400
                                transition-colors
                                ${todo.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                >
                    {todo.title}
                </Link>
                {todo.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {todo.description}
                    </p>
                )}
            </div>

            {/* Subtask progress — compact for list view */}
            {totalSubtasks > 0 && (
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progressPercent}%`,
                                background: "linear-gradient(90deg, #7C5CFC, #22D3EE)",
                            }}
                        />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                        {completedSubtasks}/{totalSubtasks}
                    </span>
                </div>
            )}

            {/* Priority + date */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                 ${recentTaskTagColor(todo.priority)}`}>
                    {capitalize(todo.priority)}
                </span>
                {todo.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        {formatDate(todo.dueDate)}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100
                            transition-opacity flex-shrink-0">
                <button
                    onClick={() => openModal(todo)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground
                               hover:text-foreground transition-colors"
                >
                    <Pencil size={13} />
                </button>
                <button
                    onClick={() => deleteTodo.mutate(todo.$id)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground
                               hover:text-red-500 transition-colors"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    )
}
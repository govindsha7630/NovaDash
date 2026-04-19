import { useState } from "react"
import { useTodos } from "@/hooks/useTodos"
import { useTaskModalStore } from "@/store/taskModalStore"
import { Button } from "@/components/ui/button"
import { TodoCard } from "@/components/todos/TodoCard"
import { LayoutGrid, LayoutList, Plus } from "lucide-react"
import { useSearchParams } from "react-router-dom"

type FilterType = "all" | "active" | "completed" | "high" | "due-today"
type ViewType = "grid" | "list"

const FILTERS: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "High Priority", value: "high" },
    { label: "Due Today", value: "due-today" },
]

export default function TodosPage() {
    const { data: todos, isLoading } = useTodos()
    const openModal = useTaskModalStore((state) => state.openModal)
    const [searchParams] = useSearchParams()

    const [view, setView] = useState<ViewType>("grid")
    const [activeFilter, setActiveFilter] = useState<FilterType>("all")

    // ── Filter logic ────────────────────────────────────────────────────────
    const today = new Date().toISOString().split("T")[0]
// console.log('first',today)
    const filteredTodos = todos?.filter((todo) => {
        // URL query params from sidebar filters
        const priorityParam = searchParams.get("priority")
        const filterParam = searchParams.get("filter")

        if (priorityParam) return todo.priority === priorityParam
        if (filterParam === "date") return todo.dueDate === today

        // Tab filters
        switch (activeFilter) {
            case "active":      return !todo.completed
            case "completed":   return todo.completed
            case "high":        return todo.priority === "high"
            case "due-today":   return todo.dueDate === today
            default:            return true
        }
    }) ?? []

    const totalCount = todos?.length ?? 0
    const completedCount = todos?.filter((t) => t.completed).length ?? 0

    return (
        <div className="space-y-6">

            {/* Page header */}
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Todos</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {completedCount} of {totalCount} tasks completed
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Grid / List toggle */}
                    <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setView("grid")}
                            className={`p-1.5 rounded-md transition-all duration-150
                                        ${view === "grid"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                            aria-label="Grid view"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`p-1.5 rounded-md transition-all duration-150
                                        ${view === "list"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                            aria-label="List view"
                        >
                            <LayoutList size={16} />
                        </button>
                    </div>

                    {/* Add task button */}
                    <Button
                        onClick={() => openModal()}
                        className="bg-gradient-to-r from-violet-600 to-cyan-500
                                   hover:from-violet-500 hover:to-cyan-400
                                   text-white border-0 gap-2"
                    >
                        <Plus size={16} />
                        Add Task
                    </Button>
                </div>
            </section>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium
                                    transition-all duration-150 border
                                    ${activeFilter === filter.value
                                        ? "bg-violet-600/20 border-violet-500 text-violet-400"
                                        : "bg-muted border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className={`grid gap-4 ${view === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}>
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-card border border-border rounded-xl p-4
                                       h-40 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && filteredTodos.length === 0 && (
                <div className="flex flex-col items-center justify-center
                                py-20 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center
                                    justify-center mb-4">
                        <LayoutGrid size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                        No tasks found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {activeFilter === "all"
                            ? "Create your first task to get started"
                            : "No tasks match this filter"
                        }
                    </p>
                    <Button
                        onClick={() => openModal()}
                        className="bg-gradient-to-r from-violet-600 to-cyan-500
                                   text-white border-0"
                    >
                        <Plus size={16} className="mr-2" />
                        Create Task
                    </Button>
                </div>
            )}

            {/* Todo cards */}
            {!isLoading && filteredTodos.length > 0 && (
                <div className={`gap-4 transition-all duration-200 ${
                    view === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "flex flex-col"
                }`}>
                    {filteredTodos.map((todo) => (
                        <TodoCard key={todo.$id} todo={todo} view={view} />
                    ))}
                </div>
            )}

            {/* Floating action button — mobile */}
            <button
                onClick={() => openModal()}
                className="fixed bottom-6 right-6 w-12 h-12 lg:hidden
                           bg-gradient-to-r from-violet-600 to-cyan-500
                           rounded-full flex items-center justify-center
                           shadow-lg hover:scale-110 transition-transform z-50"
            >
                <Plus size={22} className="text-white" />
            </button>

        </div>
    )
}
import { useSearchParams, useNavigate } from "react-router-dom"
import { useTodos } from "@/hooks/useTodos"
import { useTaskModalStore } from "@/store/taskModalStore"
import { Button } from "@/components/ui/button"
import { TodoCard } from "@/components/todos/TodoCard"
import { LayoutGrid, LayoutList, Plus, ClipboardList } from "lucide-react"
import { useState, useMemo, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

// ─────────────────────────────────────────────────────────────────────────────
// FILTER CONFIG
// Each filter maps to a URL key/value pair
// key: null means "All" — no filter params in URL
// ─────────────────────────────────────────────────────────────────────────────
const FILTERS = [
    { label: "All",              key: null,       value: null },
    { label: "Active",           key: "status",   value: "active" },
    { label: "Completed",        key: "status",   value: "completed" },
    { label: "High Priority",    key: "priority", value: "high" },
    { label: "Medium Priority",  key: "priority", value: "medium" },
    { label: "Low Priority",     key: "priority", value: "low" },
    { label: "Due Today",        key: "filter",   value: "date" },
]

// ─────────────────────────────────────────────────────────────────────────────
// DATE HELPER
// Converts any date string to YYYY-MM-DD format
// "en-CA" locale naturally outputs YYYY-MM-DD — no manual formatting needed
// ─────────────────────────────────────────────────────────────────────────────
const normalizeDate = (date: string) =>
    new Date(date).toLocaleDateString("en-CA")

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function TodosPage() {
    const { data: todos, isLoading } = useTodos()
    const openModal = useTaskModalStore((state) => state.openModal)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    // ── View toggle — local UI state only, not a filter ───────────────────
    // This stays in useState because it doesn't affect data — only layout
    // No reason to put this in the URL
    const [view, setView] = useState<"grid" | "list">("grid")

    // ── FIX 3: useTransition ──────────────────────────────────────────────
    // useTransition is a React 18 hook
    // It tells React: "this state update is low priority"
    // React finishes rendering the current UI first, THEN applies the change
    // isPending = true while React is processing the transition
    // This gives us a free loading indicator with zero extra state
    const [isPending, startTransition] = useTransition()

    // ── Read filter values from URL — single source of truth ─────────────
    // Every filter read happens here — nowhere else in the component
    const statusParam   = searchParams.get("status")       // "active" | "completed" | null
    const filterParam   = searchParams.get("filter")       // "date" | null
    const priorityParams = searchParams.getAll("priority") // ["high"] | ["high","medium"] | []

    // Today in YYYY-MM-DD — used for due date comparison
    const today = new Date().toLocaleDateString("en-CA")

    // ── FIX 1: clearFilters ───────────────────────────────────────────────
    // Old approach: params.delete(key) for each filter key
    // Problem: if URL has ?priority=high&search=design, clearing filters
    // leaves ?search=design which can conflict later
    //
    // New approach: navigate directly to clean /todos
    // This is the nuclear option — wipes the entire URL to a clean state
    // Much safer and simpler than manually tracking which keys to delete
    const clearFilters = () => {
        startTransition(() => {
            navigate("/todos", { replace: true })
        })
    }

    // ── URL update helper ─────────────────────────────────────────────────
    // Centralized function for all URL mutations
    // Takes a callback that receives URLSearchParams and modifies it
    // Prevents navigation if nothing actually changed
    const updateQuery = (updater: (params: URLSearchParams) => void) => {
        const params = new URLSearchParams(searchParams)
        updater(params)
        const query = params.toString()

        // Skip navigation if URL would be identical — prevents useless rerenders
        if (query === searchParams.toString()) return

        startTransition(() => {
            navigate(`/todos${query ? `?${query}` : ""}`, { replace: true })
        })
    }

    // ── Core filter update function ───────────────────────────────────────
    // Handles two behaviors:
    // Single-select (status, filter): clicking active filter deselects it
    // Multi-select (priority): multiple priorities can be active at once
    const updateFilter = (key: string | null, value: string | null) => {
        if (!key) {
            clearFilters()
            return
        }

        updateQuery((params) => {
            if (key === "status" || key === "filter") {
                // Toggle behavior — clicking same filter turns it off
                if (params.get(key) === value) {
                    params.delete(key)
                } else {
                    params.set(key, value!)
                }
            } else if (key === "priority") {
                // Multi-select — build a Set to avoid duplicates
                const values = new Set(params.getAll(key))

                if (values.has(value!)) {
                    values.delete(value!)
                } else {
                    values.add(value!)
                }

                // Must delete first then re-append — URLSearchParams
                // doesn't have a "replace all" method for multi-value keys
                params.delete(key)
                values.forEach((v) => params.append(key, v))
            }

            // Reset pagination when filters change — future-proofing
            params.delete("page")
        })
    }

    // ── FIX 2: Debounced filter handler ───────────────────────────────────
    // Problem: without debounce, rapid clicking "High" → "Medium" → "Low"
    // fires 3 navigate() calls in rapid succession
    // Browser history gets spammed, React rerenders multiple times
    //
    // useDebouncedCallback waits 300ms after the LAST click before firing
    // If user clicks 3 times in 200ms, only the last click's filter applies
    // 300ms is the sweet spot — fast enough to feel instant, slow enough to batch
    const debouncedUpdateFilter = useDebouncedCallback(
        (key: string | null, value: string | null) => {
            updateFilter(key, value)
        },
        300
    )

    // ── Filter logic — runs on every render, derived from URL ─────────────
    // useMemo prevents recomputing when unrelated state changes (like view toggle)
    // Only recomputes when todos data or URL params change
    const filteredTodos = useMemo(() => {
        return (todos ?? []).filter((todo) => {
            // Priority filter — multi-select
            // If any priorities selected, todo must match at least one
            if (priorityParams.length > 0 && !priorityParams.includes(todo.priority)) {
                return false
            }

            // Status filter — single select
            if (statusParam === "completed" && !todo.completed) return false
            if (statusParam === "active" && todo.completed) return false

            // Date filter — due today
            if (filterParam === "date") {
                if (!todo.dueDate) return false
                // normalizeDate handles timezone-safe comparison
                if (normalizeDate(todo.dueDate) !== today) return false
            }

            return true
        })
    }, [todos, priorityParams, statusParam, filterParam, today])

    // ── Active tab detection — derived from URL ───────────────────────────
    // This is why sidebar and page tabs stay in sync automatically
    // Both read from the same URL — no separate state needed
    const isTabActive = (key: string | null, value: string | null) => {
        // "All" tab is active when zero filter params exist in URL
        if (!key) {
            return (
                !searchParams.get("status") &&
                !searchParams.get("filter") &&
                priorityParams.length === 0
            )
        }
        // Priority is multi-select — check if this value is in the array
        if (key === "priority") return priorityParams.includes(value!)
        // All others — simple equality check
        return searchParams.get(key) === value
    }

    // ── Stats ─────────────────────────────────────────────────────────────
    const totalCount     = todos?.length ?? 0
    const completedCount = todos?.filter((t) => t.completed).length ?? 0

    // ── Is any filter currently active ────────────────────────────────────
    // Used to show "Clear filters" link in empty state
    const hasActiveFilter =
        !!statusParam || priorityParams.length > 0 || !!filterParam

    // ─────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────
    return (
        // FIX 5 PART 1: pb-24 on mobile prevents FAB from overlapping last card
        // lg:pb-0 removes the padding on desktop where there is no FAB
        <div className="space-y-6 pb-24 lg:pb-0">

            {/* Page header */}
            <section className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        My Todos
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {completedCount} of {totalCount} tasks completed
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Grid / List toggle */}
                    <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setView("grid")}
                            className={`p-1.5 rounded-md transition-all
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
                            className={`p-1.5 rounded-md transition-all
                                        ${view === "list"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                            aria-label="List view"
                        >
                            <LayoutList size={16} />
                        </button>
                    </div>

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

            {/* FIX 3: Filter tabs with loading indicator ───────────────────
                isPending comes from useTransition
                While React processes the navigation, isPending = true
                We show a thin gradient bar above the tabs — subtle but clear
                Buttons get opacity-60 and disabled to prevent double-clicks
                Count text switches to "Filtering..." so user knows something is happening
            */}
            <div className="relative">

                {/* Thin loading bar — only visible during transition */}
                {isPending && (
                    <div
                        className="absolute -top-2 left-0 right-0 h-0.5
                                   bg-gradient-to-r from-violet-500 to-cyan-500
                                   rounded-full animate-pulse"
                    />
                )}

                <div className="flex items-center gap-2 flex-wrap">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.label}
                            // FIX 2: debouncedUpdateFilter instead of updateFilter directly
                            // 300ms delay batches rapid clicks into one navigation
                            onClick={() => debouncedUpdateFilter(filter.key, filter.value)}

                            // FIX 3: disabled during transition prevents double-fire
                            disabled={isPending}

                            className={`
                                px-4 py-1.5 rounded-full text-sm font-medium
                                transition-all duration-150 border
                                ${isPending ? "opacity-60 cursor-not-allowed" : "opacity-100"}
                                ${isTabActive(filter.key, filter.value)
                                    ? "bg-violet-600/20 border-violet-500 text-violet-400"
                                    : "bg-muted border-transparent text-muted-foreground hover:text-foreground"
                                }
                            `}
                        >
                            {filter.label}
                        </button>
                    ))}

                    {/* Count — switches to "Filtering..." during transition */}
                    <span className="ml-auto text-xs text-muted-foreground">
                        {isPending
                            ? "Filtering..."
                            : `${filteredTodos.length} task${filteredTodos.length !== 1 ? "s" : ""}`
                        }
                    </span>
                </div>
            </div>

            {/* Loading skeletons — shown during initial data fetch */}
            {isLoading && (
                <div className={`grid gap-4 ${
                    view === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                }`}>
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-card border border-border rounded-xl
                                       p-4 h-40 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* FIX 4: Empty state ──────────────────────────────────────────
                ClipboardList icon = semantically correct (tasks/checklist)
                LayoutGrid was wrong — it's a layout icon, not a task icon

                Two different messages:
                - totalCount === 0: user has NO todos at all → encourage creation
                - hasActiveFilter: user has todos but none match → help them reset

                Added "Clear filters" link when a filter is active
                This is better UX — user doesn't have to manually click "All" tab
            */}
            {!isLoading && filteredTodos.length === 0 && (
                <div className="flex flex-col items-center justify-center
                                py-20 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex
                                    items-center justify-center mb-4">
                        {/* ✅ ClipboardList — semantically means "tasks list" */}
                        <ClipboardList size={24} className="text-muted-foreground" />
                    </div>

                    <h3 className="text-base font-semibold text-foreground mb-1">
                        {totalCount === 0
                            ? "No tasks yet"
                            : "No tasks match this filter"
                        }
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3">
                        {totalCount === 0
                            ? "Create your first task to get started"
                            : "Try a different filter or clear all filters"
                        }
                    </p>

                    {/* Clear filters — only shows when a filter is active */}
                    {hasActiveFilter && (
                        <button
                            onClick={() => navigate("/todos", { replace: true })}
                            className="text-xs text-violet-400 hover:text-violet-300
                                       mb-4 underline underline-offset-2
                                       transition-colors"
                        >
                            Clear all filters
                        </button>
                    )}

                    <Button
                        onClick={() => openModal()}
                        className="bg-gradient-to-r from-violet-600
                                   to-cyan-500 text-white border-0"
                    >
                        <Plus size={16} className="mr-2" />
                        Create Task
                    </Button>
                </div>
            )}

            {/* Todo cards grid/list */}
            {!isLoading && filteredTodos.length > 0 && (
                <div className={`gap-4 ${
                    view === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "flex flex-col"
                }`}>
                    {filteredTodos.map((todo) => (
                        <TodoCard key={todo.$id} todo={todo} view={view} />
                    ))}
                </div>
            )}

            {/* FIX 5 PART 2: Mobile FAB ────────────────────────────────────
                Old: circle icon only → users don't know what it does
                New: pill shape with text → clear affordance
                Old: w-12 h-12 circle → small tap target
                New: px-4 py-3 pill → larger, easier to tap

                active:scale-95 adds tactile press feedback
                hover:scale-105 is subtle — not the old hover:scale-110 which was too dramatic

                pb-24 on the parent div ensures the LAST card is never
                hidden behind this button on small screens
            */}
            <button
                onClick={() => openModal()}
                className="fixed bottom-6 right-6 lg:hidden
                           bg-gradient-to-r from-violet-600 to-cyan-500
                           rounded-full flex items-center justify-center gap-2
                           shadow-lg shadow-violet-500/25
                           hover:scale-105 active:scale-95
                           transition-transform duration-150 z-50
                           px-5 py-3"
                aria-label="Create new task"
            >
                <Plus size={18} className="text-white flex-shrink-0" />
                <span className="text-white text-sm font-semibold">
                    New Task
                </span>
            </button>

        </div>
    )
}
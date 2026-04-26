import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, ListChecks, Plus, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import { useTaskModalStore } from "@/store/taskModalStore";
import { useCreateTodo, useUpdateTodo } from "@/hooks/useTodos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// ─── Schema ────────────────────────────────────────────────────────────────


// ✅ Remove ALL .default() from schema — put defaults in useForm instead
const subtaskSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean(), // ← required, no default
});

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["high", "medium", "low"]),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
  subtasks: z.array(subtaskSchema), // ← required array, no default
});

type TaskFormData = z.infer<typeof taskSchema>;

// ─── Priority config ────────────────────────────────────────────────────────
const PRIORITIES = [
  {
    value: "high" as const,
    label: "High",
    active: "bg-red-500/20 border-red-500 text-red-400",
    hover: "hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400",
  },
  {
    value: "medium" as const,
    label: "Medium",
    active: "bg-cyan-600/20 border-cyan-500 text-cyan-400",
    hover: "hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400",
  },
  {
    value: "low" as const,
    label: "Low",
    active: "bg-green-600/20 border-green-500 text-green-400",
    hover:
      "hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-400",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────
export function CreateTaskModal() {
  const { isOpen, editData, closeModal } = useTaskModalStore();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo()
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium", // ✅ default here
      dueDate: "",
      tags: "",
      subtasks: [], // ✅ default here
    },
  });
  // ── useFieldArray for dynamic subtasks ──────────────────────────────────
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "subtasks",
  });

  const selectedPriority = watch("priority");

  // ── Reset on open ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {

        // ✅ Parse subtasks from JSON string back to array
        const parsedSubtasks = (() => {
            try {
                return editData?.subtasks
                    ? JSON.parse(editData.subtasks)
                    : []
            } catch {
                return []
            }
        })()

        reset({
            title: editData?.title ?? "",
            description: editData?.description ?? "",
            priority: editData?.priority ?? "medium",
            dueDate: editData?.dueDate ?? "",
            tags: editData?.tags?.join(", ") ?? "",
            subtasks: parsedSubtasks,   // ✅ now populated from editData
        })
    }
}, [isOpen, editData, reset])

  // ── Escape key ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeModal]);

  // ── Click outside ───────────────────────────────────────────────────────
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) closeModal();
  };

  // ── Add subtask on Enter ────────────────────────────────────────────────
  const handleSubtaskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      if (value) {
        append({ title: value, completed: false });
        input.value = "";
      }
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────
 const onSubmit = async (data: TaskFormData) => {
    // const tags = data.tags
    //     ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    //     : []
const tags = data.tags
  ? [...new Set(
      data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    )]
  : [];
  
    const subtasksJson = data.subtasks.length > 0
        ? JSON.stringify(data.subtasks)
        : undefined

    const payload = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
        tags,
        subtasks: subtasksJson,
    }

    // ✅ Edit mode — update existing todo
    if (editData) {
        updateTodo.mutate(
            { id: editData.$id!, data: payload },
            {
                onSuccess: () => {
                    closeModal()
                    reset()
                },
                onError: (err) => {
                    toast.error(err.message)
                },
            }
        )
        return
    }

    // ✅ Create mode — create new todo
    createTodo.mutate(payload, {
        onSuccess: () => {
            closeModal()
            reset()
        },
        onError: (err) => {
            toast.error(err.message)
        },
    })
}

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center
                               justify-center bg-black/50 backdrop-blur-sm px-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-[500px] bg-card border border-border
                                   rounded-2xl shadow-2xl overflow-hidden
                                   max-h-[90vh] flex flex-col"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col overflow-hidden"
            >
              {/* Scrollable body */}
              <div className="px-6 py-5 overflow-y-auto flex-1">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2
                    id="modal-title"
                    className="text-base font-semibold text-foreground"
                  >
                    {editData ? "Edit Task" : "New Task"}
                  </h2>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-muted-foreground hover:text-foreground
                                                   transition-colors p-1 rounded-lg hover:bg-muted"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="h-px bg-border mb-4" />

                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-medium text-muted-foreground
                                                          uppercase tracking-wider"
                    >
                      Task Title
                    </label>
                    <Input
                      placeholder="e.g., Design System Update"
                      className="bg-background border-border focus:border-violet-500"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-medium text-muted-foreground
                                                          uppercase tracking-wider"
                    >
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add some context to this task..."
                      className="w-full px-3 py-2 text-sm rounded-lg
                                                       bg-background border border-border
                                                       text-foreground placeholder:text-muted-foreground
                                                       focus:outline-none focus:border-violet-500
                                                       focus:ring-2 focus:ring-violet-500/20
                                                       resize-none transition-colors"
                      {...register("description")}
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-medium text-muted-foreground
                                                          uppercase tracking-wider"
                    >
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setValue("priority", p.value)}
                          className={`py-2 text-sm font-medium rounded-lg border
                                                                transition-all duration-150
                                                                ${
                                                                  selectedPriority ===
                                                                  p.value
                                                                    ? p.active
                                                                    : `bg-background border-border
                                                                       text-muted-foreground ${p.hover}`
                                                                }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due Date + Tags */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label
                        className="text-xs font-medium text-muted-foreground
                                                              uppercase tracking-wider"
                      >
                        Due Date
                      </label>
                      <Input
                        type="date"
                        className="bg-background border-border
                                                           focus:border-violet-500 text-muted-foreground"
                        {...register("dueDate")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        className="text-xs font-medium text-muted-foreground
                                                              uppercase tracking-wider"
                      >
                        Tags
                      </label>
                      <Input
                        placeholder="design, ui/ux"
                        className="bg-background border-border
                                                           focus:border-violet-500"
                        {...register("tags")}
                      />
                    </div>
                  </div>

                  {/* Subtasks */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mb-2">
                      <ListChecks size={14} className="text-muted-foreground" />
                      <label
                        className="text-xs font-medium text-muted-foreground
                                                              uppercase tracking-wider"
                      >
                        Subtasks ({fields.length})
                      </label>
                    </div>

                    {/* Existing subtasks */}
                    {fields.length > 0 && (
                      <div className="space-y-1.5 mb-2">
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-2 px-3 py-2
                                                                   bg-background rounded-lg border border-border
                                                                   group"
                          >
                            <Checkbox
                              checked={field.completed}
                              onCheckedChange={(checked) =>
                                update(index, {
                                  ...field,
                                  completed: !!checked,
                                })
                              }
                              className="flex-shrink-0"
                            />
                            <span
                              className={`flex-1 text-sm ${
                                field.completed
                                  ? "line-through text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {field.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="opacity-0 group-hover:opacity-100
                                                                       text-muted-foreground hover:text-red-500
                                                                       transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new subtask input */}
                    <div
                      className="flex items-center gap-2 px-3 py-2
                                                        bg-background rounded-lg border border-border
                                                        border-dashed focus-within:border-violet-500
                                                        transition-colors"
                    >
                      <Plus
                        size={13}
                        className="text-muted-foreground flex-shrink-0"
                      />
                      <input
                        type="text"
                        placeholder="Add a subtask, press Enter..."
                        onKeyDown={handleSubtaskKeyDown}
                        className="flex-1 text-sm bg-transparent text-foreground
                                                           placeholder:text-muted-foreground/50
                                                           outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer — outside scroll area */}
              <div
                className="flex items-center justify-end gap-3
                                            px-6 py-4 border-t border-border bg-muted/30
                                            flex-shrink-0"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  // disabled={isSubmitting || createTodo.isPending}
                  disabled={isSubmitting || createTodo.isPending || updateTodo.isPending}
                  className="bg-gradient-to-r from-violet-600 to-cyan-500
                                               hover:from-violet-500 hover:to-cyan-400
                                               text-white border-0 min-w-[110px]"
                >
                  {createTodo.isPending || updateTodo.isPending
    ? editData ? "Saving..." : "Creating..."
    : editData ? "Save Changes" : "Create Task"
}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

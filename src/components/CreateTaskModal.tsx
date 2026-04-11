import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, ListChecks } from "lucide-react";
import { createPortal } from "react-dom";
import { useTaskModalStore } from "@/store/taskModalStore";
import { useCreateTodo } from "@/hooks/useTodos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ─── Zod schema ────────────────────────────────────────────────────────────
const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  priority: z.enum(["high", "medium", "low"]),
  dueDate: z.string().optional(),
  tags: z.string().optional(), // comma-separated string → split to array on submit
});

type TaskFormData = z.infer<typeof taskSchema>;

// ─── Component ─────────────────────────────────────────────────────────────
export function CreateTaskModal() {
  const { isOpen, editData, closeModal } = useTaskModalStore();
  const createTodo = useCreateTodo();
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    // ✅ explicit type
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: editData?.title ?? "",
      description: editData?.description ?? "",
      priority: editData?.priority ?? "medium", // ✅ default lives here
      dueDate: editData?.dueDate ?? "",
      tags: editData?.tags?.join(", ") ?? "",
    },
  });

  const selectedPriority = watch("priority");

  // ── Reset form when modal opens ─────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      reset({
        title: editData?.title ?? "",
        description: editData?.description ?? "",
        priority: editData?.priority ?? "medium",
        dueDate: editData?.dueDate ?? "",
        tags: editData?.tags?.join(", ") ?? "",
      });
    }
  }, [isOpen, editData, reset]);

  // ── Escape key closes modal ─────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  // ── Click outside overlay closes modal ──────────────────────────────────
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) closeModal();
  };

  // ── Form submit ─────────────────────────────────────────────────────────
  const onSubmit = async (data: TaskFormData) => {
    const tags = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    createTodo.mutate(
      {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
        tags,
      },
      {
        onSuccess: () => {
          closeModal();
          reset();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  // ── Portal — renders outside AppShell DOM tree ───────────────────────────
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        // Full-screen overlay
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center
                               justify-center bg-black/50 backdrop-blur-sm
                               px-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-[480px] bg-card border
                                   border-border rounded-2xl shadow-2xl
                                   overflow-hidden"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 py-5">
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
                                                   transition-colors p-1 rounded-lg
                                                   hover:bg-muted"
                    aria-label="Close modal"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="h-px bg-border mb-4" />

                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-medium
                                                          text-muted-foreground uppercase
                                                          tracking-wider"
                    >
                      Task Title
                    </label>
                    <Input
                      placeholder="e.g., Design System Update"
                      className="bg-background border-border
                                                       focus:border-violet-500"
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
                      className="text-xs font-medium
                                                          text-muted-foreground uppercase
                                                          tracking-wider"
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
                    {errors.description && (
                      <p className="text-xs text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-medium
                                                          text-muted-foreground uppercase
                                                          tracking-wider"
                    >
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          {
                            value: "high",
                            label: "High",
                            active:
                              "bg-violet-600/20 border-violet-500 text-violet-400 ",
                            inactive:
                              "bg-background border-border text-muted-foreground",
                              onhover:
                              "hover:bg-violet-600/20 hover:border-violet-500 hover:text-violet-400 ",
                          },
                          {
                            value: "medium",
                            label: "Medium",
                            active:
                              "bg-cyan-600/20 border-cyan-500 text-cyan-400",
                            inactive:
                              "bg-background border-border text-muted-foreground",
                              onhover:"hover:bg-cyan-600/20 hover:border-cyan-500  hover:text-cyan-400 "
                          },
                          {
                            value: "low",
                            label: "Low",
                            active:
                              "bg-amber-600/20 border-amber-500 text-amber-400",
                            inactive:
                              "bg-background border-border text-muted-foreground",
                            onhover:" hover:bg-amber-600/20 hover:border-amber-500 hover:text-amber-400"
                          },
                        ] as const
                      ).map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setValue("priority", p.value)}
                          className={`py-2 text-sm font-medium rounded-lg
                                                                border transition-all duration-150
                                                                ${
                                                                  selectedPriority ===
                                                                  p.value
                                                                    ? p.active
                                                                    : p.inactive
                                                                } ${p.onhover}`}
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
                        className="text-xs font-medium
                                                              text-muted-foreground uppercase
                                                              tracking-wider"
                      >
                        Due Date
                      </label>
                      <Input
                        type="date"
                        className="bg-background border-border
                                                           focus:border-violet-500
                                                           text-muted-foreground"
                        {...register("dueDate")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        className="text-xs font-medium
                                                              text-muted-foreground uppercase
                                                              tracking-wider"
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

                  {/* Subtasks — static UI for now */}
                  <div className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="flex items-center gap-2
                                                            text-sm text-muted-foreground"
                      >
                        <ListChecks size={15} />
                        <span>Subtasks</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Add a subtask and press Enter..."
                      className="w-full text-xs bg-transparent
                                                       text-muted-foreground placeholder:text-muted-foreground/50
                                                       outline-none border-b border-border
                                                       pb-1 focus:border-violet-500
                                                       transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-end gap-3
                                            px-6 py-4 border-t border-border
                                            bg-muted/30"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || createTodo.isPending}
                  className="bg-gradient-to-r from-violet-600 to-cyan-500
                                               hover:from-violet-500 hover:to-cyan-400
                                               text-white border-0 min-w-[110px]"
                >
                  {createTodo.isPending
                    ? "Creating..."
                    : editData
                      ? "Save Changes"
                      : "Create Task"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body, // ← Portal renders directly into <body>, bypasses AppShell
  );
}

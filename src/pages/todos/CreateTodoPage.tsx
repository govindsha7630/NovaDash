import { Button } from "@/components/ui/button";
import { useTaskModalStore } from "@/store/taskModalStore";
import { Plus } from "lucide-react";

function CreateTodoPage() {
  const openModal = useTaskModalStore((state) => state.openModal);

  return (
    <div>
      <Button onClick={() => openModal()}>
        <Plus size={22} /> Create Todo/Task
      </Button>
    </div>
  );
}

export default CreateTodoPage;

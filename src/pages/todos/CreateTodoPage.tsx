import { CreateTaskModal } from "@/components/CreateTaskModal"
import { Button } from "@/components/ui/button"
import { useTaskModalStore } from "@/store/taskModalStore"
import { Plus } from "lucide-react"
function CreateTodoPage() {
  
         const openModal = useTaskModalStore((state) => state.openModal)

    return (
        <div>
            {/* page content */}
<CreateTaskModal/>
            {/* Floating action button */}
            <Button
                onClick={() => openModal()}
                // className="fixed bottom-6 right-6 w-12 h-12
                //            bg-gradient-to-r from-violet-600 to-cyan-500
                //            rounded-full flex items-center justify-center
                //            shadow-lg hover:scale-110 transition-transform
                //            z-50 text-white"
            >
                <Plus size={22} /> Create Todo/Task
            </Button>
        </div>
    )

}

export default CreateTodoPage

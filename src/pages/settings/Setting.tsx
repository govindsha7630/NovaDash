import { useArticles } from "@/hooks/useArticle";
import { useTodos } from "@/hooks/useTodos";
function Setting() {

  const { isPending, isLoading, data: todos } = useTodos();
  const { data: articles } = useArticles();
  // console.log(todos)
  // console.log(articles)

  const publishedArtiCount = articles?.filter(
    (t) => t.status === "published",
  ).length;
  const overdueTodosCount = todos?.filter(
    (t) => t.dueDate && !t.completed && new Date(t.dueDate) < new Date(),
  ).length;

  const highPriorityCount = todos?.filter((t) => t.completed === true).length;
  const completedCount = todos?.filter((t) => t.completed === true).length;
  const total = todos?.length;
  // const rate = total === 0 ? 0 : ((completedCount / total) * 100).toFixed(1);

  return (
    <div>
      Setting Page Here
    </div>
  )
}

export default Setting

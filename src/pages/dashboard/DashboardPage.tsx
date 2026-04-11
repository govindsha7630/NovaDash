// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   CheckCircle,
//   ClipboardClock,
//   ListTodo,
//   Text,
//   TrendingUp,
// } from "lucide-react";
// import StatCard from "./StatCard";

// function DashboardPage() {
//   return (
//     <main className="">
//       <section className="flex items-center  justify-between ">
//         <div>
//           <div className="text-xl font-bold">
//             Good Morning ,<span> Alex👋</span>
//           </div>
//           <div className="text-xs">Monday, October 30</div>
//         </div>
//         <div className="flex gap-2 hidden">
//           <Button variant="outline">Download Report</Button>
//           <Button variant="default">Create New Task</Button>
//         </div>
//       </section>
//       <section className=" gap-8 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
{
  /* <StatCard
  icon={
    <ListTodo
      color="#8764FF"
      size="52px"
      className="dark:bg-[#181934] bg-amber-100  rounded-sm p-2"
    />
  }
  title="Total"
  count={totalTodos}
  isLoading={isLoading} */
}
// />;

//         <FeatureCard
//           count={38}
//           icon={<TrendingUp size={16} />}
//           title="Completed"
//           chart={null}
//           itemLogo={
// <ListTodo
//   color="#8764FF"
//   size="52px"
//   className="dark:bg-[#181934] bg-amber-100  rounded-sm p-2"
// />
//           }
//         />
//         <FeatureCard
//           count={38}
//           icon={<TrendingUp size={16} />}
//           title="Completed"
//           chart={null}
//           itemLogo={
//             <CheckCircle
//               color="#35D89D"
//               size="52px"
//               className="dark:bg-[#10262A] bg-amber-100  rounded-sm p-2"
//             />
//           }
//         />
//         <FeatureCard
//           count={38}
//           icon={<TrendingUp size={16} />}
//           title="Pending Tasks"
//           chart={null}
//           itemLogo={
//             <ClipboardClock
//               color="#FBBF24"
//               size="52px"
//               className="dark:bg-[#25231E] bg-amber-100  rounded-sm p-2"
//             />
//           }
//         />
//         <FeatureCard
//           count={38}
//           icon={<TrendingUp size={16} />}
//           title="Total Articles"
//           chart={null}
//           itemLogo={
//             <Text
//               color="#22D3EE"
//               size="52px"
//               className="dark:bg-[#0E2632]   rounded-sm p-2"
//             />
//           }
//         />
//       </section>
//       <StatCard count={3} title="hhh" icon={<ListTodo/>} isLoading={false} key={1} trend={55} />
//     </main>
//   );
// }

// function FeatureCard({
//   count,
//   icon,
//   title,
//   chart,
//   itemLogo,
// }: {
//   count: number;
//   icon: React.ReactNode;
//   title: string;
//   chart: React.ReactNode;
//   itemLogo: React.ReactNode;
// }) {
//   return (
//     <Card className="lg:flex-1 px-4 hover:-translate-y-1 hover:scale-[0.98] transition-all">
//       <div className="flex items-start justify-between">
//         {itemLogo}

//         <div className="flex gap-1 text-xs justify-center items-center">
//           {icon}
//           +24%
//         </div>
//       </div>
//       <p className="text-lg font-medium text-muted-foreground ">{title}</p>
//       <p className="text-2xl font-bold">{count}</p>
//       <div className="h-12 border-2 ">{chart}</div>
//     </Card>
//   );
// }
// export default DashboardPage;

//-------------------------------------------------------------

import { useTodos } from "@/hooks/useTodos";
import StatCard from "@/pages/dashboard/StatCard";
import { ListTodo } from "lucide-react";

export default function DashboardPage() {
  const { data: todos, isLoading } = useTodos();

  // Derive what you need
  const totalTodos = todos?.length ?? 0;
  const completedTodos = todos?.filter((t) => t.completed).length ?? 0;
  const pendingTodos = todos?.filter((t) => !t.completed).length ?? 0;
  const recentTodos = todos?.slice(0, 4) ?? [];

  // Pass to components as props
  return (
    <div>
    
      <StatCard
        icon={
          <ListTodo
            color="#8764FF"
            size="52px"
            className="dark:bg-[#181934] bg-amber-100  rounded-sm p-2"
          />
        }
        title="Total"
        count={totalTodos}
        isLoading={isLoading}
      />
      
      {/* <StatCard title="Pending" count={pendingTodos} isLoading={isLoading} /> */}
    </div>
  );
}

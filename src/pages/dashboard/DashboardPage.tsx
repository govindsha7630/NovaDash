import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  ClipboardClock,
  FileText,
  List,
  ListTodo,
  Table,
  Text,
  TrendingUp,
  Watch,
  WatchIcon,
} from "lucide-react";

function DashboardPage() {
  return (
    <main className="">
      <section className="flex items-center  justify-between ">
        <div>
          <div className="text-xl font-bold">
            Good Morning ,<span> Alex👋</span>
          </div>
          <div className="text-xs">Monday, October 30</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button variant={"default"}>Create New Task</Button>
        </div>
      </section>
      <section className="flex items-center justify-between  gap-8 m-4 h-48 flex-wrap">
       
        <FeatureCard
          count={38}
          icon={<TrendingUp size={"16px"} />}
          // iconBg="dark:bg-[#181934] bg-[#2e3291]"
          // iconColor="#8160FF"
          title="Completed"
          chart="gj"
      itemLogo={
            <ListTodo
              color="#8764FF"
              size="52px"
              className="dark:bg-[#181934] bg-amber-100  rounded-sm p-2"
            />
          }
        />
        <FeatureCard
          count={38}
          icon={<TrendingUp size={"16px"} />}
          // iconBg="dark:bg-[#181934] bg-[#2e3291]"
          // iconColor="#8160FF"
          title="Completed"
          chart="gj"
      itemLogo={
            <CheckCircle
              color="#35D89D"
              size="52px"
              className="dark:bg-[#10262A] bg-amber-100  rounded-sm p-2"
            />
          }
        />
        <FeatureCard
          count={38}
          icon={<TrendingUp size={"16px"} />}
          // iconBg="dark:bg-[#181934] bg-[#2e3291]"
          // iconColor="#8160FF"
          title="Pending Tasks"
          chart="gj"
           itemLogo={
            <ClipboardClock
              color="#FBBF24"
              size="52px"
              className="dark:bg-[#25231E] bg-amber-100  rounded-sm p-2"
            />
          }
        />
        <FeatureCard
          count={38}
          icon={<TrendingUp size={"16px"} />}
          // iconBg="dark:bg-[#181934] bg-[#2e3291]"
          // iconColor="#8160FF"
          title="Total Articles"
          chart="gj"
          itemLogo={
            <Text
              color="#22D3EE"
              size="52px"
              className="dark:bg-[#0E2632] bg-amber-100  rounded-sm p-2"
            />
          }
        />
      </section>

      {/* Dashboard Page */}
    </main>
  );
}

function FeatureCard({
  count,
  icon,
  title,
  chart,
  itemLogo,
}: {
  count: number;
  icon: React.ReactNode;
  title: string;
  chart: React.ReactNode;
  itemLogo: React.ReactNode;
}) {
  return (
    <Card size="sm" className="lg:flex-1 px-4 hover:scale-96 transition-all">
      <div className="flex items-start justify-between">
        {itemLogo}

        <div className="flex gap-1 text-xs justify-center items-center">
          {icon}
          +24%
        </div>
      </div>
      <p className="text-lg font-medium text-muted-foreground ">{title}</p>
      <p className="text-2xl font-bold">{count}</p>
      <div className="h-12 border-2 ">{chart}</div>
    </Card>
  );
}
export default DashboardPage;

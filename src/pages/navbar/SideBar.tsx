import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  BarChart2,
  User,
  Settings,
  ChevronRight,
  Plus,
  ListTodo,
  CheckCheck,
  Clock,
  AlignLeft,
  Sparkles,
  Filter,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [todoOpen, setTodoOpen] = useState(
    location.pathname.startsWith("/todos"),
  );
  const [articleOpen, setArticleOpen] = useState(
    location.pathname.startsWith("/articles"),
  );

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // ✅ Click Todos parent → navigate + open submenu
  const handleTodosClick = () => {
    setTodoOpen(true);
    navigate("/todos");
  };

  // ✅ Click Articles parent → navigate + open submenu
  const handleArticlesClick = () => {
    setArticleOpen(true);
    navigate("/articles");
  };

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="border-b border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="NovaDash">
              <Link to="/dashboard" className="flex items-center gap-3">
                {/* Logo icon — always visible */}
                <div
                  className="w-8 h-8 bg-violet-600 rounded-lg
                                    flex items-center justify-center
                                    flex-shrink-0 min-w-[32px]"
                >
                  <div
                    className="w-0 h-0
                            border-l-[5px] border-l-transparent
                            border-r-[5px] border-r-transparent
                            border-b-[9px] border-b-white"
                  />
                </div>
                {/* Text — hidden by CSS when collapsed */}
                <span
                  className="font-bold text-base text-foreground
                                     whitespace-nowrap"
                >
                  NovaDash
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2 py-2">
        {/* MAIN */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard")}
                  tooltip="Dashboard"
                >
                  <Link to="/dashboard" className="flex items-center gap-3">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* TASKS */}
        <SidebarGroup>
          <SidebarGroupLabel>Tasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={todoOpen}
                onOpenChange={setTodoOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {/* ✅ Trigger row — button handles expand, click navigates */}
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith("/todos")}
                      tooltip="Todos"
                      onClick={handleTodosClick}
                    >
                      <Link to="/todos" className="flex items-center gap-2">
                        <CheckSquare size={18} />
                        <span>Todos</span>
                      </Link>
                      <ChevronRight
                        size={14}
                        className="ml-auto transition-transform duration-200
                                                           group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/todos")}
                        >
                          <Link to="/todos" className="flex items-center gap-2">
                            <ListTodo size={14} />
                            <span>All Todos</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Priority filters */}
                      <SidebarMenuSubItem>
                        <div className="px-2 pt-1.5 pb-1">
                          <div
                            className="flex items-center gap-1.5
                                                                    text-[10px] font-semibold
                                                                    text-muted-foreground
                                                                    uppercase tracking-wider mb-1.5"
                          >
                            <Filter size={10} />
                            Priority
                          </div>
                          <div className="flex flex-col gap-0.5">
                            {[
                              {
                                label: "High Priority",
                                color: "bg-red-500",
                                value: "high",
                              },
                              {
                                label: "Medium Priority",
                                color: "bg-amber-500",
                                value: "medium",
                              },
                              {
                                label: "Low Priority",
                                color: "bg-green-500",
                                value: "low",
                              },
                              {
                                label: "By Date",
                                color: "bg-blue-500",
                                value: "date",
                              },
                            ].map((filter) => (
                              <SidebarMenuSubButton key={filter.value} asChild>
                                <Link
                                  to={
                                    filter.value === "date"
                                      ? "/todos?filter=date"
                                      : `/todos?priority=${filter.value}`
                                  }
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full
                                                                                     flex-shrink-0 ${filter.color}`}
                                  />
                                  {filter.label}
                                </Link>
                              </SidebarMenuSubButton>
                            ))}
                          </div>
                        </div>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/todos/completed")}
                        >
                          <Link
                            to="/todos/completed"
                            className="flex items-center gap-2"
                          >
                            <CheckCheck size={14} />
                            <span>Completed</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/todos/pending")}
                        >
                          <Link
                            to="/todos/pending"
                            className="flex items-center gap-2"
                          >
                            <Clock size={14} />
                            <span>Pending</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/todos/create")}
                        >
                          <Link
                            to="/todos/create"
                            className="flex items-center gap-2 text-violet-400"
                          >
                            <Plus size={14} />
                            <span>Create Todo</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* CONTENT */}
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={articleOpen}
                onOpenChange={setArticleOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith("/articles")}
                      tooltip="Articles"
                      onClick={handleArticlesClick}
                    >
                      <Link to="/articles" className="flex items-center gap-2">
                        <FileText size={18} />
                        <span>Articles</span>
                      </Link>

                      <ChevronRight
                        size={14}
                        className="ml-auto transition-transform duration-200
                                                           group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/articles")}
                        >
                          <Link
                            to="/articles"
                            className="flex items-center gap-2"
                          >
                            <AlignLeft size={14} />
                            <span>All Articles</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/articles/create")}
                        >
                          <Link
                            to="/articles/create"
                            className="flex items-center gap-2 text-cyan-400"
                          >
                            <Plus size={14} />
                            <span>Create Article</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MORE */}
        <SidebarGroup>
          <SidebarGroupLabel>More</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/analytics")}
                  tooltip="Analytics"
                >
                  <Link to="/analytics" className="flex items-center gap-3">
                    <BarChart2 size={18} />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/profile")}
                  tooltip="Profile"
                >
                  <Link to="/profile" className="flex items-center gap-3">
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/settings")}
                  tooltip="Settings"
                >
                  <Link to="/settings" className="flex items-center gap-3">
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-border p-3 space-y-3">
        {/* Upgrade card */}
        <div
          className="upgrade-card rounded-xl p-3 border border-violet-500/20
                    bg-gradient-to-br from-violet-600/20 to-cyan-500/10"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-violet-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-white">
              Upgrade to Pro
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-2.5 leading-relaxed">
            Unlock unlimited todos, articles and analytics.
          </p>
          <Link
            to="/pricing"
            className="block w-full text-center text-xs font-semibold
                       text-white py-1.5 rounded-lg transition-all
                       bg-gradient-to-r from-violet-600 to-cyan-500
                       hover:from-violet-500 hover:to-cyan-400"
          >
            Upgrade Now
          </Link>
        </div>

        {/* User */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={user?.name ?? "User"}>
              {/* Avatar — always visible, never clipped */}
              <Avatar className="w-8 h-8 flex-shrink-0 min-w-[32px]">
                <AvatarFallback
                  className="bg-violet-600
                                                text-white text-xs font-bold"
                >
                  {user?.name ? getInitials(user.name) : "??"}
                </AvatarFallback>
              </Avatar>
              {/* Text — hidden when collapsed */}
              <div className="flex flex-col items-start min-w-0 group-data-[collapsible=icon]:hidden">
  <span className="text-sm font-semibold text-foreground truncate">
    {user?.name ?? "User"}
  </span>
  <span className="text-xs text-muted-foreground truncate max-w-[140px]">
    {user?.email ?? ""}
  </span>
</div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;

import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  BarChart2,
  Settings,
  ChevronRight,
  Plus,
  ListTodo,
  CheckCheck,
  Clock,
  AlignLeft,
  Sparkles,
  Filter,
  PanelLeftClose,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { useTaskModalStore } from "@/store/taskModalStore";
/* ─── tiny helpers ─────────────────────────────────────── */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-cyan flex-shrink-0 text-xs font-bold text-white">
      {getInitials(name)}
    </div>
  );
}

/* ─── types ────────────────────────────────────────────── */
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
  tooltip?: string;
}

interface CollapsibleNavProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean; // sidebar collapsed
  active: boolean;
  onIconClick: () => void; // when sidebar collapsed & icon clicked
  children: React.ReactNode;
}

/* ─── simple nav item ──────────────────────────────────── */
function NavItem({
  to,
  icon,
  label,
  collapsed,
  active,
  tooltip,
}: NavItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <Link
        to={to}
        title={collapsed ? (tooltip ?? label) : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          flex items-center rounded-lg transition-all duration-150 w-full box-border text-[var(--sidebar-fg)]
          ${collapsed ? "justify-center py-2 px-0" : "justify-start py-2 px-3 gap-2.5"}
          ${
            active
              ? "bg-[var(--sidebar-bg-active)] border border-[var(--sidebar-border-active)]"
              : hovered
                ? "bg-[var(--sidebar-bg-hover)] border border-[var(--sidebar-border-default)]"
                : "bg-transparent border border-[var(--sidebar-border-default)]"
          }
        `}
      >
        <span
          className={`
            flex items-center justify-center flex-shrink-0
            ${active ? "text-[var(--sidebar-icon-active)]" : hovered ? "text-[var(--sidebar-icon-hover)]" : "text-[var(--sidebar-icon-muted)]"}
          `}
        >
          {icon}
        </span>
        {!collapsed && (
          <span
            className={`text-sm ${active ? "font-semibold" : "font-normal"}`}
          >
            {label}
          </span>
        )}
      </Link>

      {/* tooltip when collapsed */}
      {collapsed && hovered && (
        <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap z-[999] border border-[rgba(124,92,252,0.25)] shadow-lg">
          {tooltip ?? label}
        </div>
      )}
    </div>
  );
}

/* ─── collapsible nav group ────────────────────────────── */
function CollapsibleNav({
  icon,
  label,
  collapsed,
  active,
  onIconClick,
  children,
}: CollapsibleNavProps) {
  const [open, setOpen] = useState(active);
  const [hovered, setHovered] = useState(false);

  // keep open in sync when sidebar expands/collapses
  useEffect(() => {
    if (collapsed) setOpen(false);
  }, [collapsed]);

  const handleClick = () => {
    if (collapsed) {
      onIconClick();
      return;
    }
    setOpen((o) => !o);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        title={collapsed ? label : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          flex items-center rounded-lg transition-all duration-150 w-full box-border text-[var(--sidebar-fg)]
          ${collapsed ? "justify-center py-2 px-0" : "justify-start py-2 px-3 gap-2.5"}
          ${
            active
              ? "bg-[var(--sidebar-bg-active)] border border-[var(--sidebar-border-active)]"
              : hovered
                ? "bg-[var(--sidebar-bg-hover)] border border-[var(--sidebar-border-default)]"
                : "bg-transparent border border-[var(--sidebar-border-default)]"
          }
          cursor-pointer overflow-hidden whitespace-nowrap
        `}
      >
        <span
          className={`
            flex items-center justify-center flex-shrink-0
            ${active ? "text-[var(--sidebar-icon-active)]" : hovered ? "text-[var(--sidebar-icon-hover)]" : "text-[var(--sidebar-icon-muted)]"}
          `}
        >
          {icon}
        </span>
        {!collapsed && (
          <>
            <span
              className={`text-sm ${active ? "font-semibold" : "font-normal"} flex-1 text-left`}
            >
              {label}
            </span>
            <ChevronRight
              size={14}
              className={`flex-shrink-0 text-[var(--sidebar-icon-muted)] transition-transform duration-200 ${
                open ? "rotate-90" : "rotate-0"
              }`}
            />
          </>
        )}
      </button>

      {/* submenu — only when sidebar expanded */}
      {!collapsed && open && (
        <div className="ml-5 pl-3 border-l border-[var(--sidebar-nav-border)] mt-0.5 mb-0.5 flex flex-col gap-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── sub item ─────────────────────────────────────────── */
function SubItem({
  to,
  icon,
  label,
  active,
  accent,
  onClick,
}: {
  to?: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  accent?: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to || "#"}
      onClick={(e) => {
        if (!to) e.preventDefault();
        onClick?.();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex items-center gap-2 px-2 py-1.75 rounded-md text-xs transition-all duration-150
        ${
          active
            ? "bg-[rgba(124,92,252,0.15)] font-semibold text-[var(--sidebar-primary)]"
            : hovered
              ? "bg-[var(--sidebar-bg-hover)]"
              : "bg-transparent"
        }
      `}
      style={{
        color: active
          ? "var(--sidebar-primary)"
          : accent
            ? accent
            : "var(--sidebar-icon-muted)",
      }}
    >
      <span className="flex items-center flex-shrink-0">{icon}</span>
      {label}
    </Link>
  );
}

/* ─── section label ────────────────────────────────────── */
function SectionLabel({
  label,
  collapsed,
}: {
  label: string;
  collapsed: boolean;
}) {
  if (collapsed) return <div className="h-2" />;
  return (
    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sidebar-icon-muted)] px-3 py-2 pb-1 opacity-60">
      {label}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  MAIN SIDEBAR                                           */
/* ═══════════════════════════════════════════════════════ */
function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const openModal = useTaskModalStore((state) => state.openModal);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const startsWith = (path: string) => location.pathname.startsWith(path);

  const W = collapsed ? 64 : 224;

  return (
    <>
      <div
        className="flex flex-col flex-shrink-0 bg-sidebar border-r border-[var(--sidebar-border)] transition-all duration-[220ms] overflow-hidden relative z-10"
        style={{
          width: W,
          minWidth: W,
          height: "100svh",
        }}
      >
        {/* ── HEADER / LOGO ── */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`
            flex items-center border-b border-[var(--sidebar-border)] bg-transparent cursor-pointer w-full overflow-hidden flex-shrink-0
            ${collapsed ? "justify-center py-4 px-0" : "justify-start py-4 px-3.5 gap-2.5"}
            transition-all duration-150
          `}
        >
          {/* logo mark */}
          <div className="w-8 h-8 min-w-8 bg-gradient-to-br from-violet to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-white" />
          </div>

          {!collapsed && (
            <>
              <span className="text-base font-bold text-sidebar-foreground whitespace-nowrap flex-1 text-left">
                NovaDash
              </span>
              <PanelLeftClose
                size={15}
                className="text-[var(--sidebar-icon-muted)] flex-shrink-0"
              />
            </>
          )}
        </button>

        {/* ── SCROLLABLE CONTENT ── */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 flex flex-col gap-0.5"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {/* MAIN */}
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            collapsed={collapsed}
            active={isActive("/dashboard")}
          />

          {/* TASKS */}
          <SectionLabel label="Tasks" collapsed={collapsed} />

          <CollapsibleNav
            icon={<CheckSquare size={18} />}
            label="Todos"
            collapsed={collapsed}
            active={startsWith("/todos")}
            onIconClick={() => navigate("/todos")}
          >
            <SubItem
              to="/todos"
              icon={<ListTodo size={13} />}
              label="All Todos"
              active={isActive("/todos")}
            />

            {/* priority mini-section */}
            <div className="px-2 py-1.5 pb-1">
              <div className="flex items-center gap-1.25 text-xs font-semibold uppercase tracking-wider text-[var(--sidebar-icon-muted)] mb-1">
                <Filter size={10} /> Priority
              </div>
              {[
                { label: "High Priority", color: "#ef4444", value: "high" },
                { label: "Medium Priority", color: "#f59e0b", value: "medium" },
                { label: "Low Priority", color: "#10b981", value: "low" },
                { label: "By Date", color: "#22d3ee", value: "date" },
              ].map((f) => {
                const isActivePriority =
                  (f.value === "date" && location.search === "?filter=date") ||
                  (f.value !== "date" &&
                    location.search === `?priority=${f.value}`);

                return (
                  <Link
                    key={f.value}
                    to={
                      f.value === "date"
                        ? "/todos?filter=date"
                        : `/todos?priority=${f.value}`
                    }
                    className={`
                      flex items-center gap-1.75 py-1.25 px-2 rounded text-xs no-underline transition-all duration-150
                      ${
                        isActivePriority
                          ? "bg-[var(--sidebar-bg-hover)] font-semibold"
                          : "font-normal"
                      }
                    `}
                    style={{
                      color: isActivePriority
                        ? "var(--sidebar-fg)"
                        : "var(--sidebar-icon-muted)",
                    }}
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-150 ${
                        isActivePriority ? "scale-125" : "scale-100"
                      }`}
                      style={{
                        background: f.color,
                        boxShadow: isActivePriority
                          ? `0 0 8px ${f.color}40`
                          : "none",
                      }}
                    />
                    {f.label}
                  </Link>
                );
              })}
            </div>

            <SubItem
              to="/todos/completed"
              icon={<CheckCheck size={13} />}
              label="Completed"
              active={isActive("/todos/completed")}
            />
            <SubItem
              to="/todos/pending"
              icon={<Clock size={13} />}
              label="Pending"
              active={isActive("/todos/pending")}
            />
            {/* <SubItem to="/todos/create" icon={<Plus size={13} />} label="Create Todo" active={isActive("/todos/create")} accent="#a78bfa" /> */}
            <SubItem
              icon={<Plus size={13} />}
              // to="/todos/create"
              label="Create Todo/Task"
              active={false}
              accent="#a78bfa"
              onClick={() => openModal()}
            />
          </CollapsibleNav>

          {/* CONTENT */}
          <SectionLabel label="Content" collapsed={collapsed} />

          <CollapsibleNav
            icon={<FileText size={18} />}
            label="Articles"
            collapsed={collapsed}
            active={startsWith("/articles")}
            onIconClick={() => navigate("/articles")}
          >
            <SubItem
              to="/articles"
              icon={<AlignLeft size={13} />}
              label="All Articles"
              active={isActive("/articles")}
            />
            <SubItem
              to="/articles/create"
              icon={<Plus size={13} />}
              label="Create Article"
              active={isActive("/articles/create")}
              accent="#22d3ee"
            />
          </CollapsibleNav>

          {/* MORE */}
          <SectionLabel label="More" collapsed={collapsed} />

          <NavItem
            to="/analytics"
            icon={<BarChart2 size={18} />}
            label="Analytics"
            collapsed={collapsed}
            active={isActive("/analytics")}
          />
          <NavItem
            to="/settings"
            icon={<Settings size={18} />}
            label="Settings"
            collapsed={collapsed}
            active={isActive("/settings")}
          />
        </div>

        {/* ── FOOTER ── */}
        <div className="border-t border-[var(--sidebar-border)] p-2 flex flex-col gap-2 flex-shrink-0">
          {/* Upgrade card — hidden when collapsed */}
          {!collapsed && (
            <div className="rounded-xl p-3 border border-[rgba(124,92,252,0.2)] bg-[linear-gradient(135deg,rgba(124,92,252,0.15),rgba(34,211,238,0.08))]">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={13} className="text-[#a78bfa] flex-shrink-0" />
                <span className="text-xs font-semibold text-white">
                  Upgrade to Pro
                </span>
              </div>
              <p className="text-xs text-[var(--sidebar-icon-muted)] mb-2 leading-relaxed">
                Unlock unlimited todos, articles and analytics.
              </p>
              <Link
                to="/pricing"
                className="block text-center text-xs font-semibold text-white px-0 py-1.5 rounded-lg bg-gradient-to-br from-violet to-cyan no-underline transition-all duration-150 hover:shadow-lg"
              >
                Upgrade Now
              </Link>
            </div>
          )}

          {/* User button → /profile */}
          <UserButton user={user} collapsed={collapsed} />
        </div>
      </div>
    </>
  );
}

/* ─── user button ──────────────────────────────────────── */
function UserButton({
  user,
  collapsed,
}: {
  user: { name?: string; email?: string } | null;
  collapsed: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const name = user?.name ?? "User";
  const email = user?.email ?? "";

  return (
    <Link
      to="/profile"
      title={collapsed ? name : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex items-center rounded-lg text-sidebar-foreground no-underline transition-all duration-150 overflow-hidden relative
        ${collapsed ? "justify-center py-1.5 px-0" : "justify-start py-1.5 px-2 gap-2.5"}
        ${hovered ? "bg-[var(--sidebar-bg-hover)]" : "bg-transparent"}
      `}
    >
      <Avatar name={name} />

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-sidebar-foreground overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </div>
          <div className="text-xs text-[var(--sidebar-icon-muted)] overflow-hidden text-ellipsis whitespace-nowrap">
            {email}
          </div>
        </div>
      )}

      {/* tooltip */}
      {collapsed && hovered && (
        <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap z-[999] border border-[rgba(124,92,252,0.25)] shadow-lg">
          {name}
        </div>
      )}
    </Link>
  );
}

export default AppSidebar;

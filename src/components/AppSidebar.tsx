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
    <div
      style={{
        width: 32,
        height: 32,
        minWidth: 32,
        borderRadius: 8,
        background: "linear-gradient(135deg,#7C5CFC,#22D3EE)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
      }}
    >
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
function NavItem({ to, icon, label, collapsed, active, tooltip }: NavItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <Link
        to={to}
        title={collapsed ? (tooltip ?? label) : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "9px 0" : "9px 12px",
          borderRadius: 8,
          textDecoration: "none",
          color: active ? "#fff" : "var(--sidebar-fg)",
          background: active
            ? "linear-gradient(135deg,rgba(124,92,252,.35),rgba(34,211,238,.15))"
            : hovered
            ? "rgba(255,255,255,.06)"
            : "transparent",
          border: active ? "1px solid rgba(124,92,252,.3)" : "1px solid transparent",
          transition: "all .15s",
          overflow: "hidden",
          whiteSpace: "nowrap",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: active ? "#a78bfa" : hovered ? "#c4b5fd" : "var(--sidebar-fg-muted)",
          }}
        >
          {icon}
        </span>
        {!collapsed && (
          <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>
            {label}
          </span>
        )}
      </Link>

      {/* tooltip when collapsed */}
      {collapsed && hovered && (
        <div
          style={{
            position: "absolute",
            left: "calc(100% + 10px)",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#1e2740",
            color: "#edf2ff",
            fontSize: 12,
            fontWeight: 500,
            padding: "5px 10px",
            borderRadius: 6,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 999,
            border: "1px solid rgba(124,92,252,.25)",
            boxShadow: "0 4px 12px rgba(0,0,0,.4)",
          }}
        >
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
        style={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "9px 0" : "9px 12px",
          borderRadius: 8,
          background: active
            ? "linear-gradient(135deg,rgba(124,92,252,.35),rgba(34,211,238,.15))"
            : hovered
            ? "rgba(255,255,255,.06)"
            : "transparent",
          border: active ? "1px solid rgba(124,92,252,.3)" : "1px solid transparent",
          color: active ? "#fff" : "var(--sidebar-fg)",
          width: "100%",
          cursor: "pointer",
          transition: "all .15s",
          overflow: "hidden",
          whiteSpace: "nowrap",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: active ? "#a78bfa" : hovered ? "#c4b5fd" : "var(--sidebar-fg-muted)",
          }}
        >
          {icon}
        </span>
        {!collapsed && (
          <>
            <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, flex: 1, textAlign: "left" }}>
              {label}
            </span>
            <ChevronRight
              size={14}
              style={{
                flexShrink: 0,
                transition: "transform .2s",
                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                color: "var(--sidebar-fg-muted)",
              }}
            />
          </>
        )}
      </button>

      {/* submenu — only when sidebar expanded */}
      {!collapsed && open && (
        <div
          style={{
            marginLeft: 20,
            paddingLeft: 12,
            borderLeft: "1px solid rgba(124,92,252,.2)",
            marginTop: 2,
            marginBottom: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
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
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  accent?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 8px",
        borderRadius: 6,
        textDecoration: "none",
        fontSize: 12,
        color: active ? "#fff" : accent ?? "var(--sidebar-fg-muted)",
        background: active
          ? "rgba(124,92,252,.2)"
          : hovered
          ? "rgba(255,255,255,.05)"
          : "transparent",
        transition: "all .15s",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

/* ─── section label ────────────────────────────────────── */
function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div style={{ height: 8 }} />;
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--sidebar-fg-muted)",
        padding: "8px 12px 4px",
        opacity: 0.6,
      }}
    >
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

  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const startsWith = (path: string) => location.pathname.startsWith(path);

  const W = collapsed ? 64 : 224;

  return (
    <>
      {/* inject CSS vars once */}
      <style>{`
        :root {
          --sidebar-fg: #edf2ff;
          --sidebar-fg-muted: #8b9abb;
        }
        .sidebar-scroll::-webkit-scrollbar { width: 0; }
      `}</style>

      <div
        style={{
          width: W,
          minWidth: W,
          height: "100svh",
          background: "#0b0e1a",
          borderRight: "1px solid #1e2740",
          display: "flex",
          flexDirection: "column",
          transition: "width .22s cubic-bezier(.4,0,.2,1), min-width .22s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* ── HEADER / LOGO ── */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "16px 0" : "16px 14px",
            borderBottom: "1px solid #1e2740",
            background: "transparent",
            border: "none",
            // borderBottom: "1px solid #1e2740",
            cursor: "pointer",
            width: "100%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* logo mark */}
          <div
            style={{
              width: 32,
              height: 32,
              minWidth: 32,
              background: "linear-gradient(135deg,#7C5CFC,#5b3fd4)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderBottom: "9px solid #fff",
              }}
            />
          </div>

          {!collapsed && (
            <>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  flex: 1,
                  textAlign: "left",
                }}
              >
                NovaDash
              </span>
              <PanelLeftClose size={15} style={{ color: "#8b9abb", flexShrink: 0 }} />
            </>
          )}
        </button>

        {/* ── SCROLLABLE CONTENT ── */}
        <div
          className="sidebar-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: collapsed ? "8px 8px" : "8px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
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
            <SubItem to="/todos" icon={<ListTodo size={13} />} label="All Todos" active={isActive("/todos")} />

            {/* priority mini-section */}
            <div style={{ padding: "6px 8px 4px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "#8b9abb",
                  marginBottom: 4,
                }}
              >
                <Filter size={10} /> Priority
              </div>
              {[
                { label: "High Priority", color: "#ef4444", value: "high" },
                { label: "Medium Priority", color: "#f59e0b", value: "medium" },
                { label: "Low Priority", color: "#10b981", value: "low" },
                { label: "By Date", color: "#22d3ee", value: "date" },
              ].map((f) => (
                <Link
                  key={f.value}
                  to={f.value === "date" ? "/todos?filter=date" : `/todos?priority=${f.value}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "5px 4px",
                    borderRadius: 5,
                    textDecoration: "none",
                    fontSize: 12,
                    color: "#8b9abb",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: f.color,
                      flexShrink: 0,
                    }}
                  />
                  {f.label}
                </Link>
              ))}
            </div>

            <SubItem to="/todos/completed" icon={<CheckCheck size={13} />} label="Completed" active={isActive("/todos/completed")} />
            <SubItem to="/todos/pending" icon={<Clock size={13} />} label="Pending" active={isActive("/todos/pending")} />
            <SubItem to="/todos/create" icon={<Plus size={13} />} label="Create Todo" active={isActive("/todos/create")} accent="#a78bfa" />
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
            <SubItem to="/articles" icon={<AlignLeft size={13} />} label="All Articles" active={isActive("/articles")} />
            <SubItem to="/articles/create" icon={<Plus size={13} />} label="Create Article" active={isActive("/articles/create")} accent="#22d3ee" />
          </CollapsibleNav>

          {/* MORE */}
          <SectionLabel label="More" collapsed={collapsed} />

          <NavItem to="/analytics" icon={<BarChart2 size={18} />} label="Analytics" collapsed={collapsed} active={isActive("/analytics")} />
          <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" collapsed={collapsed} active={isActive("/settings")} />
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            borderTop: "1px solid #1e2740",
            padding: collapsed ? "10px 8px" : "10px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {/* Upgrade card — hidden when collapsed */}
          {!collapsed && (
            <div
              style={{
                borderRadius: 10,
                padding: "10px 12px",
                border: "1px solid rgba(124,92,252,.2)",
                background: "linear-gradient(135deg,rgba(124,92,252,.15),rgba(34,211,238,.08))",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Sparkles size={13} style={{ color: "#a78bfa", flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Upgrade to Pro</span>
              </div>
              <p style={{ fontSize: 11, color: "#8b9abb", marginBottom: 8, lineHeight: 1.5 }}>
                Unlock unlimited todos, articles and analytics.
              </p>
              <Link
                to="/pricing"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                  padding: "6px 0",
                  borderRadius: 7,
                  background: "linear-gradient(135deg,#7C5CFC,#22D3EE)",
                  textDecoration: "none",
                }}
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "6px 0" : "6px 8px",
        borderRadius: 8,
        textDecoration: "none",
        background: hovered ? "rgba(255,255,255,.06)" : "transparent",
        transition: "background .15s",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Avatar name={name} />

      {!collapsed && (
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#edf2ff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#8b9abb",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </div>
        </div>
      )}

      {/* tooltip */}
      {collapsed && hovered && (
        <div
          style={{
            position: "absolute",
            left: "calc(100% + 10px)",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#1e2740",
            color: "#edf2ff",
            fontSize: 12,
            fontWeight: 500,
            padding: "5px 10px",
            borderRadius: 6,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 999,
            border: "1px solid rgba(124,92,252,.25)",
            boxShadow: "0 4px 12px rgba(0,0,0,.4)",
          }}
        >
          {name}
        </div>
      )}
    </Link>
  );
}

export default AppSidebar;
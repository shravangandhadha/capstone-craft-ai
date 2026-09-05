import { Link, useLocation } from "@tanstack/react-router";
import { BarChart3, Bot, CircleHelp, LayoutDashboard, Settings, UserRound } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mentor", label: "AI Mentor", icon: Bot },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (to: string) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return <div className="app-frame">
    <aside className="sidebar">
      <Link to="/" className="brand"><span className="brand-mark">C</span><span>Capstone<span>Forge</span></span></Link>
      <div className="sidebar-label">Workspace</div>
      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className={isActive(to) ? "nav-item active" : "nav-item"}><Icon size={18} /><span>{label}</span>{label === "AI Mentor" && <span className="new-dot">New</span>}</Link>)}
      </nav>
      <div className="sidebar-label">Manage</div>
      <nav className="nav-list">
        <Link to="/profile" className={isActive("/profile") ? "nav-item active" : "nav-item"}><UserRound size={18} /><span>Profile</span></Link>
        <Link to="/settings" className={isActive("/settings") ? "nav-item active" : "nav-item"}><Settings size={18} /><span>Settings</span></Link>
      </nav>
      <div className="sidebar-spacer" />
      <div className="help-box"><CircleHelp size={18} /><div><strong>Need a hand?</strong><span>Visit the mentor guide</span></div></div>
      <div className="user-mini"><span className="avatar">S</span><div><strong>Shravan Kumar</strong><span>Student account</span></div><BarChart3 size={15} /></div>
    </aside>
    <div className="main-column"><header className="topbar"><span className="mobile-brand">CapstoneForge</span><div className="topbar-actions"><button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button><Link to="/profile" className="top-avatar">S</Link></div></header>{children}</div>
  </div>;
}

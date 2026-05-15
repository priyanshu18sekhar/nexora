"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  TrendingUp,
  Award,
  Bookmark,
  User,
  Users,
  Calendar,
  DollarSign,
  BarChart2,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bell,
  Menu,
  Sun,
  Moon,
  HelpCircle,
  Video,
} from "lucide-react";
import { useTheme } from "@/src/providers/theme-provider";
import { cn } from "@/src/lib/utils";
import { Avatar } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { dashboardNavLinks } from "@/src/config";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, BookOpen, Briefcase, TrendingUp, Award,
  Bookmark, User, Users, Calendar, DollarSign, BarChart2,
  FileText, CreditCard, Settings, Video,
};

type UserRole = "STUDENT" | "RECRUITER" | "ADMIN";

const roleColors: Record<UserRole, string> = {
  STUDENT:   "from-violet-500 to-indigo-600",
  RECRUITER: "from-amber-500 to-orange-600",
  ADMIN:     "from-rose-500 to-pink-600",
};

const roleBadgeColors: Record<UserRole, string> = {
  STUDENT:   "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  RECRUITER: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  ADMIN:     "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
};

export function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const role = (session?.user?.role as UserRole) ?? "STUDENT";
  const navItems = dashboardNavLinks[role] ?? dashboardNavLinks.STUDENT;
  const roleGradient = roleColors[role] ?? roleColors.STUDENT;
  const roleBadge = roleBadgeColors[role] ?? roleBadgeColors.STUDENT;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Header */}
      <div className={cn(
        "flex items-center border-b border-border transition-all duration-300",
        collapsed ? "px-3 py-4 justify-center" : "px-5 py-4"
      )}>
        <Link
          href="/"
          className="flex items-center gap-3 group"
          title={collapsed ? "Nexora" : undefined}
        >
          <div className={cn(
            "flex-shrink-0 rounded-xl gradient-bg flex items-center justify-center shadow-brand transition-transform duration-200 group-hover:scale-105",
            collapsed ? "w-8 h-8" : "w-9 h-9"
          )}>
            <Sparkles className={cn("text-white", collapsed ? "w-4 h-4" : "w-4.5 h-4.5")} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <span className="text-lg font-bold font-display gradient-text tracking-tight whitespace-nowrap">
                  Nexora
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* User Card */}
      <div className={cn(
        "border-b border-border bg-surface transition-all duration-300",
        collapsed ? "px-3 py-4" : "px-4 py-4"
      )}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="relative flex-shrink-0">
            <Avatar
              src={session?.user?.image}
              name={session?.user?.name}
              size="sm"
              className="ring-2 ring-white dark:ring-border shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1.5 ring-card border border-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden flex-1 min-w-0"
              >
                <p className="text-sm font-semibold truncate leading-tight">
                  {session?.user?.name ?? "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate mb-1.5">
                  {session?.user?.email}
                </p>
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide",
                  roleBadge
                )}>
                  {role}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto custom-scrollbar">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon ?? "LayoutDashboard"] ?? LayoutDashboard;
            const isActive =
              pathname === item.href ||
              (item.href !== `/dashboard/${role.toLowerCase()}` &&
                pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "gradient-bg text-white shadow-brand"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  )}
                  title={collapsed ? item.label : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {/* Active indicator */}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 gradient-bg rounded-xl"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "flex-shrink-0 transition-all relative z-10",
                      collapsed ? "w-5 h-5" : "w-4 h-4",
                      !isActive && "group-hover:scale-110"
                    )}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden relative z-10"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border space-y-1">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all w-full",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Toggle theme" : undefined}
          aria-label="Toggle theme"
        >
          {mounted ? (
            theme === "dark"
              ? <Sun className="w-4 h-4 flex-shrink-0" />
              : <Moon className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Moon className="w-4 h-4 flex-shrink-0 opacity-0" />
          )}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                {mounted ? (theme === "dark" ? "Light Mode" : "Dark Mode") : ""}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Help */}
        <Link
          href="/help"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Help & Support" : undefined}
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                Help & Support
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Sign Out */}
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/8 transition-colors w-full",
            collapsed && "justify-center"
          )}
          onClick={() => signOut({ callbackUrl: "/" })}
          id="sidebar-signout-btn"
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-card border-r border-border z-40 transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {sidebarContent}

        {/* Collapse Toggle */}
        <button
          id="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-24 w-7 h-7 rounded-full border border-border bg-card flex items-center justify-center shadow-md hover:bg-muted hover:shadow-lg transition-all duration-200 z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            : <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          }
        </button>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-nav border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold font-display gradient-text tracking-tight">Nexora</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              className="relative p-2 rounded-xl hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
            <button
              id="mobile-sidebar-btn"
              className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 lg:hidden shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

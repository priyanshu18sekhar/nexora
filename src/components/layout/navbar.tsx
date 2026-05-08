"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Bell,
  LogOut,
  User,
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Sun,
  Moon,
  Search,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/src/components/ui/button";
import { Avatar } from "@/src/components/ui/avatar";
import { cn } from "@/src/lib/utils";
import { navLinks } from "@/src/config";

const roleRedirects: Record<string, string> = {
  STUDENT: "/dashboard/student",
  PROFESSIONAL: "/dashboard/student",
  MENTOR: "/dashboard/mentor",
  RECRUITER: "/dashboard/recruiter",
  ADMIN: "/dashboard/admin",
};

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Hide navbar on dashboard and auth pages
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname === "/login" || pathname === "/register" || pathname === "/profile" || pathname.startsWith("/forgot-password");
  if (isDashboard || isAuth) return null;

  const dashboardHref = session?.user?.role
    ? roleRedirects[session.user.role] ?? "/dashboard/student"
    : "/login";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight gradient-text">
              Nexora
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary"
                      : "text-foreground/65 hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary/8 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
            {session?.user && (
              <Link
                href={dashboardHref}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname.startsWith("/dashboard")
                    ? "text-primary"
                    : "text-foreground/65 hover:text-foreground hover:bg-foreground/5"
                )}
              >
                <span className="relative z-10">Dashboard</span>
                {pathname.startsWith("/dashboard") && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/8 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === "dark"
                  ? <Sun className="w-4 h-4" />
                  : <Moon className="w-4 h-4" />
              )}
            </button>

            {mounted && (
              session?.user ? (
                <>
                  {/* Notification Bell */}
                  <button
                    id="notifications-btn"
                    className="relative p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      id="user-menu-btn"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={cn(
                        "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-foreground/5 transition-all duration-200",
                        userMenuOpen && "bg-foreground/5"
                      )}
                      aria-expanded={userMenuOpen}
                    >
                      <Avatar
                        src={session.user.image}
                        name={session.user.name}
                        size="sm"
                      />
                      <span className="text-sm font-medium max-w-[100px] truncate text-foreground/80">
                        {session.user.name?.split(" ")[0]}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 text-foreground/40 transition-transform duration-200",
                          userMenuOpen && "rotate-180"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 top-full mt-2 w-60 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                        >
                          {/* User info header */}
                          <div className="p-4 border-b border-border bg-surface">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={session.user.image}
                                name={session.user.name}
                                size="md"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-sm truncate">{session.user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                                <span className="mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full gradient-bg text-white font-medium">
                                  {session.user.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Menu items */}
                          <div className="p-1.5">
                            {[
                              { href: dashboardHref, label: "Dashboard", icon: LayoutDashboard },
                              { href: "/profile", label: "Profile", icon: User },
                              { href: "/dashboard/student/courses", label: "My Learning", icon: BookOpen },
                              { href: "/dashboard/student/internships", label: "Applications", icon: Briefcase },
                              { href: "/settings", label: "Settings", icon: Settings },
                            ].map(({ href, label, icon: Icon }) => (
                              <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                {label}
                              </Link>
                            ))}
                          </div>

                          <div className="p-1.5 border-t border-border">
                            <button
                              id="signout-btn"
                              onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/8 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-foreground/70 hover:text-foreground font-medium"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="gradient-bg text-white font-semibold shadow-brand hover:opacity-90 transition-opacity rounded-xl"
                  >
                    <Link href="/register">Get Started Free</Link>
                  </Button>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-btn"
            className="md:hidden p-2 rounded-xl hover:bg-foreground/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden glass-nav border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/8 font-semibold"
                        : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    {mounted && (theme === "dark"
                      ? <><Sun className="w-4 h-4" /> Light</>
                      : <><Moon className="w-4 h-4" /> Dark</>
                    )}
                  </button>
                </div>
                {session?.user ? (
                  <div className="space-y-1">
                    <Link href={dashboardHref} className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted">Dashboard</Link>
                    <Link href="/profile" className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted">Profile</Link>
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/8">Sign Out</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-1">
                    <Button variant="outline" asChild className="rounded-xl"><Link href="/login">Sign In</Link></Button>
                    <Button asChild className="gradient-bg text-white rounded-xl font-semibold"><Link href="/register">Get Started Free</Link></Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  );
}

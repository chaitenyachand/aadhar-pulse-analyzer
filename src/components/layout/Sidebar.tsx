import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Fingerprint,
  FileEdit,
  Map,
  Wifi,
  AlertTriangle,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
  Moon,
  Sun,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Enrollment Analytics", href: "/enrollment", icon: Users },
  { title: "Demographic Updates", href: "/demographic", icon: FileEdit },
  { title: "Biometric Lifecycle", href: "/biometric", icon: Fingerprint },
  { title: "Migration Corridors", href: "/migration", icon: Map, badge: "AI" },
  { title: "Digital Inclusion", href: "/digital-inclusion", icon: Wifi, badge: "AI" },
  { title: "Anomaly Detection", href: "/anomalies", icon: AlertTriangle, badge: "Live" },
  { title: "Predictions", href: "/predictions", icon: TrendingUp, badge: "ML" },
];

const bottomItems: NavItem[] = [
  { title: "Data Import", href: "/data-import", icon: Upload },
  { title: "Export Report", href: "/export", icon: Download },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Fingerprint className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-sidebar animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-sidebar-foreground text-lg">
                Aadhaar
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Analytics Platform
              </span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            const linkContent = (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "drop-shadow-glow")} />
                {!collapsed && (
                  <>
                    <span className="font-medium text-sm">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "ml-auto px-2 py-0.5 text-xs font-semibold rounded-full",
                          item.badge === "AI"
                            ? "bg-accent/20 text-accent"
                            : item.badge === "ML"
                            ? "bg-aadhaar-purple/20 text-aadhaar-purple"
                            : "bg-success/20 text-success"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full" />
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    {item.title}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-xs bg-accent/20 text-accent rounded">
                        {item.badge}
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border py-4 px-3 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const linkContent = (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
        >
          {isDark ? (
            <Sun className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Moon className="h-5 w-5 flex-shrink-0" />
          )}
          {!collapsed && (
            <span className="font-medium text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}

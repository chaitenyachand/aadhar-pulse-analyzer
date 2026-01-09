import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: "default" | "primary" | "accent" | "success" | "warning";
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  variant = "default",
  className,
  loading = false,
}: StatCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    primary: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
    accent: "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20",
    success: "bg-gradient-to-br from-success/10 to-success/5 border-success/20",
    warning: "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    primary: "text-primary",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
  };

  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return "";
    if (change > 0) return "text-success";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  if (loading) {
    return (
      <div className={cn("stat-card border animate-pulse", variantStyles[variant], className)}>
        <div className="flex items-start justify-between mb-4">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-muted rounded mb-2" />
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "stat-card border group cursor-default",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div
            className={cn(
              "p-2.5 rounded-lg bg-background/50 transition-transform group-hover:scale-110",
              iconStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-bold font-display tracking-tight text-card-foreground tabular-nums">
          {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        </p>

        <div className="flex items-center gap-2">
          {change !== undefined && (
            <div className={cn("flex items-center gap-1", getTrendColor())}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {change > 0 ? "+" : ""}
                {change.toFixed(1)}%
              </span>
            </div>
          )}
          {(subtitle || changeLabel) && (
            <span className="text-sm text-muted-foreground">
              {changeLabel || subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Lightbulb, Target, TrendingUp, ArrowRight } from "lucide-react";

interface DecisionPanelProps {
  insight: string;
  policyAction: string;
  operationalImpact: string;
  className?: string;
  variant?: "default" | "success" | "warning" | "accent";
}

const variantStyles = {
  default: {
    bg: "bg-card",
    border: "border-border",
    icon: "bg-primary/10 text-primary",
    arrow: "text-primary",
  },
  success: {
    bg: "bg-success/5",
    border: "border-success/30",
    icon: "bg-success/10 text-success",
    arrow: "text-success",
  },
  warning: {
    bg: "bg-accent/5",
    border: "border-accent/30",
    icon: "bg-accent/10 text-accent",
    arrow: "text-accent",
  },
  accent: {
    bg: "bg-primary/5",
    border: "border-primary/30",
    icon: "bg-primary/10 text-primary",
    arrow: "text-primary",
  },
};

export function DecisionPanel({
  insight,
  policyAction,
  operationalImpact,
  className,
  variant = "default",
}: DecisionPanelProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-xl border p-4 space-y-4",
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        <Lightbulb className="w-4 h-4" />
        Decision Support Panel
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Insight */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-md", styles.icon)}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-foreground">Insight</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-8">
            {insight}
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <div className={cn("flex items-center gap-1", styles.arrow)}>
            <div className="h-px w-8 bg-current opacity-50" />
            <ArrowRight className="w-5 h-5" />
            <div className="h-px w-8 bg-current opacity-50" />
          </div>
        </div>

        {/* Policy Action */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-md", styles.icon)}>
              <Target className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-foreground">Policy Action</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-8">
            {policyAction}
          </p>
        </div>
      </div>

      {/* Operational Impact */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/50">
        <div className={cn("p-1.5 rounded-md", styles.icon)}>
          <TrendingUp className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-foreground">
          Operational Impact:
        </span>
        <span className="text-sm font-semibold text-primary">
          {operationalImpact}
        </span>
      </div>
    </div>
  );
}

interface CompactDecisionPanelProps {
  insight: string;
  policyAction: string;
  impact: string;
  className?: string;
}

export function CompactDecisionPanel({
  insight,
  policyAction,
  impact,
  className,
}: CompactDecisionPanelProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-primary/5 via-accent/5 to-success/5 rounded-lg p-3 border border-border/50",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
          <Lightbulb className="w-3.5 h-3.5" />
        </div>
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-foreground line-clamp-2">
            {insight}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="w-3 h-3 text-accent" />
            <span className="truncate">{policyAction}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs font-semibold text-success">{impact}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

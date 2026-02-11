import { Info, X } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function MethodologyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-muted/50 border-b border-border px-6 py-3 flex items-start gap-3 text-sm">
      <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div className="flex-1">
        <span className="font-semibold text-foreground">Methodology Note: </span>
        <span className="text-muted-foreground">
          All insights are derived from aggregated Aadhaar enrollment and update datasets.
          No individual-level data, authentication outcomes, population census data, or welfare scheme linkage is used.
          Indices and projections represent interaction patterns, not personal behavior or service quality guarantees.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function DerivedMetricTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        Derived from aggregated Aadhaar enrollment and update activity; not a direct measure of individual outcomes.
      </TooltipContent>
    </Tooltip>
  );
}

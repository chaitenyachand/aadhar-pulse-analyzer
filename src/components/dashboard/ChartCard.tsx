import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Download, Maximize2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  onExport?: () => void;
  onExpand?: () => void;
  loading?: boolean;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  actions,
  onExport,
  onExpand,
  loading = false,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4 border-b border-border/50">
        <div>
          <h3 className="text-lg font-semibold font-display text-card-foreground">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onExport && (
                <DropdownMenuItem onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as PNG
                </DropdownMenuItem>
              )}
              {onExpand && (
                <DropdownMenuItem onClick={onExpand}>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Full Screen
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-muted animate-spin border-t-primary" />
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

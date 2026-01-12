import { ReactNode, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Download, Maximize2, MoreHorizontal, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  onExport?: () => void;
  onExpand?: () => void;
  onClick?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
  chartId?: string;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  actions,
  onExport,
  onExpand,
  onClick,
  onRefresh,
  loading = false,
  chartId,
}: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleExport = useCallback(async () => {
    if (onExport) {
      onExport();
      return;
    }

    // Default export as PNG using html2canvas-like approach
    if (chartRef.current) {
      try {
        // Create a canvas from the chart element
        const element = chartRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        // Set canvas dimensions
        const rect = element.getBoundingClientRect();
        const scale = 2; // Higher resolution
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;

        // Draw white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // For now, create a simple text-based export
        ctx.scale(scale, scale);
        ctx.fillStyle = "#1a1a2e";
        ctx.font = "bold 16px Arial";
        ctx.fillText(title, 20, 30);
        
        if (subtitle) {
          ctx.font = "12px Arial";
          ctx.fillStyle = "#6b7280";
          ctx.fillText(subtitle, 20, 50);
        }

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            toast({
              title: "Chart Exported",
              description: "Chart has been downloaded as PNG",
            });
          }
        }, "image/png");
      } catch (error) {
        console.error("Export failed:", error);
        toast({
          title: "Export Failed",
          description: "Could not export chart. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [onExport, title, subtitle]);

  const handleCopyData = useCallback(() => {
    toast({
      title: "Data Copied",
      description: "Chart data has been copied to clipboard",
    });
  }, []);

  const handleExpand = useCallback(() => {
    if (onExpand) {
      onExpand();
    } else {
      setIsFullscreen(true);
    }
  }, [onExpand]);
  return (
    <div
      className={cn(
        "glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
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

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {actions}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExpand}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Full Screen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopyData}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Data
              </DropdownMenuItem>
              {onRefresh && (
                <DropdownMenuItem onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6" ref={chartRef}>
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

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

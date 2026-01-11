import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  Lightbulb,
  Target,
  TrendingUp,
  BarChart3,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface ChartInsight {
  insight: string;
  importance: string;
  policyAction: string;
  operationalImpact: string;
  keyMetrics: string[];
  visualizationValue: string;
}

interface ChartInsightModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartTitle: string;
  chartType: string;
  chartDescription?: string;
  data: any;
  children?: React.ReactNode;
}

export function ChartInsightModal({
  open,
  onOpenChange,
  chartTitle,
  chartType,
  chartDescription,
  data,
  children,
}: ChartInsightModalProps) {
  const [insight, setInsight] = useState<ChartInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChartKey, setLastChartKey] = useState<string>("");

  // Create a unique key for each chart based on title and type
  const chartKey = `${chartType}-${chartTitle}`;

  useEffect(() => {
    // Reset insight when a different chart is opened
    if (open && chartKey !== lastChartKey) {
      setInsight(null);
      setError(null);
      setLastChartKey(chartKey);
      generateInsight();
    } else if (open && !insight && !loading) {
      generateInsight();
    }
  }, [open, chartKey]);

  const generateInsight = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: responseData, error: fnError } = await supabase.functions.invoke(
        "generate-insights",
        {
          body: {
            chartType,
            chartTitle,
            data,
            context: chartDescription,
          },
        }
      );

      if (fnError) throw fnError;

      setInsight(responseData);
    } catch (err: any) {
      console.error("Error generating insight:", err);
      setError(err.message || "Failed to generate insights");
      // Set fallback insight
      setInsight({
        insight: "This visualization shows key patterns in the Aadhaar data that require attention.",
        importance: "Understanding these patterns helps UIDAI optimize operations and improve service delivery.",
        policyAction: "Review the highlighted trends and implement targeted interventions in high-priority regions.",
        operationalImpact: "Improved resource allocation and citizen experience",
        keyMetrics: ["Data patterns identified", "Regional variations detected"],
        visualizationValue: "Visual representation enables quick pattern recognition and data-driven decision making.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!insight) return;

    const exportData = {
      chartTitle,
      chartType,
      generatedAt: new Date().toISOString(),
      insight: insight.insight,
      importance: insight.importance,
      policyAction: insight.policyAction,
      operationalImpact: insight.operationalImpact,
      keyMetrics: insight.keyMetrics,
      visualizationValue: insight.visualizationValue,
      sourceData: data,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chartTitle.replace(/\s+/g, "_")}_insight.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Insight exported successfully!");
  };

  const handleShare = async () => {
    if (!insight) return;

    const shareText = `📊 ${chartTitle}\n\n💡 Insight: ${insight.insight}\n\n🎯 Policy Action: ${insight.policyAction}\n\n📈 Impact: ${insight.operationalImpact}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: chartTitle,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success("Insight copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">{chartTitle}</DialogTitle>
              {chartDescription && (
                <DialogDescription className="mt-1">
                  {chartDescription}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Chart Preview */}
          {children && (
            <div className="border border-border rounded-lg p-4 bg-card">
              <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Visualization Preview
              </div>
              <div className="h-64">{children}</div>
            </div>
          )}

          {/* AI Insights Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">AI-Powered Insights</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                Powered by Lovable AI
              </Badge>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : error ? (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Error generating insights</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={generateInsight}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : insight ? (
              <div className="space-y-4">
                {/* Main Insight */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Key Insight</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.insight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why This Matters */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-accent/10 text-accent shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Why This Matters</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.importance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decision Support Panel */}
                <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Decision Support Panel
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Recommended Policy Action
                      </div>
                      <p className="text-sm text-foreground bg-muted/50 rounded-md p-3">
                        {insight.policyAction}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Expected Operational Impact
                      </div>
                      <p className="text-sm font-semibold text-success bg-success/10 rounded-md p-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {insight.operationalImpact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                {insight.keyMetrics && insight.keyMetrics.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Key Metrics Highlighted</h4>
                    <div className="flex flex-wrap gap-2">
                      {insight.keyMetrics.map((metric, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visualization Value */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    Value of This Visualization
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {insight.visualizationValue}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Insight
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" onClick={generateInsight}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

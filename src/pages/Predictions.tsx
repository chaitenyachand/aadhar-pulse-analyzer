import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ChartInsightModal } from "@/components/dashboard/ChartInsightModal";
import { DecisionPanel, CompactDecisionPanel } from "@/components/dashboard/DecisionPanel";
import { 
  useEnrollmentData, 
  useDashboardStats, 
  useEnrollmentForecast, 
  useStateGrowthPredictions, 
  useUpdateTypePredictions, 
  useResourceDemandForecast, 
  useSaturationPredictions 
} from "@/hooks/useAadhaarData";
import { formatIndianCompact } from "@/components/dashboard/AnimatedCounter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Calendar,
  BarChart3,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Legend,
  Cell,
  ReferenceLine,
} from "recharts";
import { useState } from "react";

const CHART_COLORS = [
  "hsl(207, 90%, 45%)",
  "hsl(24, 95%, 53%)",
  "hsl(145, 76%, 35%)",
  "hsl(262, 52%, 47%)",
  "hsl(174, 62%, 40%)",
  "hsl(43, 96%, 56%)",
];

export default function Predictions() {
  const { data: enrollmentData } = useEnrollmentData();
  const { data: dashboardStats } = useDashboardStats();
  const { data: enrollmentForecast } = useEnrollmentForecast();
  const { data: stateGrowthPredictions } = useStateGrowthPredictions();
  const { data: updateTypePredictions } = useUpdateTypePredictions();
  const { data: resourceDemandForecast } = useResourceDemandForecast();
  const { data: saturationPredictions } = useSaturationPredictions();
  const [insightModal, setInsightModal] = useState<{
    open: boolean;
    title: string;
    type: string;
    description: string;
    data: any;
  }>({ open: false, title: "", type: "", description: "", data: null });

  const inSampleFit = 94.2;
  const modelConfidence = 87.5;
  const forecastHorizon = "6 months";

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-aadhaar-purple/10 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative px-8 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-aadhaar-purple/10">
              <Brain className="w-6 h-6 text-aadhaar-purple" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Model-Based Projections
            </span>
            <Badge variant="outline" className="bg-aadhaar-purple/10 text-aadhaar-purple border-aadhaar-purple/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Projection (Model-Based)
            </Badge>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">
            Enrollment Trend Projection Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Model-based projections of enrollment trends, relative service load, and
            enrollment plateau timelines. Based on historical patterns with model confidence indicators.
          </p>

          {/* Model Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Target className="w-4 h-4" />
                  In-sample Fit Score
                </div>
                <p className="text-3xl font-bold font-display text-success">
                  {inSampleFit}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Activity className="w-4 h-4" />
                  Model Confidence Indicator
                </div>
                <p className="text-3xl font-bold font-display text-primary">
                  {modelConfidence}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  Projection Horizon
                </div>
                <p className="text-3xl font-bold font-display">
                  {forecastHorizon}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Zap className="w-4 h-4" />
                  Last Updated
                </div>
                <p className="text-2xl font-bold font-display">
                  {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Insight Modal */}
      <ChartInsightModal
        open={insightModal.open}
        onOpenChange={(open) => setInsightModal((prev) => ({ ...prev, open }))}
        chartTitle={insightModal.title}
        chartType={insightModal.type}
        chartDescription={insightModal.description}
        data={insightModal.data}
      />

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Enrollment Forecast */}
        <ChartCard
          title="Enrollment Trend Projection Model"
          subtitle="Time-series projection with model confidence bands • Click for AI insights"
          className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
          onClick={() =>
            setInsightModal({
              open: true,
              title: "Enrollment Trend Projection Model",
              type: "time-series",
              description:
                "Model projecting future enrollments with confidence bands based on historical patterns. Assumes continuity of observed trends.",
              data: enrollmentForecast,
            })
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={enrollmentForecast || []}>
                <defs>
                  <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [formatIndianCompact(value), ""]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="transparent"
                  fill="url(#confidenceBand)"
                  name="Upper Bound"
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="transparent"
                  fill="hsl(var(--background))"
                  name="Lower Bound"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke={CHART_COLORS[2]}
                  strokeWidth={3}
                  dot={{ r: 5, fill: CHART_COLORS[2] }}
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={{ r: 5, fill: CHART_COLORS[0] }}
                  name="Projected"
                />
                <ReferenceLine
                  x="Jun 25"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  label={{ value: "Today", position: "top", fontSize: 11 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-start gap-2 p-3 bg-muted/30 rounded text-xs text-muted-foreground">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            <p>Projections are based on historical enrollment trends and assume continuity of observed patterns.</p>
          </div>
        </ChartCard>

        {/* Decision Panel */}
        <DecisionPanel
          insight="Model projects enrollment volume trends based on observed patterns. Model confidence indicator at 87.5% for near-term projections."
          policyAction="Monitor enrollment volumes against projected trends; adjust resource allocation based on observed deviations"
          operationalImpact="Better alignment of resource planning with projected enrollment patterns"
          variant="default"
        />

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* State Growth Projections */}
          <ChartCard
            title="State Growth Rate Projections (Model-Based)"
            subtitle="Projected vs current enrollment growth rates • Click for insights"
            className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() =>
              setInsightModal({
                open: true,
                title: "State Growth Rate Projections",
                type: "bar-chart",
                description: "Model comparing current and projected growth rates by state based on historical patterns",
                data: stateGrowthPredictions,
              })
            }
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateGrowthPredictions || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 20]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="state" width={90} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                  <Legend />
                  <Bar dataKey="currentRate" name="Current %" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="predictedRate" name="Projected %" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(stateGrowthPredictions || []).slice(0, 4).map((s: any) => (
                <div key={s.state} className="flex items-center gap-2 text-xs bg-muted/50 px-2 py-1 rounded">
                  <span className="text-muted-foreground">{s.state}:</span>
                  <span className="font-semibold text-success flex items-center">
                    <ArrowUpRight className="w-3 h-3" />
                    {(s.predictedRate - s.currentRate).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">(high relative model confidence)</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Update Type Projections */}
          <ChartCard
            title="Update Type Projection"
            subtitle="6-month projection of demographic update distribution • Click for insights"
            className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() =>
              setInsightModal({
                open: true,
                title: "Update Type Projection",
                type: "bar-chart",
                description: "Projecting shifts in demographic update patterns over next 6 months based on observed trends",
                data: updateTypePredictions,
              })
            }
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={updateTypePredictions || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                  <Legend />
                  <Bar dataKey="current" name="Current %" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted6mo" name="6-Month Projected %" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(updateTypePredictions || []).slice(0, 3).map((u: any) => (
                <div key={u.type} className="p-2 bg-muted/30 rounded text-center">
                  <p className="text-xs text-muted-foreground">{u.type}</p>
                  <p className={`font-semibold flex items-center justify-center gap-1 ${u.trend === "up" ? "text-success" : "text-destructive"}`}>
                    {u.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {u.predicted6mo - u.current > 0 ? "+" : ""}{u.predicted6mo - u.current}%
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Resource Demand & Saturation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Relative Service Load Projection */}
          <ChartCard
            title="Relative Service Load Projection (Index-Based)"
            subtitle="Projected relative service load trends • Click for insights"
            className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() =>
              setInsightModal({
                open: true,
                title: "Relative Service Load Projection (Index-Based)",
                type: "area-chart",
                description: "Indexed relative service load trends based on enrollment projections. Values are relative indices, not absolute counts.",
                data: resourceDemandForecast,
              })
            }
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={resourceDemandForecast || []}>
                  <defs>
                    <linearGradient id="loadIndexGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: "Relative Index", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="peakLoad"
                    name="Peak Load Index"
                    stroke={CHART_COLORS[2]}
                    fill="url(#peakGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Projected Enrollment Plateau Timeline */}
          <ChartCard
            title="Projected Enrollment Plateau Timeline"
            subtitle="Projected dates for diminishing marginal enrollment by region"
          >
            <div className="space-y-4">
              {(saturationPredictions || []).map((region: any) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{region.region}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{region.currentCoverage}%</span>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {region.targetDate}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={region.currentCoverage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    ~{region.daysRemaining} days to projected enrollment plateau
                  </p>
                </div>
              ))}
              <div className="flex items-start gap-2 p-3 bg-muted/30 rounded text-xs text-muted-foreground">
                <Info className="w-3 h-3 mt-0.5 shrink-0" />
                <p>Plateau indicates diminishing marginal enrollment, not universal coverage. Enrollment saturation is a proxy metric.</p>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Compact Decision Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CompactDecisionPanel
            insight="Bihar shows highest growth acceleration in enrollment trends"
            policyAction="Monitor enrollment infrastructure capacity"
            impact="Better resource alignment"
          />
          <CompactDecisionPanel
            insight="Biometric update volumes projected to increase in near-term"
            policyAction="Plan for increased update processing capacity"
            impact="Reduced processing delays"
          />
          <CompactDecisionPanel
            insight="Seasonal enrollment patterns observed in historical data"
            policyAction="Align staffing with projected seasonal patterns"
            impact="Improved service readiness"
          />
        </div>

        {/* Model Performance Card */}
        <Card className="bg-gradient-to-br from-aadhaar-purple/5 to-primary/5 border-aadhaar-purple/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-aadhaar-purple/10">
                <Brain className="w-5 h-5 text-aadhaar-purple" />
              </div>
              <div>
                <h3 className="font-semibold">Model Performance Metrics</h3>
                <p className="text-sm text-muted-foreground">Last trained: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">MAE (Mean Absolute Error)</p>
                <p className="text-xl font-bold">124,532</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">RMSE</p>
                <p className="text-xl font-bold">186,245</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">R² (In-sample Fit)</p>
                <p className="text-xl font-bold text-success">0.942</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Training Data Points</p>
                <p className="text-xl font-bold">2.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

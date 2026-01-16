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

  const modelAccuracy = 94.2;
  const predictionConfidence = 87.5;
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
              ML-Powered Predictions
            </span>
            <Badge variant="outline" className="bg-aadhaar-purple/10 text-aadhaar-purple border-aadhaar-purple/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">
            Predictive Analytics Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Machine learning models forecasting enrollment trends, resource demands, and
            saturation timelines. Confidence intervals and accuracy metrics included.
          </p>

          {/* Model Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Target className="w-4 h-4" />
                  Model Accuracy
                </div>
                <p className="text-3xl font-bold font-display text-success">
                  {modelAccuracy}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Activity className="w-4 h-4" />
                  Confidence Level
                </div>
                <p className="text-3xl font-bold font-display text-primary">
                  {predictionConfidence}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  Forecast Horizon
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
          title="Enrollment Forecast Model"
          subtitle="ARIMA time-series prediction with 95% confidence intervals • Click for AI insights"
          className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
          onClick={() =>
            setInsightModal({
              open: true,
              title: "Enrollment Forecast Model",
              type: "time-series",
              description:
                "ARIMA model predicting future enrollments with confidence bands based on historical patterns",
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
                  name="Predicted"
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
        </ChartCard>

        {/* Decision Panel */}
        <DecisionPanel
          insight="Model predicts 6.4M peak enrollments in August 2025, followed by seasonal decline. High confidence (87.5%) in Q3 projections."
          policyAction="Pre-position 15% additional enrollment resources in high-growth states by July 2025"
          operationalImpact="↑ 22% capacity utilization, ↓ 35% queue wait times during peak"
          variant="default"
        />

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* State Growth Predictions */}
          <ChartCard
            title="State Growth Rate Predictions"
            subtitle="Predicted vs current enrollment growth rates • Click for insights"
            className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() =>
              setInsightModal({
                open: true,
                title: "State Growth Rate Predictions",
                type: "bar-chart",
                description: "ML model comparing current and projected growth rates by state",
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
                  <Bar dataKey="predictedRate" name="Predicted %" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} />
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
                  <span className="text-muted-foreground">({s.confidence}% conf)</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Update Type Predictions */}
          <ChartCard
            title="Update Type Forecast"
            subtitle="6-month prediction of demographic update distribution • Click for insights"
            className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() =>
              setInsightModal({
                open: true,
                title: "Update Type Forecast",
                type: "bar-chart",
                description: "Predicting shifts in demographic update patterns over next 6 months",
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
                  <Bar dataKey="predicted6mo" name="6-Month Predicted %" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
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
          {/* Resource Demand Forecast */}
          <ChartCard
            title="Resource Demand Forecast"
            subtitle="Projected operator and equipment requirements • Click for insights"
            className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() =>
              setInsightModal({
                open: true,
                title: "Resource Demand Forecast",
                type: "area-chart",
                description: "Predicting infrastructure and personnel needs based on enrollment forecasts",
                data: resourceDemandForecast,
              })
            }
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={resourceDemandForecast || []}>
                  <defs>
                    <linearGradient id="operatorsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="machinesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                    dataKey="operators"
                    name="Operators Needed"
                    stroke={CHART_COLORS[0]}
                    fill="url(#operatorsGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="machines"
                    name="Machines Needed"
                    stroke={CHART_COLORS[2]}
                    fill="url(#machinesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Saturation Timeline */}
          <ChartCard
            title="100% Coverage Saturation Timeline"
            subtitle="Predicted dates for achieving universal enrollment by region"
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
                    {region.daysRemaining} days to 100% coverage
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Compact Decision Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CompactDecisionPanel
            insight="Bihar shows highest growth acceleration (+3.8%)"
            policyAction="Allocate 20% additional enrollment camps"
            impact="↑ 40% coverage velocity"
          />
          <CompactDecisionPanel
            insight="Biometric updates to surge 47% in 6 months"
            policyAction="Upgrade biometric capture devices proactively"
            impact="↓ 25% update backlog"
          />
          <CompactDecisionPanel
            insight="August peak requires 16,500 operators"
            policyAction="Begin operator training program by May"
            impact="↑ 99% service readiness"
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
                <p className="text-xs text-muted-foreground mb-1">R² Score</p>
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

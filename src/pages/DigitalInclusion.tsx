import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ChartInsightModal } from "@/components/dashboard/ChartInsightModal";
import { DecisionPanel } from "@/components/dashboard/DecisionPanel";
import { DerivedMetricTooltip } from "@/components/dashboard/MethodologyBanner";
import { useDigitalInclusionIndex } from "@/hooks/useAadhaarData";
import { formatIndianCompact } from "@/components/dashboard/AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe, Smartphone, Users, TrendingUp, TrendingDown, Award, AlertCircle, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ScatterChart, Scatter, ZAxis } from "recharts";
import { useState } from "react";
const CHART_COLORS = ["hsl(207, 90%, 45%)", "hsl(24, 95%, 53%)", "hsl(145, 76%, 35%)", "hsl(262, 52%, 47%)", "hsl(174, 62%, 40%)"];
export default function DigitalInclusion() {
  const {
    data: inclusionData,
    isLoading
  } = useDigitalInclusionIndex();
  const [insightModal, setInsightModal] = useState<{
    open: boolean;
    title: string;
    type: string;
    description: string;
    data: any;
  }>({
    open: false,
    title: "",
    type: "",
    description: "",
    data: null
  });

  // Calculate stats
  const avgScore = inclusionData?.reduce((sum, d) => sum + d.score, 0) / (inclusionData?.length || 1);
  const topPerformer = inclusionData?.[0];
  const bottomPerformer = inclusionData?.[inclusionData.length - 1];
  const highInclusionCount = inclusionData?.filter(d => d.score >= 75).length || 0;
  const lowInclusionCount = inclusionData?.filter(d => d.score < 50).length || 0;

  // Prepare radar chart data for top 5 states
  const radarData = inclusionData?.slice(0, 5).map(state => ({
    state: state.state,
    mobile: state.mobile,
    enrollment: state.enrollment,
    biometric: state.biometric,
    score: state.score
  })) || [];

  // Scatter data for correlation
  const scatterData = inclusionData?.map(d => ({
    x: d.mobile,
    y: d.enrollment,
    z: d.score,
    state: d.state
  })) || [];
  return <DashboardLayout>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative px-8 py-10">
          
          <h1 className="text-3xl font-bold font-display mb-2">
            Aadhaar Interaction Intensity Index (Derived)
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Composite index measuring interaction intensity based on mobile update activity,
            enrollment volumes, and biometric update frequency across states.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  National Average
                </div>
                <p className="text-2xl font-bold font-display">
                  {avgScore.toFixed(1)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Award className="w-4 h-4" />
                  Top Performer
                </div>
                <p className="text-lg font-bold font-display">
                  {topPerformer?.state || "N/A"}
                </p>
                <p className="text-xs text-success">Score: {topPerformer?.score}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Users className="w-4 h-4 text-success" />
                  High Intensity
                </div>
                <p className="text-2xl font-bold font-display text-success">
                  {highInclusionCount}
                </p>
                <p className="text-xs text-muted-foreground">States ≥ 75</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Low Intensity
                </div>
                <p className="text-2xl font-bold font-display text-destructive">
                  {lowInclusionCount}
                </p>
                <p className="text-xs text-muted-foreground">States &lt; 50</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Insight Modal */}
      <ChartInsightModal open={insightModal.open} onOpenChange={open => setInsightModal(prev => ({
      ...prev,
      open
    }))} chartTitle={insightModal.title} chartType={insightModal.type} chartDescription={insightModal.description} data={insightModal.data} />

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* State Rankings */}
        <ChartCard title="Aadhaar Interaction Intensity – State Rankings" subtitle="States ranked by composite interaction intensity score (derived) • Click for AI insights" className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" loading={isLoading} onClick={() => setInsightModal({
        open: true,
        title: "Aadhaar Interaction Intensity – State Rankings",
        type: "bar-chart",
        description: "Composite index derived from normalized enrollment and update interaction volumes across Indian states",
        data: inclusionData
      })}>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inclusionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="state" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                <Tooltip contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }} formatter={(value: number, name: string) => {
                if (name === "score") return [`${value}`, "Interaction Intensity Score"];
                return [value, name];
              }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {inclusionData?.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.score >= 80 ? "hsl(145, 76%, 35%)" : entry.score >= 60 ? "hsl(207, 90%, 45%)" : entry.score >= 40 ? "hsl(43, 96%, 50%)" : "hsl(0, 72%, 51%)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Decision Panel */}
        <DecisionPanel insight="Southern states (Kerala, Tamil Nadu, Karnataka) show consistently higher Aadhaar interaction volumes, while some northern states show lower activity levels" policyAction="Investigate lower interaction intensity in underperforming states; consider targeted enrollment and update awareness campaigns" operationalImpact="Potential ↑ in enrollment and update activity in low-intensity states through outreach programs" variant="accent" />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart - Component Analysis */}
          <ChartCard title="Component Analysis (Top 5 States)" subtitle="Multi-dimensional view of interaction intensity factors (derived) • Click for insights" className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => setInsightModal({
          open: true,
          title: "Component Analysis - Top 5 States",
          type: "radar-chart",
          description: "Comparing mobile update activity, enrollment volumes, and biometric update frequency across top performers",
          data: radarData
        })}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[{
                metric: "Mobile Activity",
                ...Object.fromEntries(radarData.map(d => [d.state, d.mobile]))
              }, {
                metric: "Enrollment",
                ...Object.fromEntries(radarData.map(d => [d.state, d.enrollment]))
              }, {
                metric: "Biometric Updates",
                ...Object.fromEntries(radarData.map(d => [d.state, d.biometric]))
              }]}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12
                }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10
                }} />
                  {radarData.map((state, index) => <Radar key={state.state} name={state.state} dataKey={state.state} stroke={CHART_COLORS[index % CHART_COLORS.length]} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.2} />)}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Scatter Chart - Correlation */}
          <ChartCard title="Mobile Activity vs Enrollment Correlation" subtitle="Relationship between mobile update activity and enrollment volumes" className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => setInsightModal({
          open: true,
          title: "Mobile Activity vs Enrollment Correlation",
          type: "scatter-chart",
          description: "Analyzing correlation between mobile update activity and enrollment volumes",
          data: scatterData
        })}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
              }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" dataKey="x" name="Mobile Activity" domain={[40, 100]} tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12
                }} label={{
                  value: "Mobile Update Activity (Proxy)",
                  position: "bottom",
                  fill: "hsl(var(--muted-foreground))"
                }} />
                  <YAxis type="number" dataKey="y" name="Enrollment" domain={[40, 100]} tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12
                }} label={{
                  value: "Enrollment Volume",
                  angle: -90,
                  position: "left",
                  fill: "hsl(var(--muted-foreground))"
                }} />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <Tooltip contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} formatter={(value: number, name: string) => [value, name]} labelFormatter={label => {
                  const point = scatterData.find(d => d.x === label);
                  return point?.state || "";
                }} />
                  <Scatter name="States" data={scatterData} fill={CHART_COLORS[0]} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Footnote */}
        <div className="flex items-start gap-2 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <p>Index components are normalized interaction volumes derived from aggregated Aadhaar data; this is not a measure of device ownership or digital access.</p>
        </div>

        {/* Detailed Rankings Table */}
        <ChartCard title="Aadhaar Interaction Intensity – Detailed State Rankings" subtitle="Complete breakdown of interaction intensity index components (derived metrics)">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">State</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Intensity Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                    <div className="flex items-center justify-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      Mobile Update Activity (Proxy)
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      Enrollment
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Biometric Updates</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {inclusionData?.map((state, index) => <tr key={state.state} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 3 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{state.state}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={state.score} className="w-20 h-2" />
                        <span className="text-sm font-semibold tabular-nums w-8">
                          {state.score}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center tabular-nums">{state.mobile}</td>
                    <td className="py-3 px-4 text-center tabular-nums">{state.enrollment}</td>
                    <td className="py-3 px-4 text-center tabular-nums">{state.biometric}</td>
                    <td className="py-3 px-4 text-right">
                      {state.score >= 80 ? <Badge className="bg-success/10 text-success border-success/20">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          High
                        </Badge> : state.score >= 60 ? <Badge variant="secondary">Moderate</Badge> : state.score >= 40 ? <Badge variant="outline" className="text-warning border-warning/20">
                          Low
                        </Badge> : <Badge variant="destructive">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Very Low
                        </Badge>}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>;
}

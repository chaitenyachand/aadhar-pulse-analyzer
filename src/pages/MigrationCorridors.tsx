import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ChartInsightModal } from "@/components/dashboard/ChartInsightModal";
import { DecisionPanel } from "@/components/dashboard/DecisionPanel";
import { SankeyDiagram } from "@/components/dashboard/SankeyDiagram";
import { useMigrationCorridors } from "@/hooks/useAadhaarData";
import { formatIndianCompact } from "@/components/dashboard/AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp, MapPin, Users, AlertTriangle, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";
const CHART_COLORS = ["hsl(207, 90%, 45%)", "hsl(24, 95%, 53%)", "hsl(145, 76%, 35%)", "hsl(262, 52%, 47%)", "hsl(174, 62%, 40%)"];
export default function MigrationCorridors() {
  const {
    data: migrationData,
    isLoading
  } = useMigrationCorridors();
  const [selectedCorridor, setSelectedCorridor] = useState<string | null>(null);
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

  // Calculate totals and stats
  const totalMigration = migrationData?.reduce((sum, c) => sum + c.flow, 0) || 0;
  const topCorridor = migrationData?.[0];
  const avgConfidence = migrationData?.reduce((sum, c) => sum + c.confidence, 0) / (migrationData?.length || 1);

  // Group by destination state
  const destinationStats = migrationData?.reduce((acc, c) => {
    if (!acc[c.to]) acc[c.to] = {
      state: c.to,
      inflow: 0,
      sources: 0
    };
    acc[c.to].inflow += c.flow;
    acc[c.to].sources += 1;
    return acc;
  }, {} as Record<string, {
    state: string;
    inflow: number;
    sources: number;
  }>) || {};
  const topDestinations = Object.values(destinationStats).sort((a, b) => b.inflow - a.inflow).slice(0, 5);

  // Group by source state
  const sourceStats = migrationData?.reduce((acc, c) => {
    if (!acc[c.from]) acc[c.from] = {
      state: c.from,
      outflow: 0,
      destinations: 0
    };
    acc[c.from].outflow += c.flow;
    acc[c.from].destinations += 1;
    return acc;
  }, {} as Record<string, {
    state: string;
    outflow: number;
    destinations: number;
  }>) || {};
  const topSources = Object.values(sourceStats).sort((a, b) => b.outflow - a.outflow).slice(0, 5);
  return <DashboardLayout>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative px-8 py-10">
          
          <h1 className="text-3xl font-bold font-display mb-2">
            Migration Corridors Analysis
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Detect internal migration patterns through address change clustering.
            Identifies major migration corridors and provides insights for urban planning.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Users className="w-4 h-4" />
                  Total Migration
                </div>
                <p className="text-2xl font-bold font-display">
                  {formatIndianCompact(totalMigration)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <ArrowRight className="w-4 h-4" />
                  Active Corridors
                </div>
                <p className="text-2xl font-bold font-display">
                  {migrationData?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Top Corridor
                </div>
                <p className="text-lg font-bold font-display">
                  {topCorridor ? `${topCorridor.from} → ${topCorridor.to}` : "N/A"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Sparkles className="w-4 h-4" />
                  Avg Confidence
                </div>
                <p className="text-2xl font-bold font-display">
                  {(avgConfidence * 100).toFixed(0)}%
                </p>
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
        {/* Sankey Diagram */}
        <ChartCard title="Migration Flow Visualization" subtitle="Sankey diagram showing inter-state migration patterns • Click for AI insights" className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" loading={isLoading} onClick={() => setInsightModal({
        open: true,
        title: "Migration Flow Visualization",
        type: "sankey-diagram",
        description: "Inter-state migration corridors based on address change patterns",
        data: migrationData
      })}>
          <div className="h-[500px] w-full overflow-auto">
            {migrationData && <SankeyDiagram data={migrationData} width={Math.max(800, migrationData.length / 2 * 100)} height={450} onNodeClick={setSelectedCorridor} />}
          </div>
        </ChartCard>

        {/* Decision Panel */}
        <DecisionPanel insight="Bihar and Uttar Pradesh show highest out-migration to Maharashtra and Delhi, indicating strong economic pull factors" policyAction="Establish mobile Aadhaar update camps at major destination points (Mumbai, Delhi) for migrant populations" operationalImpact="↑ 40% address update compliance, ↓ 25% pendency in source states" variant="default" />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Source States */}
          <ChartCard title="Top Source States (Out-Migration)" subtitle="States with highest emigration • Click for AI insights" className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => setInsightModal({
          open: true,
          title: "Top Source States (Out-Migration)",
          type: "bar-chart",
          description: "States with highest out-migration based on address changes",
          data: topSources
        })}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSources} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => formatIndianCompact(v)} />
                  <YAxis type="category" dataKey="state" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} formatter={(value: number) => [formatIndianCompact(value), "Out-Migration"]} />
                  <Bar dataKey="outflow" radius={[0, 4, 4, 0]}>
                    {topSources.map((_, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Top Destination States */}
          <ChartCard title="Top Destination States (In-Migration)" subtitle="States with highest immigration • Click for AI insights" className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => setInsightModal({
          open: true,
          title: "Top Destination States (In-Migration)",
          type: "bar-chart",
          description: "States with highest in-migration based on address changes",
          data: topDestinations
        })}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topDestinations} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => formatIndianCompact(v)} />
                  <YAxis type="category" dataKey="state" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} formatter={(value: number) => [formatIndianCompact(value), "In-Migration"]} />
                  <Bar dataKey="inflow" radius={[0, 4, 4, 0]}>
                    {topDestinations.map((_, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Corridor Details Table */}
        <ChartCard title="Top Migration Corridors" subtitle="Ranked by estimated migration volume with confidence scores">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Corridor</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Migration Volume</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Confidence</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {migrationData?.slice(0, 10).map((corridor, index) => <tr key={`${corridor.from}-${corridor.to}`} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 3 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-medium">
                        <span>{corridor.from}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span>{corridor.to}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {formatIndianCompact(corridor.flow)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={corridor.confidence * 100} className="w-16 h-2" />
                        <span className="text-sm tabular-nums">
                          {(corridor.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {corridor.confidence >= 0.8 ? <Badge variant="default" className="bg-success/10 text-success border-success/20">
                          High Confidence
                        </Badge> : corridor.confidence >= 0.6 ? <Badge variant="secondary">
                          Moderate
                        </Badge> : <Badge variant="outline" className="text-warning border-warning/20">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Low Confidence
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
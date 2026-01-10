import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DecisionPanel } from "@/components/dashboard/DecisionPanel";
import { ChartInsightModal } from "@/components/dashboard/ChartInsightModal";
import { useDemographicUpdates, useDashboardStats } from "@/hooks/useAadhaarData";
import { formatIndianCompact } from "@/components/dashboard/AnimatedCounter";
import { FileEdit, MapPin, Phone, Mail, User, Calendar, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { useState } from "react";

const CHART_COLORS = [
  "hsl(207, 90%, 45%)",
  "hsl(24, 95%, 53%)",
  "hsl(145, 76%, 35%)",
  "hsl(262, 52%, 47%)",
  "hsl(174, 62%, 40%)",
  "hsl(43, 96%, 50%)",
];

export default function DemographicUpdates() {
  const { data: demographicUpdates } = useDemographicUpdates();
  const { data: stats } = useDashboardStats();
  const [insightModal, setInsightModal] = useState<{
    open: boolean;
    title: string;
    type: string;
    description: string;
    data: any;
  }>({ open: false, title: "", type: "", description: "", data: null });

  // Update velocity data (simulated monthly trends)
  const updateVelocity = [
    { month: "Jan", address: 420000, mobile: 280000, name: 150000 },
    { month: "Feb", address: 380000, mobile: 260000, name: 140000 },
    { month: "Mar", address: 450000, mobile: 310000, name: 165000 },
    { month: "Apr", address: 520000, mobile: 350000, name: 180000 },
    { month: "May", address: 480000, mobile: 320000, name: 170000 },
    { month: "Jun", address: 510000, mobile: 340000, name: 175000 },
    { month: "Jul", address: 580000, mobile: 380000, name: 195000 },
    { month: "Aug", address: 620000, mobile: 410000, name: 210000 },
    { month: "Sep", address: 550000, mobile: 360000, name: 185000 },
    { month: "Oct", address: 490000, mobile: 330000, name: 170000 },
    { month: "Nov", address: 460000, mobile: 300000, name: 160000 },
    { month: "Dec", address: 400000, mobile: 270000, name: 145000 },
  ];

  // Quality score by state (correction rate indicates poor initial capture)
  const qualityScores = [
    { state: "Kerala", quality: 96, corrections: 4 },
    { state: "Tamil Nadu", quality: 94, corrections: 6 },
    { state: "Karnataka", quality: 92, corrections: 8 },
    { state: "Maharashtra", quality: 90, corrections: 10 },
    { state: "Gujarat", quality: 88, corrections: 12 },
    { state: "Rajasthan", quality: 82, corrections: 18 },
    { state: "MP", quality: 80, corrections: 20 },
    { state: "UP", quality: 78, corrections: 22 },
    { state: "Bihar", quality: 75, corrections: 25 },
    { state: "Jharkhand", quality: 73, corrections: 27 },
  ];

  // Life event correlation data
  const lifeEventCorrelation = [
    { event: "Marriage", addressUpdate: 85, nameUpdate: 45, mobileUpdate: 60 },
    { event: "Migration", addressUpdate: 95, nameUpdate: 5, mobileUpdate: 70 },
    { event: "Employment", addressUpdate: 40, nameUpdate: 10, mobileUpdate: 55 },
    { event: "Education", addressUpdate: 65, nameUpdate: 15, mobileUpdate: 45 },
    { event: "Banking", addressUpdate: 30, nameUpdate: 5, mobileUpdate: 80 },
  ];

  // State-wise update distribution
  const stateUpdateData = [
    { name: "Maharashtra", size: 2500000, updates: 2500000 },
    { name: "UP", size: 2200000, updates: 2200000 },
    { name: "Tamil Nadu", size: 1800000, updates: 1800000 },
    { name: "Karnataka", size: 1600000, updates: 1600000 },
    { name: "Gujarat", size: 1400000, updates: 1400000 },
    { name: "Rajasthan", size: 1300000, updates: 1300000 },
    { name: "Bihar", size: 1200000, updates: 1200000 },
    { name: "WB", size: 1100000, updates: 1100000 },
    { name: "MP", size: 1000000, updates: 1000000 },
    { name: "Kerala", size: 800000, updates: 800000 },
  ];

  const totalUpdates = demographicUpdates?.reduce((acc: number, d: any) => acc + (d.count || 0), 0) || 0;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-accent via-accent/90 to-primary/70 text-accent-foreground px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-accent-foreground/10 backdrop-blur">
            <FileEdit className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold font-display">Demographic Update Intelligence</h1>
        </div>
        <p className="text-accent-foreground/80 max-w-2xl">
          Deep analysis of demographic corrections, update patterns, and data quality indicators
        </p>
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

      <div className="p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Updates"
            value={stats?.totalDemographicUpdates || totalUpdates}
            change={8.3}
            changeLabel="vs last month"
            icon={<FileEdit className="w-5 h-5" />}
            variant="accent"
          />
          <StatCard
            title="Address Updates"
            value={demographicUpdates?.find((d: any) => d.field === "Address")?.count || 8500000}
            subtitle="42% of all updates"
            icon={<MapPin className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Mobile Updates"
            value={demographicUpdates?.find((d: any) => d.field === "Mobile")?.count || 5200000}
            subtitle="26% of all updates"
            icon={<Phone className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Name Corrections"
            value={demographicUpdates?.find((d: any) => d.field === "Name")?.count || 3100000}
            subtitle="Quality indicator"
            icon={<User className="w-5 h-5" />}
            variant="default"
          />
        </div>

        {/* Decision Panel */}
        <DecisionPanel
          insight="Address updates constitute 42% of all demographic changes, correlating strongly with internal migration patterns"
          policyAction="Implement streamlined digital address update via mAadhaar with DigiLocker integration"
          operationalImpact="↓ 35% in-person center visits, ↑ 50% update processing speed"
          variant="accent"
        />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Update Type Distribution */}
          <ChartCard
            title="Update Type Distribution"
            subtitle="Breakdown of demographic changes • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Update Type Distribution",
              type: "pie-chart",
              description: "Distribution of demographic update types",
              data: demographicUpdates,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicUpdates}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="field"
                    label={({ field, percentage }) => `${field}: ${percentage}%`}
                    labelLine={false}
                  >
                    {demographicUpdates?.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatIndianCompact(value), "Updates"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Update Velocity Over Time */}
          <ChartCard
            title="Update Velocity Tracker"
            subtitle="Monthly update trends by field type • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Update Velocity Tracker",
              type: "stacked-bar-chart",
              description: "Monthly update frequency patterns",
              data: updateVelocity,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={updateVelocity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => formatIndianCompact(value)}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatIndianCompact(value), ""]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="address" stackId="a" fill={CHART_COLORS[0]} name="Address" />
                  <Bar dataKey="mobile" stackId="a" fill={CHART_COLORS[1]} name="Mobile" />
                  <Bar dataKey="name" stackId="a" fill={CHART_COLORS[2]} name="Name" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Quality Score Dashboard */}
        <ChartCard
          title="Data Quality Score by State"
          subtitle="Correction rate indicates poor initial data capture quality • Click for insights"
          onClick={() => setInsightModal({
            open: true,
            title: "Data Quality Score by State",
            type: "bar-chart",
            description: "State-wise data quality scores based on correction rates",
            data: qualityScores,
          })}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityScores} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name === "quality" ? "Quality Score" : "Correction Rate",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="quality" fill={CHART_COLORS[2]} name="Quality Score" radius={[0, 4, 4, 0]} />
                <Bar dataKey="corrections" fill={CHART_COLORS[1]} name="Correction Rate" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Decision Panel */}
        <DecisionPanel
          insight="States with high correction rates (Bihar 25%, Jharkhand 27%) indicate systemic issues in initial data capture"
          policyAction="Deploy quality assurance audits and operator retraining programs in high-correction districts"
          operationalImpact="↓ 30% future correction needs, ↑ 25% first-time data accuracy"
          variant="warning"
        />

        {/* Life Event Correlation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart - Life Events */}
          <ChartCard
            title="Life Event Correlation Analysis"
            subtitle="Update patterns triggered by life events • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Life Event Correlation Analysis",
              type: "radar-chart",
              description: "How life events correlate with different types of updates",
              data: lifeEventCorrelation,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={lifeEventCorrelation}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="event" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Radar name="Address" dataKey="addressUpdate" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.3} />
                  <Radar name="Mobile" dataKey="mobileUpdate" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} fillOpacity={0.3} />
                  <Radar name="Name" dataKey="nameUpdate" stroke={CHART_COLORS[2]} fill={CHART_COLORS[2]} fillOpacity={0.3} />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Update Heatmap Placeholder */}
          <ChartCard
            title="State-wise Update Volume"
            subtitle="Demographic update distribution by state • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "State-wise Update Volume",
              type: "bar-chart",
              description: "Geographic distribution of update volumes",
              data: stateUpdateData,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateUpdateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => formatIndianCompact(value)}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatIndianCompact(value), "Updates"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="size" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]}>
                    {stateUpdateData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Update Details Table */}
        <ChartCard
          title="Update Field Analysis"
          subtitle="Detailed breakdown of demographic update categories"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Field</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Total Updates</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Percentage</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Trend</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Primary Trigger</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: "Address", count: 8500000, percentage: 42, trend: "+12%", trigger: "Migration, Marriage" },
                  { field: "Mobile", count: 5200000, percentage: 26, trend: "+8%", trigger: "SIM change, Banking" },
                  { field: "Name", count: 3100000, percentage: 15, trend: "+3%", trigger: "Marriage, Corrections" },
                  { field: "DOB", count: 2100000, percentage: 10, trend: "-2%", trigger: "Document verification" },
                  { field: "Email", count: 900000, percentage: 5, trend: "+15%", trigger: "Digital services" },
                  { field: "Gender", count: 400000, percentage: 2, trend: "+1%", trigger: "Legal corrections" },
                ].map((row, index) => (
                  <tr key={row.field} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        <span className="font-medium">{row.field}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {formatIndianCompact(row.count)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.percentage}%`,
                              backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{row.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          row.trend.startsWith("+")
                            ? "bg-success/20 text-success"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {row.trend}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">{row.trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}

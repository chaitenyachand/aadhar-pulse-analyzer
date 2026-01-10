import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { IndiaMap } from "@/components/dashboard/IndiaMap";
import { AnimatedCounter, formatIndianCompact } from "@/components/dashboard/AnimatedCounter";
import { DecisionPanel, CompactDecisionPanel } from "@/components/dashboard/DecisionPanel";
import { ChartInsightModal } from "@/components/dashboard/ChartInsightModal";
import {
  useDashboardStats,
  useEnrollmentData,
  useMonthlyTrends,
  useDemographicUpdates,
} from "@/hooks/useAadhaarData";
import {
  Users,
  FileEdit,
  Fingerprint,
  Shield,
  Globe,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const CHART_COLORS = [
  "hsl(207, 90%, 45%)",
  "hsl(24, 95%, 53%)",
  "hsl(145, 76%, 35%)",
  "hsl(262, 52%, 47%)",
  "hsl(174, 62%, 40%)",
  "hsl(43, 96%, 50%)",
];

export default function Index() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: enrollmentData } = useEnrollmentData();
  const { data: monthlyTrends } = useMonthlyTrends();
  const { data: demographicUpdates } = useDemographicUpdates();
  const [selectedState, setSelectedState] = useState<string>();
  const [insightModal, setInsightModal] = useState<{
    open: boolean;
    title: string;
    type: string;
    description: string;
    data: any;
  }>({ open: false, title: "", type: "", description: "", data: null });

  const mapData =
    enrollmentData?.map((item: any) => ({
      state: item.state,
      value: item.total || item.total_enrolment || 0,
    })) || [];

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-hero-pattern text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-primary/90 to-accent/30" />
        <div className="relative px-8 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-foreground/10 backdrop-blur">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-primary-foreground/80">
                UIDAI Analytics Platform
              </span>
            </div>
            <h1 className="text-4xl font-bold font-display mb-3">
              Aadhaar Insights Dashboard
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl">
              Comprehensive analytics and predictive intelligence for Aadhaar
              enrollment, demographic updates, and biometric lifecycle management
              across India.
            </p>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-primary-foreground/10 backdrop-blur-lg rounded-xl p-4 border border-primary-foreground/20">
              <p className="text-sm text-primary-foreground/70 mb-1">
                Total Enrollments
              </p>
              <p className="text-2xl font-bold font-display">
                {statsLoading ? "..." : formatIndianCompact(stats?.totalEnrollments || 0)}
              </p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-lg rounded-xl p-4 border border-primary-foreground/20">
              <p className="text-sm text-primary-foreground/70 mb-1">
                Coverage Rate
              </p>
              <p className="text-2xl font-bold font-display">
                {statsLoading ? "..." : `${stats?.coveragePercentage}%`}
              </p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-lg rounded-xl p-4 border border-primary-foreground/20">
              <p className="text-sm text-primary-foreground/70 mb-1">
                Active States
              </p>
              <p className="text-2xl font-bold font-display">
                {statsLoading ? "..." : stats?.activeStates}
              </p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-lg rounded-xl p-4 border border-primary-foreground/20">
              <p className="text-sm text-primary-foreground/70 mb-1">
                Active Districts
              </p>
              <p className="text-2xl font-bold font-display">
                {statsLoading ? "..." : stats?.activeDistricts}
              </p>
            </div>
          </div>
          {/* Data Source Indicator */}
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Insights
            </Badge>
            <Badge variant="outline" className="text-xs text-primary-foreground/70 border-primary-foreground/30">
              {stats?.dataSource || "Loading..."}
            </Badge>
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
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Enrollments"
            value={stats?.totalEnrollments || 0}
            change={stats?.enrollmentChange}
            changeLabel="vs last month"
            icon={<Users className="w-5 h-5" />}
            variant="primary"
            loading={statsLoading}
          />
          <StatCard
            title="Demographic Updates"
            value={stats?.totalDemographicUpdates || 0}
            change={stats?.demographicChange}
            changeLabel="vs last month"
            icon={<FileEdit className="w-5 h-5" />}
            variant="accent"
            loading={statsLoading}
          />
          <StatCard
            title="Biometric Updates"
            value={stats?.totalBiometricUpdates || 0}
            change={stats?.biometricChange}
            changeLabel="vs last month"
            icon={<Fingerprint className="w-5 h-5" />}
            variant="success"
            loading={statsLoading}
          />
          <StatCard
            title="Coverage Rate"
            value={`${stats?.coveragePercentage || 0}%`}
            subtitle="of total population"
            icon={<Globe className="w-5 h-5" />}
            variant="default"
            loading={statsLoading}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* India Map */}
          <ChartCard
            title="Geographic Distribution"
            subtitle="Enrollment density by state • Click for AI insights"
            className="lg:col-span-1 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() => setInsightModal({
              open: true,
              title: "Geographic Distribution",
              type: "choropleth-map",
              description: "Enrollment density visualization across Indian states",
              data: mapData,
            })}
          >
            <IndiaMap
              data={mapData}
              onStateClick={setSelectedState}
              selectedState={selectedState}
              colorScale="blue"
            />
          </ChartCard>

          {/* Monthly Trends */}
          <ChartCard
            title="Monthly Activity Trends"
            subtitle="Enrollment & update patterns over 12 months • Click for AI insights"
            className="lg:col-span-2 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() => setInsightModal({
              open: true,
              title: "Monthly Activity Trends",
              type: "area-chart",
              description: "12-month enrollment and update activity patterns",
              data: monthlyTrends,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="updateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => formatIndianCompact(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value.toLocaleString("en-IN"), ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="enrollments"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={2}
                    fill="url(#enrollmentGradient)"
                    name="Enrollments"
                  />
                  <Area
                    type="monotone"
                    dataKey="updates"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2}
                    fill="url(#updateGradient)"
                    name="Updates"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Decision Panel */}
        <DecisionPanel
          insight="High address update volatility detected in urban districts, indicating significant internal migration patterns"
          policyAction="Enable self-service digital address updates via mAadhaar app to reduce enrollment center dependency"
          operationalImpact="↓ 18% enrollment center load, ↑ 35% citizen convenience"
          variant="accent"
        />

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demographic Updates by Field */}
          <ChartCard
            title="Demographic Updates by Field"
            subtitle="Distribution of update types • Click for AI insights"
            className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() => setInsightModal({
              open: true,
              title: "Demographic Updates by Field",
              type: "bar-chart",
              description: "Distribution of demographic update types across all enrollments",
              data: demographicUpdates,
            })}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographicUpdates} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => formatIndianCompact(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="field"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value.toLocaleString("en-IN"), "Updates"]}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {demographicUpdates?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Update Distribution Pie */}
          <ChartCard
            title="Update Type Distribution"
            subtitle="Percentage breakdown of demographic changes"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicUpdates}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="percentage"
                    nameKey="field"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    labelLine={false}
                  >
                    {demographicUpdates?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
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
        </div>

        {/* State Rankings Table */}
        <ChartCard
          title="Top States by Enrollment"
          subtitle="Ranked by total Aadhaar enrollments"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">State</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Total Enrollments</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">0-5 Years</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">5-17 Years</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">18+ Years</th>
                </tr>
              </thead>
              <tbody>
                {enrollmentData
                  ?.sort((a: any, b: any) => (b.total || 0) - (a.total || 0))
                  .slice(0, 10)
                  .map((state: any, index: number) => (
                    <tr
                      key={state.state}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            index < 3
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{state.state}</td>
                      <td className="py-3 px-4 text-right tabular-nums">
                        {(state.total || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                        {(state.age_0_5 || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                        {(state.age_5_17 || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                        {(state.age_18_plus || 0).toLocaleString("en-IN")}
                      </td>
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

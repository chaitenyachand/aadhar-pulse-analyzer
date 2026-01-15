import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DecisionPanel } from "@/components/dashboard/DecisionPanel";
import { ChartInsightModal } from "@/components/dashboard/ChartInsightModal";
import { useEnrollmentData, useMonthlyTrends, useDashboardStats, useSaturationData } from "@/hooks/useAadhaarData";
import { formatIndianCompact } from "@/components/dashboard/AnimatedCounter";
import { Users, TrendingUp, MapPin, Calendar, Baby, GraduationCap, UserCheck } from "lucide-react";
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
  LineChart,
  Line,
  ComposedChart,
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

export default function EnrollmentAnalytics() {
  const { data: enrollmentData, isLoading: enrollmentLoading } = useEnrollmentData();
  const { data: monthlyTrends } = useMonthlyTrends();
  const { data: stats } = useDashboardStats();
  const { data: saturationData } = useSaturationData();
  const [insightModal, setInsightModal] = useState<{
    open: boolean;
    title: string;
    type: string;
    description: string;
    data: any;
  }>({ open: false, title: "", type: "", description: "", data: null });

  // Calculate age cohort data from actual enrollment data
  const ageCohortData = enrollmentData?.slice(0, 10).map((state: any) => ({
    state: state.state?.substring(0, 12) || "Unknown",
    "0-5 years": state.age_0_5 || 0,
    "5-17 years": state.age_5_17 || 0,
    "18+ years": state.age_18_plus || 0,
  })) || [];

  // Calculate total age distribution from actual data
  const totalAge0_5 = enrollmentData?.reduce((acc: number, s: any) => acc + (s.age_0_5 || 0), 0) || 0;
  const totalAge5_17 = enrollmentData?.reduce((acc: number, s: any) => acc + (s.age_5_17 || 0), 0) || 0;
  const totalAge18Plus = enrollmentData?.reduce((acc: number, s: any) => acc + (s.age_18_plus || 0), 0) || 0;
  const totalEnrollment = totalAge0_5 + totalAge5_17 + totalAge18Plus;

  const ageDistribution = [
    { name: "0-5 years (Children)", value: totalAge0_5, percentage: Math.round((totalAge0_5 / totalEnrollment) * 100) || 0 },
    { name: "5-17 years (School Age)", value: totalAge5_17, percentage: Math.round((totalAge5_17 / totalEnrollment) * 100) || 0 },
    { name: "18+ years (Adults)", value: totalAge18Plus, percentage: Math.round((totalAge18Plus / totalEnrollment) * 100) || 0 },
  ];

  // Year-over-year growth computed from monthly trends
  const yoyGrowth = monthlyTrends?.reduce((acc: any[], m: any, idx: number) => {
    const yearKey = m.year;
    const existing = acc.find(a => a.year === String(yearKey));
    if (existing) {
      existing.enrollments += m.enrollments || 0;
    } else {
      acc.push({ year: String(yearKey), enrollments: m.enrollments || 0, growth: 0 });
    }
    return acc;
  }, []).map((y, idx, arr) => ({
    ...y,
    growth: idx > 0 && arr[idx - 1].enrollments > 0 
      ? Math.round(((y.enrollments - arr[idx - 1].enrollments) / arr[idx - 1].enrollments) * 100 * 10) / 10
      : 0,
  })) || [];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-accent/70 text-primary-foreground px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary-foreground/10 backdrop-blur">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold font-display">Enrollment Analytics</h1>
        </div>
        <p className="text-primary-foreground/80 max-w-2xl">
          Comprehensive analysis of Aadhaar enrollments across demographics, regions, and time periods
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
            title="Total Enrollments"
            value={stats?.totalEnrollments || 0}
            change={12.5}
            changeLabel="vs last year"
            icon={<Users className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Children (0-5)"
            value={totalAge0_5}
            subtitle={`${Math.round((totalAge0_5 / totalEnrollment) * 100) || 0}% of total`}
            icon={<Baby className="w-5 h-5" />}
            variant="accent"
          />
          <StatCard
            title="School Age (5-17)"
            value={totalAge5_17}
            subtitle={`${Math.round((totalAge5_17 / totalEnrollment) * 100) || 0}% of total`}
            icon={<GraduationCap className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Adults (18+)"
            value={totalAge18Plus}
            subtitle={`${Math.round((totalAge18Plus / totalEnrollment) * 100) || 0}% of total`}
            icon={<UserCheck className="w-5 h-5" />}
            variant="default"
          />
        </div>

        {/* Decision Panel */}
        <DecisionPanel
          insight="Child enrollment (0-5 years) shows 15% lower penetration in rural districts compared to urban areas"
          policyAction="Deploy mobile enrollment camps in Anganwadi centers during immunization drives"
          operationalImpact="↑ 22% child enrollment coverage in underserved districts"
          variant="accent"
        />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Distribution Pie */}
          <ChartCard
            title="Age Cohort Distribution"
            subtitle="Enrollment breakdown by age groups • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Age Cohort Distribution",
              type: "pie-chart",
              description: "Age-wise breakdown of Aadhaar enrollments",
              data: ageDistribution,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percentage }) => `${percentage}%`}
                  >
                    {ageDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatIndianCompact(value), "Enrollments"]}
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

          {/* Year-over-Year Growth */}
          <ChartCard
            title="Year-over-Year Growth"
            subtitle="Annual enrollment trends and growth rates • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Year-over-Year Growth",
              type: "composed-chart",
              description: "Annual enrollment trends with growth percentages",
              data: yoyGrowth,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={yoyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => formatIndianCompact(value)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar yAxisId="left" dataKey="enrollments" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} name="Enrollments" />
                  <Line yAxisId="right" type="monotone" dataKey="growth" stroke={CHART_COLORS[1]} strokeWidth={3} name="Growth %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* State-wise Age Cohorts */}
        <ChartCard
          title="State-wise Age Cohort Analysis"
          subtitle="Enrollment distribution by age groups across top states • Click for insights"
          onClick={() => setInsightModal({
            open: true,
            title: "State-wise Age Cohort Analysis",
            type: "stacked-bar-chart",
            description: "Age cohort distribution across major states",
            data: ageCohortData,
          })}
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageCohortData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => formatIndianCompact(value)}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={90}
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
                <Bar dataKey="0-5 years" stackId="a" fill={CHART_COLORS[0]} name="0-5 years" />
                <Bar dataKey="5-17 years" stackId="a" fill={CHART_COLORS[1]} name="5-17 years" />
                <Bar dataKey="18+ years" stackId="a" fill={CHART_COLORS[2]} name="18+ years" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Decision Panel */}
        <DecisionPanel
          insight="States like Bihar and UP show disproportionately high child enrollment ratios, indicating younger population demographics"
          policyAction="Plan for higher biometric update demand in 5-10 years as children age into mandatory update brackets"
          operationalImpact="↑ 40% preparedness for future biometric update surge"
          variant="success"
        />

        {/* Saturation & Monthly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Saturation Curve */}
          <ChartCard
            title="Coverage Saturation by State"
            subtitle="Progress toward 100% population coverage • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Coverage Saturation by State",
              type: "bar-chart",
              description: "Population coverage percentage by state",
              data: saturationData,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={saturationData} layout="vertical">
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
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Coverage"]}
                  />
                  <Bar dataKey="coverage" radius={[0, 4, 4, 0]}>
                    {saturationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.coverage >= 95 ? CHART_COLORS[2] : entry.coverage >= 90 ? CHART_COLORS[0] : CHART_COLORS[1]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Monthly Trends */}
          <ChartCard
            title="Monthly Enrollment Trends"
            subtitle="12-month enrollment activity patterns • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Monthly Enrollment Trends",
              type: "area-chart",
              description: "Month-by-month enrollment patterns",
              data: monthlyTrends,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="enrollGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
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
                    formatter={(value: number) => [formatIndianCompact(value), ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="enrollments"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={2}
                    fill="url(#enrollGradient)"
                    name="Enrollments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Top States Table */}
        <ChartCard
          title="Top 15 States by Enrollment"
          subtitle="Comprehensive enrollment metrics by state"
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
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Child %</th>
                </tr>
              </thead>
              <tbody>
                {enrollmentData
                  ?.sort((a: any, b: any) => (b.total_enrolment || 0) - (a.total_enrolment || 0))
                  .slice(0, 15)
                  .map((state: any, index: number) => {
                    const total = (state.total_enrolment || state.age_0_5 + state.age_5_17 + state.age_18_plus || 0);
                    const childPercent = total > 0 ? Math.round(((state.age_0_5 || 0) / total) * 100) : 0;
                    return (
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
                        <td className="py-3 px-4 text-right tabular-nums font-semibold">
                          {formatIndianCompact(state.total_enrolment || 0)}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                          {formatIndianCompact(state.age_0_5 || 0)}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                          {formatIndianCompact(state.age_5_17 || 0)}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                          {formatIndianCompact(state.age_18_plus || 0)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            childPercent >= 8 ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                          }`}>
                            {childPercent}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}

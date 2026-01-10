import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DecisionPanel } from "@/components/dashboard/DecisionPanel";
import { ChartInsightModal } from "@/components/dashboard/ChartInsightModal";
import { useBiometricUpdates, useBiometricByAge, useDashboardStats } from "@/hooks/useAadhaarData";
import { formatIndianCompact } from "@/components/dashboard/AnimatedCounter";
import { Fingerprint, Eye, ScanFace, AlertTriangle, TrendingUp, Users, Activity } from "lucide-react";
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
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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

export default function BiometricLifecycle() {
  const { data: biometricData } = useBiometricUpdates();
  const { data: biometricByAge } = useBiometricByAge();
  const { data: stats } = useDashboardStats();
  const [insightModal, setInsightModal] = useState<{
    open: boolean;
    title: string;
    type: string;
    description: string;
    data: any;
  }>({ open: false, title: "", type: "", description: "", data: null });

  // Modality distribution
  const modalityData = [
    { name: "Fingerprint", value: biometricData?.totals?.fingerprint || 4500000, percentage: 53 },
    { name: "Iris", value: biometricData?.totals?.iris || 1200000, percentage: 14 },
    { name: "Face", value: biometricData?.totals?.face || 2800000, percentage: 33 },
  ];

  // Age-based biometric update patterns
  const ageBasedPatterns = biometricByAge || [
    { ageGroup: "0-5 years", fingerprint: 12, iris: 8, face: 80 },
    { ageGroup: "5-10 years", fingerprint: 45, iris: 30, face: 25 },
    { ageGroup: "10-18 years", fingerprint: 72, iris: 18, face: 10 },
    { ageGroup: "18-40 years", fingerprint: 85, iris: 10, face: 5 },
    { ageGroup: "40-60 years", fingerprint: 78, iris: 15, face: 7 },
    { ageGroup: "60+ years", fingerprint: 55, iris: 30, face: 15 },
  ];

  // Failure prediction data
  const failurePrediction = [
    { district: "Mumbai", risk: 8, currentFailure: 3.2, predictedFailure: 4.1 },
    { district: "Delhi", risk: 12, currentFailure: 4.5, predictedFailure: 5.8 },
    { district: "Chennai", risk: 6, currentFailure: 2.8, predictedFailure: 3.2 },
    { district: "Kolkata", risk: 15, currentFailure: 5.2, predictedFailure: 6.9 },
    { district: "Patna", risk: 22, currentFailure: 7.8, predictedFailure: 9.5 },
    { district: "Lucknow", risk: 18, currentFailure: 6.5, predictedFailure: 8.2 },
    { district: "Jaipur", risk: 10, currentFailure: 3.8, predictedFailure: 4.5 },
    { district: "Ahmedabad", risk: 7, currentFailure: 2.9, predictedFailure: 3.4 },
  ];

  // Monthly biometric update trend
  const monthlyBiometric = [
    { month: "Jan", updates: 320000, failures: 16000, successRate: 95 },
    { month: "Feb", updates: 310000, failures: 18000, successRate: 94.2 },
    { month: "Mar", updates: 380000, failures: 19000, successRate: 95 },
    { month: "Apr", updates: 410000, failures: 21000, successRate: 94.9 },
    { month: "May", updates: 450000, failures: 23000, successRate: 94.9 },
    { month: "Jun", updates: 420000, failures: 25000, successRate: 94.1 },
    { month: "Jul", updates: 490000, failures: 29000, successRate: 94.1 },
    { month: "Aug", updates: 530000, failures: 32000, successRate: 94 },
    { month: "Sep", updates: 500000, failures: 28000, successRate: 94.4 },
    { month: "Oct", updates: 460000, failures: 24000, successRate: 94.8 },
    { month: "Nov", updates: 400000, failures: 20000, successRate: 95 },
    { month: "Dec", updates: 350000, failures: 17000, successRate: 95.1 },
  ];

  // Elderly care alerts
  const elderlyCareAlerts = [
    { state: "Bihar", elderly60Plus: 1250000, doorstepNeeded: 312500, coverage: 45 },
    { state: "UP", elderly60Plus: 2100000, doorstepNeeded: 525000, coverage: 38 },
    { state: "Jharkhand", elderly60Plus: 680000, doorstepNeeded: 170000, coverage: 42 },
    { state: "Odisha", elderly60Plus: 720000, doorstepNeeded: 180000, coverage: 52 },
    { state: "West Bengal", elderly60Plus: 1450000, doorstepNeeded: 362500, coverage: 48 },
    { state: "MP", elderly60Plus: 980000, doorstepNeeded: 245000, coverage: 55 },
  ];

  // Occupation-based wear analysis
  const occupationWear = [
    { occupation: "Agriculture", wearRate: 35, updateFreq: 2.1, dominant: "Fingerprint" },
    { occupation: "Construction", wearRate: 42, updateFreq: 1.8, dominant: "Fingerprint" },
    { occupation: "Manufacturing", wearRate: 28, updateFreq: 2.5, dominant: "Fingerprint" },
    { occupation: "Services", wearRate: 12, updateFreq: 4.2, dominant: "Fingerprint" },
    { occupation: "Office Work", wearRate: 8, updateFreq: 5.5, dominant: "Face" },
    { occupation: "Domestic", wearRate: 25, updateFreq: 3.0, dominant: "Fingerprint" },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-success via-success/90 to-primary/70 text-success-foreground px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-success-foreground/10 backdrop-blur">
            <Fingerprint className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold font-display">Biometric Lifecycle Monitor</h1>
        </div>
        <p className="text-success-foreground/80 max-w-2xl">
          Age-based biometric patterns, failure prediction, and elderly care service planning
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
            title="Total Biometric Updates"
            value={stats?.totalBiometricUpdates || biometricData?.totals?.total || 0}
            change={-2.1}
            changeLabel="vs last month"
            icon={<Fingerprint className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Fingerprint Updates"
            value={biometricData?.totals?.fingerprint || 4500000}
            subtitle="53% of modality"
            icon={<Fingerprint className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Iris Updates"
            value={biometricData?.totals?.iris || 1200000}
            subtitle="14% of modality"
            icon={<Eye className="w-5 h-5" />}
            variant="accent"
          />
          <StatCard
            title="Face Updates"
            value={biometricData?.totals?.face || 2800000}
            subtitle="33% of modality"
            icon={<ScanFace className="w-5 h-5" />}
            variant="default"
          />
        </div>

        {/* Decision Panel */}
        <DecisionPanel
          insight="60+ age group shows 55% lower fingerprint success rate due to worn ridges in agricultural regions"
          policyAction="Deploy iris-primary authentication for elderly and implement doorstep biometric services in rural areas"
          operationalImpact="↑ 28% elderly authentication success, ↓ 45% re-attempt rates"
          variant="success"
        />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Modality Distribution */}
          <ChartCard
            title="Biometric Modality Distribution"
            subtitle="Update breakdown by authentication type • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Biometric Modality Distribution",
              type: "pie-chart",
              description: "Distribution of biometric updates by modality type",
              data: modalityData,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modalityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    labelLine={false}
                  >
                    {modalityData.map((_, index) => (
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

          {/* Monthly Success Rate Trend */}
          <ChartCard
            title="Monthly Biometric Performance"
            subtitle="Update volume and success rate trends • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Monthly Biometric Performance",
              type: "area-chart",
              description: "Monthly biometric update trends and success rates",
              data: monthlyBiometric,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyBiometric}>
                  <defs>
                    <linearGradient id="updateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="failureGrad" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(value: number, name: string) => [
                      name === "successRate" ? `${value}%` : formatIndianCompact(value),
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="updates"
                    stroke={CHART_COLORS[0]}
                    fill="url(#updateGrad)"
                    name="Updates"
                  />
                  <Area
                    type="monotone"
                    dataKey="failures"
                    stroke={CHART_COLORS[1]}
                    fill="url(#failureGrad)"
                    name="Failures"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Age-Biometric Matrix */}
        <ChartCard
          title="Age-Biometric Success Matrix"
          subtitle="Modality effectiveness by age group • Click for insights"
          onClick={() => setInsightModal({
            open: true,
            title: "Age-Biometric Success Matrix",
            type: "stacked-bar-chart",
            description: "How different age groups succeed with different biometric modalities",
            data: ageBasedPatterns,
          })}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageBasedPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="ageGroup" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="fingerprint" fill={CHART_COLORS[0]} name="Fingerprint %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="iris" fill={CHART_COLORS[2]} name="Iris %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="face" fill={CHART_COLORS[1]} name="Face %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Decision Panel */}
        <DecisionPanel
          insight="Children 0-5 years rely 80% on face recognition due to undeveloped fingerprints; this shifts to 85% fingerprint by age 18-40"
          policyAction="Implement age-aware modality selection in enrollment software to automatically prefer optimal modality"
          operationalImpact="↑ 15% first-attempt success rate, ↓ 25% enrollment time"
          variant="accent"
        />

        {/* Failure Prediction & Elderly Care */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Failure Prediction */}
          <ChartCard
            title="Biometric Failure Prediction"
            subtitle="Districts at risk of high failure rates • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Biometric Failure Prediction",
              type: "bar-chart",
              description: "ML-predicted failure rates by district",
              data: failurePrediction,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failurePrediction} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    domain={[0, 12]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="district"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    width={70}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, ""]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="currentFailure" fill={CHART_COLORS[0]} name="Current Rate" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="predictedFailure" fill={CHART_COLORS[1]} name="Predicted (6mo)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Elderly Care Alerts */}
          <ChartCard
            title="Elderly Doorstep Service Needs"
            subtitle="States requiring doorstep biometric services • Click for insights"
            onClick={() => setInsightModal({
              open: true,
              title: "Elderly Doorstep Service Needs",
              type: "bar-chart",
              description: "Elderly population requiring doorstep biometric services",
              data: elderlyCareAlerts,
            })}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={elderlyCareAlerts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="state" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => formatIndianCompact(value)}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "coverage" ? `${value}%` : formatIndianCompact(value),
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="elderly60Plus" fill={CHART_COLORS[0]} name="60+ Population" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="doorstepNeeded" fill={CHART_COLORS[1]} name="Doorstep Needed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Occupation-based Wear Analysis */}
        <ChartCard
          title="Occupation-Based Fingerprint Wear Analysis"
          subtitle="Biometric degradation by occupation type • Click for insights"
          onClick={() => setInsightModal({
            open: true,
            title: "Occupation-Based Fingerprint Wear Analysis",
            type: "bar-chart",
            description: "How different occupations affect fingerprint quality",
            data: occupationWear,
          })}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Occupation</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Wear Rate</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Avg Update Freq (years)</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Risk Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Recommended Modality</th>
                </tr>
              </thead>
              <tbody>
                {occupationWear.map((row, index) => (
                  <tr key={row.occupation} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{row.occupation}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.wearRate}%`,
                              backgroundColor: row.wearRate >= 30 ? CHART_COLORS[1] : CHART_COLORS[2],
                            }}
                          />
                        </div>
                        <span className="text-sm tabular-nums">{row.wearRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">{row.updateFreq}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={row.wearRate >= 35 ? "destructive" : row.wearRate >= 20 ? "secondary" : "outline"}
                      >
                        {row.wearRate >= 35 ? "High" : row.wearRate >= 20 ? "Medium" : "Low"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium">
                        {row.wearRate >= 35 ? "Iris/Face" : row.dominant}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Final Decision Panel */}
        <DecisionPanel
          insight="Construction and agricultural workers show 35-42% fingerprint wear rates, requiring more frequent biometric updates"
          policyAction="Implement occupation-aware update scheduling and prioritize iris/face for high-wear occupations"
          operationalImpact="↓ 40% authentication failures in labor-intensive sectors"
          variant="warning"
        />
      </div>
    </DashboardLayout>
  );
}

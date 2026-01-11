import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePdfExport } from "@/hooks/usePdfExport";
import { useDashboardStats, useEnrollmentData, useDemographicUpdates } from "@/hooks/useAadhaarData";
import { toast } from "@/hooks/use-toast";
import {
  FileDown,
  FileText,
  Table,
  BarChart3,
  Printer,
  CheckCircle,
  Loader2,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
} from "lucide-react";

const reportTypes = [
  {
    id: "executive",
    title: "Executive Summary",
    description: "High-level overview with key metrics and AI insights",
    icon: FileText,
    estimatedPages: "2-3 pages",
  },
  {
    id: "enrollment",
    title: "Enrollment Analytics Report",
    description: "Detailed state-wise enrollment data and trends",
    icon: Users,
    estimatedPages: "5-8 pages",
  },
  {
    id: "demographic",
    title: "Demographic Updates Report",
    description: "Update patterns, field-wise breakdown, and analysis",
    icon: Table,
    estimatedPages: "4-6 pages",
  },
  {
    id: "predictions",
    title: "Predictive Analytics Report",
    description: "ML forecasts, confidence intervals, and recommendations",
    icon: TrendingUp,
    estimatedPages: "6-10 pages",
  },
  {
    id: "comprehensive",
    title: "Comprehensive Report",
    description: "Full analytics report with all sections included",
    icon: BarChart3,
    estimatedPages: "15-20 pages",
  },
];

const includeSections = [
  { id: "charts", label: "Include Charts & Visualizations" },
  { id: "tables", label: "Include Data Tables" },
  { id: "insights", label: "Include AI-Generated Insights" },
  { id: "recommendations", label: "Include Policy Recommendations" },
];

export default function ExportReport() {
  const { exportToPdf, isExporting } = usePdfExport();
  const { data: dashboardStats } = useDashboardStats();
  const { data: enrollmentData } = useEnrollmentData();
  const { data: demographicData } = useDemographicUpdates();

  const [selectedReport, setSelectedReport] = useState("executive");
  const [selectedSections, setSelectedSections] = useState<string[]>(["charts", "tables", "insights"]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    );
  };

  const handleExport = async () => {
    const reportConfig = reportTypes.find((r) => r.id === selectedReport);
    if (!reportConfig) return;

    try {
      const exportData = {
        stats: dashboardStats
          ? {
              "Total Enrollments": dashboardStats.totalEnrollments,
              "Coverage %": `${dashboardStats.coveragePercentage}%`,
              "Active States": dashboardStats.activeStates,
              "Data Source": dashboardStats.dataSource,
            }
          : null,
        tableData: enrollmentData?.slice(0, 10),
        insights: selectedSections.includes("insights")
          ? [
              "Enrollment trends show consistent growth with 12.5% YoY increase",
              "Southern states lead in digital inclusion metrics",
              "Biometric update demand expected to surge 47% in next 6 months",
            ]
          : null,
      };

      await exportToPdf(
        {
          title: reportConfig.title,
          subtitle: `Generated from Aadhaar Analytics Platform`,
          includeCharts: selectedSections.includes("charts"),
          includeData: selectedSections.includes("tables"),
          orientation,
        },
        exportData
      );

      toast({
        title: "Report Generated",
        description: "Your PDF report is ready for download",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not generate the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative px-8 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileDown className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Phase 4: Export & Reporting</span>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">Export Reports</h1>
          <p className="text-muted-foreground max-w-2xl">
            Generate professional PDF reports with customizable sections. Include charts,
            data tables, and AI-generated insights.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Type Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Select Report Type
                </CardTitle>
                <CardDescription>Choose the type of report you want to generate</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedReport} onValueChange={setSelectedReport}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTypes.map((report) => {
                      const Icon = report.icon;
                      const isSelected = selectedReport === report.id;

                      return (
                        <div
                          key={report.id}
                          className={`relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedReport(report.id)}
                        >
                          <RadioGroupItem value={report.id} id={report.id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4 text-primary" />
                              <Label htmlFor={report.id} className="font-medium cursor-pointer">
                                {report.title}
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {report.estimatedPages}
                            </Badge>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-primary absolute top-4 right-4" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Include Sections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="w-5 h-5" />
                  Include Sections
                </CardTitle>
                <CardDescription>Customize what content to include in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {includeSections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={section.id}
                        checked={selectedSections.includes(section.id)}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                      />
                      <Label htmlFor={section.id} className="cursor-pointer flex-1">
                        {section.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Orientation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="w-5 h-5" />
                  Page Orientation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={orientation}
                  onValueChange={(v) => setOrientation(v as "portrait" | "landscape")}
                  className="flex gap-4"
                >
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      orientation === "portrait" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setOrientation("portrait")}
                  >
                    <RadioGroupItem value="portrait" id="portrait" />
                    <div className="w-8 h-12 border-2 border-current rounded" />
                    <Label htmlFor="portrait" className="cursor-pointer">
                      Portrait
                    </Label>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      orientation === "landscape" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setOrientation("landscape")}
                  >
                    <RadioGroupItem value="landscape" id="landscape" />
                    <div className="w-12 h-8 border-2 border-current rounded" />
                    <Label htmlFor="landscape" className="cursor-pointer">
                      Landscape
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Export Preview & Actions */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Export Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-[3/4] bg-gradient-to-b from-muted/50 to-muted rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center p-6 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h4 className="font-semibold mb-1">
                    {reportTypes.find((r) => r.id === selectedReport)?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {reportTypes.find((r) => r.id === selectedReport)?.estimatedPages}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Orientation</span>
                    <span className="font-medium capitalize">{orientation}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Sections</span>
                    <span className="font-medium">{selectedSections.length} selected</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Format</span>
                    <Badge variant="outline">PDF</Badge>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={handleExport} disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4 mr-2" />
                      Generate PDF Report
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Report will open in a new tab for printing/saving
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Report Data Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {dashboardStats?.totalEnrollments?.toLocaleString("en-IN") || "Loading..."}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Enrollments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{dashboardStats?.activeStates || "Loading..."}</p>
                    <p className="text-xs text-muted-foreground">Active States</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Calendar className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">Report Date</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BookOpen,
  Code,
  Database,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  Users,
  BarChart3,
  Shield,
  Brain,
  FileText,
  Map,
  Wifi,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const modules = [
  {
    title: "Dashboard",
    icon: BarChart3,
    path: "/",
    description: "Main overview with key metrics, trends, and quick stats",
    features: ["Real-time statistics", "Monthly trend charts", "Top states ranking", "AI decision panels"],
  },
  {
    title: "Enrollment Analytics",
    icon: Users,
    path: "/enrollment",
    description: "Detailed enrollment data analysis by state, age, and gender",
    features: ["Age-wise distribution", "Gender breakdown", "State comparison", "Time-series trends"],
  },
  {
    title: "Demographic Updates",
    icon: FileText,
    path: "/demographic",
    description: "Track demographic field updates across all categories",
    features: ["Field-wise breakdown", "Update trends", "Regional patterns", "Peak time analysis"],
  },
  {
    title: "Biometric Lifecycle",
    icon: Fingerprint,
    path: "/biometric",
    description: "Biometric data management and success rate tracking",
    features: ["Modality comparison", "Age-based success rates", "Update frequency", "Quality metrics"],
  },
  {
    title: "Migration Corridors",
    icon: Map,
    path: "/migration",
    description: "AI-detected migration patterns using address update analysis",
    features: ["Sankey flow diagrams", "Source-destination mapping", "Confidence scoring", "Corridor rankings"],
  },
  {
    title: "Digital Inclusion",
    icon: Wifi,
    path: "/digital-inclusion",
    description: "Digital Inclusion Index measuring accessibility metrics",
    features: ["Composite DII score", "Component breakdown", "State rankings", "Gap analysis"],
  },
  {
    title: "Anomaly Detection",
    icon: AlertTriangle,
    path: "/anomalies",
    description: "Real-time detection of unusual patterns and trust warnings",
    features: ["Live alerts", "Trust erosion tracking", "Biometric aging model", "Welfare correlation"],
  },
  {
    title: "Predictions",
    icon: TrendingUp,
    path: "/predictions",
    description: "ML-powered forecasting for enrollment and resource planning",
    features: ["ARIMA forecasting", "Confidence intervals", "Resource demand", "Saturation timelines"],
  },
];

const faqs = [
  {
    question: "What data sources power this platform?",
    answer:
      "The platform uses a combination of live API data from UIDAI enrollment centers, aggregated database records, and sample data for demonstration. The data source indicator in the dashboard shows which source is currently active.",
  },
  {
    question: "How are AI insights generated?",
    answer:
      "AI insights are generated using large language models (Google Gemini) that analyze chart data and provide contextual policy recommendations. Click on any chart to get AI-powered insights specific to that visualization.",
  },
  {
    question: "What does the Digital Inclusion Index measure?",
    answer:
      "The DII is a composite score (0-100) measuring: Mobile penetration, Enrollment accessibility, Biometric success rate, and Age-weighted adoption. Higher scores indicate better digital inclusion in that region.",
  },
  {
    question: "How accurate are the prediction models?",
    answer:
      "The ARIMA time-series models achieve ~94% accuracy (R² score: 0.942) based on historical validation. Predictions include 95% confidence intervals to indicate uncertainty ranges.",
  },
  {
    question: "Can I export data for external analysis?",
    answer:
      "Yes! Use the Export Report feature to generate PDF reports with customizable sections. You can include charts, data tables, and AI insights. Reports can be printed or saved as PDF.",
  },
  {
    question: "What triggers anomaly alerts?",
    answer:
      "Anomaly detection monitors for: Enrollment spikes (>30% deviation), Biometric failure rate increases, Trust score degradation, and Unusual update patterns. Alerts are classified as High, Medium, or Low priority.",
  },
];

const technicalSpecs = [
  { label: "Frontend Framework", value: "React 18 + TypeScript" },
  { label: "UI Components", value: "shadcn/ui + Tailwind CSS" },
  { label: "Charts", value: "Recharts" },
  { label: "Backend", value: "Supabase Edge Functions" },
  { label: "Database", value: "PostgreSQL (Supabase)" },
  { label: "AI Integration", value: "Google Gemini via Lovable AI" },
  { label: "State Management", value: "TanStack Query" },
  { label: "Routing", value: "React Router v6" },
];

export default function Documentation() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-success/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative px-8 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Phase 4: Documentation</span>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">Documentation & Help</h1>
          <p className="text-muted-foreground max-w-2xl">
            Comprehensive guide to the Aadhaar Analytics Platform. Learn about features,
            data sources, and how to interpret the insights.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Data Sources</p>
                <p className="text-xs text-muted-foreground">API & Database</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm">AI Features</p>
                <p className="text-xs text-muted-foreground">Insights & Predictions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm">Security</p>
                <p className="text-xs text-muted-foreground">Data Protection</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Code className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-sm">Technical</p>
                <p className="text-xs text-muted-foreground">Architecture</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Platform Modules
            </CardTitle>
            <CardDescription>Overview of all analytics modules and their features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Link
                    key={module.path}
                    to={module.path}
                    className="group flex gap-4 p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 h-fit group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{module.title}</h4>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {module.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Technical Specs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Technical Specifications
              </CardTitle>
              <CardDescription>Technology stack and architecture details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technicalSpecs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    <Badge variant="outline">{spec.value}</Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                <h4 className="font-semibold mb-2">Data Flow Architecture</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Data flows from UIDAI enrollment centers → Edge Functions → PostgreSQL →
                  React Frontend → User Dashboard
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="px-2 py-1 rounded bg-primary/10 text-primary">API</div>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <div className="px-2 py-1 rounded bg-success/10 text-success">Edge Fn</div>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <div className="px-2 py-1 rounded bg-accent/10 text-accent">DB</div>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <div className="px-2 py-1 rounded bg-warning/10 text-warning">UI</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 rounded-xl bg-primary/10">
                <Fingerprint className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Getting Started with Aadhaar Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Start by exploring the main dashboard to get an overview of key metrics. Click on any
                  chart to get AI-powered insights. Use the sidebar to navigate between different
                  analytics modules.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/export">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Report
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

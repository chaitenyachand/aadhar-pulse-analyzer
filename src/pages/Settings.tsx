import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Bell,
  Database,
  Palette,
  RefreshCw,
  Monitor,
  Shield,
  Download,
  Zap,
  Globe,
  Check,
} from "lucide-react";
import { useConnectionStatus, useManualRefresh } from "@/hooks/useRealtimeData";
import { toast } from "@/hooks/use-toast";
import { motion, Variants } from "framer-motion";
import { MotionCard, staggerContainer, fadeInUp } from "@/components/animations/PageTransition";

interface UserPreferences {
  theme: "light" | "dark" | "system";
  accentColor: "blue" | "saffron" | "green" | "purple";
  animations: boolean;
  realtimeUpdates: boolean;
  refreshInterval: number;
  notifications: {
    anomalyAlerts: boolean;
    weeklyReports: boolean;
    systemUpdates: boolean;
    emailDigest: boolean;
  };
  display: {
    compactMode: boolean;
    showWelcome: boolean;
    defaultPage: string;
    chartAnimations: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  accentColor: "blue",
  animations: true,
  realtimeUpdates: true,
  refreshInterval: 30,
  notifications: {
    anomalyAlerts: true,
    weeklyReports: true,
    systemUpdates: false,
    emailDigest: false,
  },
  display: {
    compactMode: false,
    showWelcome: true,
    defaultPage: "/",
    chartAnimations: true,
  },
};

const accentColors = [
  { id: "blue", name: "Aadhaar Blue", color: "hsl(207, 90%, 45%)" },
  { id: "saffron", name: "Saffron", color: "hsl(24, 95%, 53%)" },
  { id: "green", name: "India Green", color: "hsl(145, 76%, 35%)" },
  { id: "purple", name: "Digital Purple", color: "hsl(262, 52%, 47%)" },
];

export default function Settings() {
  const connectionStatus = useConnectionStatus();
  const { refreshAll, isRefreshing } = useManualRefresh();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("aadhaar-dashboard-preferences");
    if (saved) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to load preferences:", e);
      }
    }
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === "dark") {
      root.classList.add("dark");
    } else if (preferences.theme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [preferences.theme]);

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("aadhaar-dashboard-preferences", JSON.stringify(preferences));
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (e) {
      toast({
        title: "Save Failed",
        description: "Could not save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem("aadhaar-dashboard-preferences");
    toast({
      title: "Settings Reset",
      description: "All preferences have been restored to defaults.",
    });
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const updateNestedPreference = <K extends keyof UserPreferences>(
    key: K,
    nestedKey: string,
    value: any
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] as any),
        [nestedKey]: value,
      },
    }));
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative px-8 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <SettingsIcon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Configuration</span>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">Settings</h1>
          <p className="text-muted-foreground max-w-2xl">
            Customize your dashboard experience, manage notifications, and configure data preferences.
          </p>

          {/* Connection Status */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-success animate-pulse"
                    : connectionStatus === "connecting"
                    ? "bg-warning animate-pulse"
                    : "bg-destructive"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {connectionStatus === "connected"
                  ? "Real-time connected"
                  : connectionStatus === "connecting"
                  ? "Connecting..."
                  : "Disconnected"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAll}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <motion.div
        className="p-8"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="w-4 h-4 mr-2" />
              Data
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Shield className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <motion.div variants={fadeInUp} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Theme
                  </CardTitle>
                  <CardDescription>
                    Choose how the dashboard looks to you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    {[
                      { id: "light", icon: Sun, label: "Light" },
                      { id: "dark", icon: Moon, label: "Dark" },
                      { id: "system", icon: Monitor, label: "System" },
                    ].map(({ id, icon: Icon, label }) => (
                      <button
                        key={id}
                        onClick={() => updatePreference("theme", id as any)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          preferences.theme === id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{label}</span>
                        {preferences.theme === id && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Accent Color</Label>
                    <div className="flex gap-3">
                      {accentColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => updatePreference("accentColor", color.id as any)}
                          className={`relative w-12 h-12 rounded-full transition-transform ${
                            preferences.accentColor === color.id
                              ? "ring-2 ring-offset-2 ring-foreground scale-110"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        >
                          {preferences.accentColor === color.id && (
                            <Check className="absolute inset-0 m-auto w-5 h-5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and micro-interactions
                      </p>
                    </div>
                    <Switch
                      checked={preferences.animations}
                      onCheckedChange={(checked) => updatePreference("animations", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Chart Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Animate charts when they appear or update
                      </p>
                    </div>
                    <Switch
                      checked={preferences.display.chartAnimations}
                      onCheckedChange={(checked) =>
                        updateNestedPreference("display", "chartAnimations", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing for more data density
                      </p>
                    </div>
                    <Switch
                      checked={preferences.display.compactMode}
                      onCheckedChange={(checked) =>
                        updateNestedPreference("display", "compactMode", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div variants={fadeInUp} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control which notifications you receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        Anomaly Alerts
                        <Badge variant="destructive" className="text-xs">Critical</Badge>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when unusual patterns are detected
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.anomalyAlerts}
                      onCheckedChange={(checked) =>
                        updateNestedPreference("notifications", "anomalyAlerts", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of key metrics
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        updateNestedPreference("notifications", "weeklyReports", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify about new features and improvements
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.systemUpdates}
                      onCheckedChange={(checked) =>
                        updateNestedPreference("notifications", "systemUpdates", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive daily email summary of activities
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.emailDigest}
                      onCheckedChange={(checked) =>
                        updateNestedPreference("notifications", "emailDigest", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <motion.div variants={fadeInUp} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Real-time Updates
                  </CardTitle>
                  <CardDescription>
                    Configure live data streaming preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Real-time Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically refresh data when changes occur
                      </p>
                    </div>
                    <Switch
                      checked={preferences.realtimeUpdates}
                      onCheckedChange={(checked) => updatePreference("realtimeUpdates", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Auto-refresh Interval</Label>
                    <Select
                      value={preferences.refreshInterval.toString()}
                      onValueChange={(value) => updatePreference("refreshInterval", parseInt(value))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">Every 15 seconds</SelectItem>
                        <SelectItem value="30">Every 30 seconds</SelectItem>
                        <SelectItem value="60">Every minute</SelectItem>
                        <SelectItem value="300">Every 5 minutes</SelectItem>
                        <SelectItem value="0">Manual only</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How often to check for new data (in addition to real-time)
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Default Landing Page</Label>
                    <Select
                      value={preferences.display.defaultPage}
                      onValueChange={(value) => updateNestedPreference("display", "defaultPage", value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/">Dashboard</SelectItem>
                        <SelectItem value="/enrollment">Enrollment Analytics</SelectItem>
                        <SelectItem value="/demographic">Demographic Updates</SelectItem>
                        <SelectItem value="/biometric">Biometric Lifecycle</SelectItem>
                        <SelectItem value="/migration">Migration Corridors</SelectItem>
                        <SelectItem value="/anomalies">Anomaly Detection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Settings
                  </CardTitle>
                  <CardDescription>
                    Configure default export options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Include Timestamps</Label>
                      <p className="text-sm text-muted-foreground">
                        Add generation timestamp to exports
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High Resolution Charts</Label>
                      <p className="text-sm text-muted-foreground">
                        Export charts at 2x resolution for print
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <motion.div variants={fadeInUp} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Localization
                  </CardTitle>
                  <CardDescription>
                    Language and regional settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Number Format</Label>
                    <Select defaultValue="indian">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indian">Indian (₹1,00,000)</SelectItem>
                        <SelectItem value="international">International (100,000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Date Format</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Shield className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div className="space-y-0.5">
                      <Label>Reset All Settings</Label>
                      <p className="text-sm text-muted-foreground">
                        Restore all preferences to default values
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={resetPreferences}>
                      Reset
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div className="space-y-0.5">
                      <Label>Clear Cached Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Remove all locally stored data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        localStorage.clear();
                        toast({
                          title: "Cache Cleared",
                          description: "All local data has been removed.",
                        });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <motion.div
          className="flex justify-end gap-4 mt-8 pt-6 border-t border-border"
          variants={fadeInUp}
        >
          <Button variant="outline" onClick={resetPreferences}>
            Reset to Defaults
          </Button>
          <Button onClick={savePreferences} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

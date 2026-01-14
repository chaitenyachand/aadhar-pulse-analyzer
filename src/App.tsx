import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EnrollmentAnalytics from "./pages/EnrollmentAnalytics";
import DemographicUpdates from "./pages/DemographicUpdates";
import BiometricLifecycle from "./pages/BiometricLifecycle";
import MigrationCorridors from "./pages/MigrationCorridors";
import DigitalInclusion from "./pages/DigitalInclusion";
import AnomalyDetection from "./pages/AnomalyDetection";
import Predictions from "./pages/Predictions";
import ExportReport from "./pages/ExportReport";
import Documentation from "./pages/Documentation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DataImport from "./pages/DataImport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/enrollment" element={<EnrollmentAnalytics />} />
          <Route path="/demographic" element={<DemographicUpdates />} />
          <Route path="/biometric" element={<BiometricLifecycle />} />
          <Route path="/migration" element={<MigrationCorridors />} />
          <Route path="/digital-inclusion" element={<DigitalInclusion />} />
          <Route path="/anomalies" element={<AnomalyDetection />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/export" element={<ExportReport />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/data-import" element={<DataImport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

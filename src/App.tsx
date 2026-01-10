import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EnrollmentAnalytics from "./pages/EnrollmentAnalytics";
import DemographicUpdates from "./pages/DemographicUpdates";
import BiometricLifecycle from "./pages/BiometricLifecycle";
import NotFound from "./pages/NotFound";

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
          <Route path="/migration" element={<Index />} />
          <Route path="/digital-inclusion" element={<Index />} />
          <Route path="/anomalies" element={<Index />} />
          <Route path="/predictions" element={<Index />} />
          <Route path="/export" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

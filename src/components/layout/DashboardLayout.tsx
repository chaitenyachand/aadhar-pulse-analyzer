import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { MethodologyBanner } from "@/components/dashboard/MethodologyBanner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background aadhaar-fingerprint-bg">
      <Sidebar />
      <main className="ml-64 transition-all duration-300">
        <MethodologyBanner />
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}

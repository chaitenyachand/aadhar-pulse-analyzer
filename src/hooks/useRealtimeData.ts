import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface RealtimeConfig {
  enabled: boolean;
  tables: string[];
}

// Hook to manage realtime subscriptions
export function useRealtimeSubscriptions(config: RealtimeConfig = { enabled: true, tables: [] }) {
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!config.enabled) return;

    const tablesToWatch = config.tables.length > 0 
      ? config.tables 
      : ["aadhaar_enrolment", "aadhaar_demographic_update", "aadhaar_biometric_update", "anomaly_alerts"];

    const channels = tablesToWatch.map((table) => {
      const channel = supabase
        .channel(`realtime-${table}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: table,
          },
          (payload) => {
            console.log(`Realtime update on ${table}:`, payload);
            setLastUpdate(new Date());

            // Invalidate related queries
            if (table === "aadhaar_enrolment") {
              queryClient.invalidateQueries({ queryKey: ["enrollment-data"] });
              queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            } else if (table === "aadhaar_demographic_update") {
              queryClient.invalidateQueries({ queryKey: ["demographic-updates"] });
              queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            } else if (table === "aadhaar_biometric_update") {
              queryClient.invalidateQueries({ queryKey: ["biometric-updates"] });
              queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            } else if (table === "anomaly_alerts") {
              queryClient.invalidateQueries({ queryKey: ["anomaly-alerts"] });
              toast({
                title: "New Alert Detected",
                description: "An anomaly alert has been updated",
              });
            } else if (table === "migration_corridors") {
              queryClient.invalidateQueries({ queryKey: ["migration-corridors"] });
            } else if (table === "digital_inclusion_index") {
              queryClient.invalidateQueries({ queryKey: ["digital-inclusion-index"] });
            }
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setIsConnected(true);
          } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            setIsConnected(false);
          }
        });

      return channel;
    });

    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [config.enabled, config.tables, queryClient]);

  return { lastUpdate, isConnected };
}

// Hook for manual refresh
export function useManualRefresh() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries();
      toast({
        title: "Data Refreshed",
        description: "All dashboard data has been updated",
      });
    } catch (error) {
      console.error("Refresh error:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  const refreshTable = useCallback(async (queryKey: string) => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: [queryKey] });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  return { refreshAll, refreshTable, isRefreshing };
}

// Connection status component data
export function useConnectionStatus() {
  const [status, setStatus] = useState<"connected" | "connecting" | "disconnected">("connecting");

  useEffect(() => {
    const channel = supabase
      .channel("connection-status")
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setStatus("connected");
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setStatus("disconnected");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return status;
}

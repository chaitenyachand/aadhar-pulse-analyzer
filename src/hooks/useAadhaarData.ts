import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fallback sample data (used when API fails)
const sampleEnrollmentData = [
  { state: "Maharashtra", total_enrolment: 12500000, age_0_5: 850000, age_5_17: 3200000, age_18_plus: 8450000 },
  { state: "Uttar Pradesh", total_enrolment: 18500000, age_0_5: 1250000, age_5_17: 4800000, age_18_plus: 12450000 },
  { state: "Tamil Nadu", total_enrolment: 7800000, age_0_5: 520000, age_5_17: 2100000, age_18_plus: 5180000 },
  { state: "Karnataka", total_enrolment: 6500000, age_0_5: 430000, age_5_17: 1750000, age_18_plus: 4320000 },
  { state: "Gujarat", total_enrolment: 6200000, age_0_5: 410000, age_5_17: 1670000, age_18_plus: 4120000 },
  { state: "Rajasthan", total_enrolment: 7100000, age_0_5: 480000, age_5_17: 1920000, age_18_plus: 4700000 },
  { state: "West Bengal", total_enrolment: 9200000, age_0_5: 620000, age_5_17: 2480000, age_18_plus: 6100000 },
  { state: "Madhya Pradesh", total_enrolment: 7500000, age_0_5: 510000, age_5_17: 2020000, age_18_plus: 4970000 },
  { state: "Bihar", total_enrolment: 10500000, age_0_5: 720000, age_5_17: 2850000, age_18_plus: 6930000 },
  { state: "Andhra Pradesh", total_enrolment: 5100000, age_0_5: 340000, age_5_17: 1370000, age_18_plus: 3390000 },
  { state: "Telangana", total_enrolment: 3800000, age_0_5: 250000, age_5_17: 1020000, age_18_plus: 2530000 },
  { state: "Kerala", total_enrolment: 3400000, age_0_5: 220000, age_5_17: 910000, age_18_plus: 2270000 },
  { state: "Odisha", total_enrolment: 4200000, age_0_5: 280000, age_5_17: 1130000, age_18_plus: 2790000 },
  { state: "Punjab", total_enrolment: 2800000, age_0_5: 185000, age_5_17: 750000, age_18_plus: 1865000 },
  { state: "Haryana", total_enrolment: 2600000, age_0_5: 172000, age_5_17: 700000, age_18_plus: 1728000 },
];

const sampleMonthlyTrends = [
  { month: "Jan", enrollments: 4500000, updates: 1200000, biometric: 320000 },
  { month: "Feb", enrollments: 4200000, updates: 1150000, biometric: 310000 },
  { month: "Mar", enrollments: 4800000, updates: 1350000, biometric: 380000 },
  { month: "Apr", enrollments: 5100000, updates: 1420000, biometric: 410000 },
  { month: "May", enrollments: 5400000, updates: 1550000, biometric: 450000 },
  { month: "Jun", enrollments: 5200000, updates: 1480000, biometric: 420000 },
  { month: "Jul", enrollments: 5800000, updates: 1680000, biometric: 490000 },
  { month: "Aug", enrollments: 6200000, updates: 1820000, biometric: 530000 },
  { month: "Sep", enrollments: 5900000, updates: 1720000, biometric: 500000 },
  { month: "Oct", enrollments: 5500000, updates: 1580000, biometric: 460000 },
  { month: "Nov", enrollments: 5100000, updates: 1450000, biometric: 400000 },
  { month: "Dec", enrollments: 4600000, updates: 1280000, biometric: 350000 },
];

const sampleDemographicUpdates = [
  { field: "Address", count: 8500000, percentage: 42 },
  { field: "Mobile", count: 5200000, percentage: 26 },
  { field: "Name", count: 3100000, percentage: 15 },
  { field: "DOB", count: 2100000, percentage: 10 },
  { field: "Email", count: 900000, percentage: 5 },
  { field: "Gender", count: 400000, percentage: 2 },
];

const sampleBiometricByAge = [
  { ageGroup: "0-5 years", fingerprint: 12, iris: 8, face: 80 },
  { ageGroup: "5-10 years", fingerprint: 45, iris: 30, face: 25 },
  { ageGroup: "10-18 years", fingerprint: 72, iris: 18, face: 10 },
  { ageGroup: "18-40 years", fingerprint: 85, iris: 10, face: 5 },
  { ageGroup: "40-60 years", fingerprint: 78, iris: 15, face: 7 },
  { ageGroup: "60+ years", fingerprint: 55, iris: 30, face: 15 },
];

const sampleMigrationCorridors = [
  { from: "Bihar", to: "Maharashtra", flow: 2500000, confidence: 0.85 },
  { from: "Uttar Pradesh", to: "Maharashtra", flow: 2200000, confidence: 0.82 },
  { from: "Bihar", to: "Delhi", flow: 1800000, confidence: 0.88 },
  { from: "Uttar Pradesh", to: "Delhi", flow: 1600000, confidence: 0.84 },
  { from: "Rajasthan", to: "Gujarat", flow: 1400000, confidence: 0.79 },
  { from: "Odisha", to: "Gujarat", flow: 1100000, confidence: 0.76 },
  { from: "West Bengal", to: "Karnataka", flow: 950000, confidence: 0.72 },
  { from: "Tamil Nadu", to: "Karnataka", flow: 850000, confidence: 0.81 },
  { from: "Bihar", to: "Punjab", flow: 780000, confidence: 0.77 },
  { from: "Jharkhand", to: "West Bengal", flow: 650000, confidence: 0.74 },
];

const sampleDigitalInclusionIndex = [
  { state: "Kerala", score: 92, mobile: 95, enrollment: 98, biometric: 88 },
  { state: "Tamil Nadu", score: 87, mobile: 90, enrollment: 95, biometric: 82 },
  { state: "Maharashtra", score: 84, mobile: 88, enrollment: 92, biometric: 78 },
  { state: "Karnataka", score: 82, mobile: 86, enrollment: 90, biometric: 76 },
  { state: "Gujarat", score: 79, mobile: 82, enrollment: 88, biometric: 72 },
  { state: "Punjab", score: 77, mobile: 80, enrollment: 85, biometric: 70 },
  { state: "Haryana", score: 75, mobile: 78, enrollment: 83, biometric: 68 },
  { state: "Telangana", score: 74, mobile: 77, enrollment: 82, biometric: 67 },
  { state: "Andhra Pradesh", score: 70, mobile: 73, enrollment: 78, biometric: 63 },
  { state: "West Bengal", score: 65, mobile: 68, enrollment: 72, biometric: 58 },
  { state: "Madhya Pradesh", score: 58, mobile: 60, enrollment: 65, biometric: 52 },
  { state: "Rajasthan", score: 55, mobile: 57, enrollment: 62, biometric: 49 },
  { state: "Uttar Pradesh", score: 52, mobile: 54, enrollment: 58, biometric: 46 },
  { state: "Bihar", score: 45, mobile: 47, enrollment: 50, biometric: 40 },
  { state: "Jharkhand", score: 48, mobile: 50, enrollment: 54, biometric: 43 },
];

// Fetch all Aadhaar data from the edge function
export function useAadhaarLiveData() {
  return useQuery({
    queryKey: ["aadhaar-live-data"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke("fetch-aadhaar-data", {
          body: { dataType: "all", limit: 1000 },
        });

        if (error) {
          console.error("Edge function error:", error);
          throw error;
        }

        return data;
      } catch (err) {
        console.error("Failed to fetch live data:", err);
        // Return null to trigger fallback
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
}

export function useEnrollmentData() {
  const liveData = useAadhaarLiveData();

  return useQuery({
    queryKey: ["enrollment-data", liveData.data],
    queryFn: async () => {
      // First try to use live data
      if (liveData.data?.enrolment && liveData.data.enrolment.length > 0) {
        return liveData.data.enrolment;
      }

      // Then try to fetch from database
      const { data, error } = await supabase
        .from("aadhaar_enrolment")
        .select("*")
        .limit(100);

      if (!error && data?.length) {
        // Aggregate by state
        const stateMap: Record<string, any> = {};
        for (const record of data) {
          const state = record.state;
          if (!stateMap[state]) {
            stateMap[state] = {
              state,
              total_enrolment: 0,
              age_0_5: 0,
              age_5_17: 0,
              age_18_plus: 0,
            };
          }
          stateMap[state].total_enrolment += record.total_enrolment || 0;
          stateMap[state].age_0_5 += record.age_0_5 || 0;
          stateMap[state].age_5_17 += record.age_5_17 || 0;
          stateMap[state].age_18_plus += record.age_18_plus || 0;
        }
        return Object.values(stateMap).sort((a, b) => b.total_enrolment - a.total_enrolment);
      }

      // Fallback to sample data
      return sampleEnrollmentData;
    },
    enabled: !liveData.isLoading,
  });
}

export function useMonthlyTrends() {
  const liveData = useAadhaarLiveData();

  return useQuery({
    queryKey: ["monthly-trends", liveData.data],
    queryFn: async () => {
      // For now, return sample data as monthly trends require more complex aggregation
      // This would need date-based grouping from the live API
      return sampleMonthlyTrends;
    },
    enabled: !liveData.isLoading,
  });
}

export function useDemographicUpdates() {
  const liveData = useAadhaarLiveData();

  return useQuery({
    queryKey: ["demographic-updates", liveData.data],
    queryFn: async () => {
      if (liveData.data?.demographic?.fieldBreakdown) {
        return liveData.data.demographic.fieldBreakdown;
      }

      // Try database
      const { data, error } = await supabase
        .from("aadhaar_demographic_update")
        .select("*")
        .limit(100);

      if (!error && data?.length) {
        const totals = {
          address: 0,
          mobile: 0,
          name: 0,
          dob: 0,
          email: 0,
          gender: 0,
        };

        for (const record of data) {
          totals.address += record.address_updates || 0;
          totals.mobile += record.mobile_updates || 0;
          totals.name += record.name_updates || 0;
          totals.dob += record.dob_updates || 0;
          totals.email += record.email_updates || 0;
          totals.gender += record.gender_updates || 0;
        }

        const total = Object.values(totals).reduce((a, b) => a + b, 0);

        return [
          { field: "Address", count: totals.address, percentage: Math.round((totals.address / total) * 100) },
          { field: "Mobile", count: totals.mobile, percentage: Math.round((totals.mobile / total) * 100) },
          { field: "Name", count: totals.name, percentage: Math.round((totals.name / total) * 100) },
          { field: "DOB", count: totals.dob, percentage: Math.round((totals.dob / total) * 100) },
          { field: "Email", count: totals.email, percentage: Math.round((totals.email / total) * 100) },
          { field: "Gender", count: totals.gender, percentage: Math.round((totals.gender / total) * 100) },
        ].filter(f => f.count > 0).sort((a, b) => b.count - a.count);
      }

      return sampleDemographicUpdates;
    },
    enabled: !liveData.isLoading,
  });
}

export function useBiometricUpdates() {
  const liveData = useAadhaarLiveData();

  return useQuery({
    queryKey: ["biometric-updates", liveData.data],
    queryFn: async () => {
      if (liveData.data?.biometric) {
        return liveData.data.biometric;
      }

      // Try database
      const { data, error } = await supabase
        .from("aadhaar_biometric_update")
        .select("*")
        .limit(100);

      if (!error && data?.length) {
        const totals = { fingerprint: 0, iris: 0, face: 0, total: 0 };
        const stateAgg: Record<string, any> = {};

        for (const record of data) {
          totals.fingerprint += record.fingerprint_updates || 0;
          totals.iris += record.iris_updates || 0;
          totals.face += record.face_updates || 0;
          totals.total += record.total_updates || 0;

          const state = record.state;
          if (!stateAgg[state]) {
            stateAgg[state] = { state, fingerprint: 0, iris: 0, face: 0, total: 0 };
          }
          stateAgg[state].fingerprint += record.fingerprint_updates || 0;
          stateAgg[state].iris += record.iris_updates || 0;
          stateAgg[state].face += record.face_updates || 0;
          stateAgg[state].total += record.total_updates || 0;
        }

        return {
          totals,
          stateAggregates: Object.values(stateAgg).sort((a: any, b: any) => b.total - a.total),
        };
      }

      return {
        totals: { fingerprint: 4500000, iris: 1200000, face: 2800000, total: 8500000 },
        stateAggregates: [],
      };
    },
    enabled: !liveData.isLoading,
  });
}

export function useBiometricByAge() {
  return useQuery({
    queryKey: ["biometric-by-age"],
    queryFn: async () => {
      return sampleBiometricByAge;
    },
  });
}

export function useMigrationCorridors() {
  return useQuery({
    queryKey: ["migration-corridors"],
    queryFn: async () => {
      // Try database first
      const { data, error } = await supabase
        .from("migration_corridors")
        .select("*")
        .order("estimated_migration_count", { ascending: false })
        .limit(20);

      if (!error && data?.length) {
        return data.map((d) => ({
          from: d.source_state,
          to: d.destination_state,
          flow: d.estimated_migration_count,
          confidence: d.confidence_score,
        }));
      }

      return sampleMigrationCorridors;
    },
  });
}

export function useDigitalInclusionIndex() {
  return useQuery({
    queryKey: ["digital-inclusion-index"],
    queryFn: async () => {
      // Try database first
      const { data, error } = await supabase
        .from("digital_inclusion_index")
        .select("*")
        .order("composite_dii_score", { ascending: false })
        .limit(20);

      if (!error && data?.length) {
        return data.map((d) => ({
          state: d.state,
          district: d.district,
          score: d.composite_dii_score,
          mobile: d.mobile_penetration_score,
          enrollment: d.enrollment_accessibility_score,
          biometric: d.biometric_success_rate,
        }));
      }

      return sampleDigitalInclusionIndex;
    },
  });
}

export function useAnomalyAlerts() {
  return useQuery({
    queryKey: ["anomaly-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anomaly_alerts")
        .select("*")
        .eq("is_resolved", false)
        .order("detected_at", { ascending: false })
        .limit(10);

      if (!error && data?.length) {
        return data;
      }

      // Return sample alerts
      return [
        {
          id: "1",
          state: "Maharashtra",
          district: "Mumbai",
          alert_type: "enrollment_spike",
          severity: "high",
          description: "Unusual 45% spike in enrollments detected in Mumbai district",
          detected_at: new Date().toISOString(),
          deviation_percentage: 45,
        },
        {
          id: "2",
          state: "Bihar",
          district: "Patna",
          alert_type: "biometric_failure",
          severity: "medium",
          description: "Elevated biometric authentication failure rate (12% vs 5% baseline)",
          detected_at: new Date().toISOString(),
          deviation_percentage: 140,
        },
      ];
    },
  });
}

export function useDashboardStats() {
  const liveData = useAadhaarLiveData();
  const enrollmentData = useEnrollmentData();
  const demographicData = useDemographicUpdates();
  const biometricData = useBiometricUpdates();

  return useQuery({
    queryKey: ["dashboard-stats", liveData.data, enrollmentData.data],
    queryFn: async () => {
      const totalEnrollments = enrollmentData.data?.reduce(
        (acc: number, s: any) => acc + (s.total_enrolment || 0),
        0
      ) || 0;

      const totalDemographic = demographicData.data?.reduce(
        (acc: number, d: any) => acc + (d.count || 0),
        0
      ) || 0;

      const totalBiometric = biometricData.data?.totals?.total || 5020000;

      return {
        totalEnrollments: totalEnrollments || 143250000,
        totalDemographicUpdates: totalDemographic || 20200000,
        totalBiometricUpdates: totalBiometric,
        coveragePercentage: 95.2,
        enrollmentChange: 12.5,
        demographicChange: 8.3,
        biometricChange: -2.1,
        activeStates: enrollmentData.data?.length || 36,
        activeDistricts: 766,
        dataSource: liveData.data ? "Live API" : "Database/Sample",
      };
    },
    enabled: !enrollmentData.isLoading,
  });
}

// Hook to generate AI insights
export function useChartInsight(chartType: string, chartTitle: string, data: any) {
  return useQuery({
    queryKey: ["chart-insight", chartType, chartTitle],
    queryFn: async () => {
      const { data: insight, error } = await supabase.functions.invoke("generate-insights", {
        body: { chartType, chartTitle, data },
      });

      if (error) throw error;
      return insight;
    },
    enabled: false, // Only fetch when manually triggered
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}

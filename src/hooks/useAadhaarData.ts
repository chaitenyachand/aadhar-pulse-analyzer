import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Sample data for demonstration (will be replaced with real API data)
const sampleEnrollmentData = [
  { state: "Maharashtra", total: 12500000, age_0_5: 850000, age_5_17: 3200000, age_18_plus: 8450000 },
  { state: "Uttar Pradesh", total: 18500000, age_0_5: 1250000, age_5_17: 4800000, age_18_plus: 12450000 },
  { state: "Tamil Nadu", total: 7800000, age_0_5: 520000, age_5_17: 2100000, age_18_plus: 5180000 },
  { state: "Karnataka", total: 6500000, age_0_5: 430000, age_5_17: 1750000, age_18_plus: 4320000 },
  { state: "Gujarat", total: 6200000, age_0_5: 410000, age_5_17: 1670000, age_18_plus: 4120000 },
  { state: "Rajasthan", total: 7100000, age_0_5: 480000, age_5_17: 1920000, age_18_plus: 4700000 },
  { state: "West Bengal", total: 9200000, age_0_5: 620000, age_5_17: 2480000, age_18_plus: 6100000 },
  { state: "Madhya Pradesh", total: 7500000, age_0_5: 510000, age_5_17: 2020000, age_18_plus: 4970000 },
  { state: "Bihar", total: 10500000, age_0_5: 720000, age_5_17: 2850000, age_18_plus: 6930000 },
  { state: "Andhra Pradesh", total: 5100000, age_0_5: 340000, age_5_17: 1370000, age_18_plus: 3390000 },
  { state: "Telangana", total: 3800000, age_0_5: 250000, age_5_17: 1020000, age_18_plus: 2530000 },
  { state: "Kerala", total: 3400000, age_0_5: 220000, age_5_17: 910000, age_18_plus: 2270000 },
  { state: "Odisha", total: 4200000, age_0_5: 280000, age_5_17: 1130000, age_18_plus: 2790000 },
  { state: "Punjab", total: 2800000, age_0_5: 185000, age_5_17: 750000, age_18_plus: 1865000 },
  { state: "Haryana", total: 2600000, age_0_5: 172000, age_5_17: 700000, age_18_plus: 1728000 },
];

const monthlyTrends = [
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

const demographicUpdates = [
  { field: "Address", count: 8500000, percentage: 42 },
  { field: "Mobile", count: 5200000, percentage: 26 },
  { field: "Name", count: 3100000, percentage: 15 },
  { field: "DOB", count: 2100000, percentage: 10 },
  { field: "Email", count: 900000, percentage: 5 },
  { field: "Gender", count: 400000, percentage: 2 },
];

const biometricByAge = [
  { ageGroup: "0-5 years", fingerprint: 12, iris: 8, face: 80 },
  { ageGroup: "5-10 years", fingerprint: 45, iris: 30, face: 25 },
  { ageGroup: "10-18 years", fingerprint: 72, iris: 18, face: 10 },
  { ageGroup: "18-40 years", fingerprint: 85, iris: 10, face: 5 },
  { ageGroup: "40-60 years", fingerprint: 78, iris: 15, face: 7 },
  { ageGroup: "60+ years", fingerprint: 55, iris: 30, face: 15 },
];

const migrationCorridors = [
  { from: "Bihar", to: "Maharashtra", flow: 2500000 },
  { from: "Uttar Pradesh", to: "Maharashtra", flow: 2200000 },
  { from: "Bihar", to: "Delhi", flow: 1800000 },
  { from: "Uttar Pradesh", to: "Delhi", flow: 1600000 },
  { from: "Rajasthan", to: "Gujarat", flow: 1400000 },
  { from: "Odisha", to: "Gujarat", flow: 1100000 },
  { from: "West Bengal", to: "Karnataka", flow: 950000 },
  { from: "Tamil Nadu", to: "Karnataka", flow: 850000 },
  { from: "Bihar", to: "Punjab", flow: 780000 },
  { from: "Jharkhand", to: "West Bengal", flow: 650000 },
];

const digitalInclusionIndex = [
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

export function useEnrollmentData() {
  return useQuery({
    queryKey: ["enrollment-data"],
    queryFn: async () => {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from("aadhaar_enrolment")
        .select("*")
        .limit(100);

      if (error || !data?.length) {
        // Return sample data if no real data exists
        return sampleEnrollmentData;
      }

      return data;
    },
  });
}

export function useMonthlyTrends() {
  return useQuery({
    queryKey: ["monthly-trends"],
    queryFn: async () => {
      return monthlyTrends;
    },
  });
}

export function useDemographicUpdates() {
  return useQuery({
    queryKey: ["demographic-updates"],
    queryFn: async () => {
      return demographicUpdates;
    },
  });
}

export function useBiometricByAge() {
  return useQuery({
    queryKey: ["biometric-by-age"],
    queryFn: async () => {
      return biometricByAge;
    },
  });
}

export function useMigrationCorridors() {
  return useQuery({
    queryKey: ["migration-corridors"],
    queryFn: async () => {
      return migrationCorridors;
    },
  });
}

export function useDigitalInclusionIndex() {
  return useQuery({
    queryKey: ["digital-inclusion-index"],
    queryFn: async () => {
      return digitalInclusionIndex;
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      return {
        totalEnrollments: 143250000,
        totalDemographicUpdates: 20200000,
        totalBiometricUpdates: 5020000,
        coveragePercentage: 95.2,
        enrollmentChange: 12.5,
        demographicChange: 8.3,
        biometricChange: -2.1,
        activeStates: 36,
        activeDistricts: 766,
      };
    },
  });
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Data.gov.in API endpoints for Aadhaar data
const API_ENDPOINTS = {
  enrolment: "https://api.data.gov.in/resource/ecd49b12-3084-4521-8f7e-ca8bf72069ba",
  demographic: "https://api.data.gov.in/resource/19eac040-0b94-49fa-b239-4f2fd8677d53",
  biometric: "https://api.data.gov.in/resource/65454dab-1517-40a3-ac1d-47d4dfe6891c",
};

// Default API key for data.gov.in (public sample key)
const DATA_GOV_API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

interface FetchRequest {
  dataType: "enrolment" | "demographic" | "biometric" | "all";
  state?: string;
  district?: string;
  limit?: number;
  offset?: number;
}

async function fetchFromDataGov(endpoint: string, params: Record<string, string>) {
  const url = new URL(endpoint);
  url.searchParams.set("api-key", DATA_GOV_API_KEY);
  url.searchParams.set("format", "json");
  
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  console.log(`Fetching from: ${url.toString()}`);
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch from data.gov.in: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Fetched ${data.records?.length || 0} records`);
  return data;
}

async function processEnrolmentData(records: any[]) {
  // Aggregate by state
  const stateAggregates: Record<string, any> = {};
  
  for (const record of records) {
    const state = record.state || record.State || "Unknown";
    
    if (!stateAggregates[state]) {
      stateAggregates[state] = {
        state,
        total_enrolment: 0,
        age_0_5: 0,
        age_5_17: 0,
        age_18_plus: 0,
        records_count: 0,
      };
    }
    
    const agg = stateAggregates[state];
    agg.total_enrolment += parseInt(record.total_enrolment || record["Total Enrolment"] || 0);
    agg.age_0_5 += parseInt(record.age_0_5 || record["0-5 years"] || record.age_0_5_years || 0);
    agg.age_5_17 += parseInt(record.age_5_17 || record["5-17 years"] || record.age_5_17_years || 0);
    agg.age_18_plus += parseInt(record.age_18_plus || record["18+ years"] || record.age_18_plus_years || 0);
    agg.records_count++;
  }
  
  return Object.values(stateAggregates).sort((a, b) => b.total_enrolment - a.total_enrolment);
}

async function processDemographicData(records: any[]) {
  // Aggregate update types
  const fieldUpdates = {
    address: 0,
    mobile: 0,
    name: 0,
    dob: 0,
    email: 0,
    gender: 0,
    total: 0,
  };
  
  const stateAggregates: Record<string, any> = {};
  
  for (const record of records) {
    const state = record.state || record.State || "Unknown";
    
    fieldUpdates.address += parseInt(record.address_updates || record["Address Updates"] || 0);
    fieldUpdates.mobile += parseInt(record.mobile_updates || record["Mobile Updates"] || 0);
    fieldUpdates.name += parseInt(record.name_updates || record["Name Updates"] || 0);
    fieldUpdates.dob += parseInt(record.dob_updates || record["DOB Updates"] || 0);
    fieldUpdates.email += parseInt(record.email_updates || record["Email Updates"] || 0);
    fieldUpdates.gender += parseInt(record.gender_updates || record["Gender Updates"] || 0);
    fieldUpdates.total += parseInt(record.total_updates || record["Total Updates"] || 0);
    
    if (!stateAggregates[state]) {
      stateAggregates[state] = {
        state,
        total_updates: 0,
        address_updates: 0,
        mobile_updates: 0,
        name_updates: 0,
      };
    }
    
    const agg = stateAggregates[state];
    agg.total_updates += parseInt(record.total_updates || record["Total Updates"] || 0);
    agg.address_updates += parseInt(record.address_updates || record["Address Updates"] || 0);
    agg.mobile_updates += parseInt(record.mobile_updates || record["Mobile Updates"] || 0);
    agg.name_updates += parseInt(record.name_updates || record["Name Updates"] || 0);
  }
  
  const totalUpdates = fieldUpdates.total || (
    fieldUpdates.address + fieldUpdates.mobile + fieldUpdates.name + 
    fieldUpdates.dob + fieldUpdates.email + fieldUpdates.gender
  );
  
  const fieldBreakdown = [
    { field: "Address", count: fieldUpdates.address, percentage: Math.round((fieldUpdates.address / totalUpdates) * 100) || 0 },
    { field: "Mobile", count: fieldUpdates.mobile, percentage: Math.round((fieldUpdates.mobile / totalUpdates) * 100) || 0 },
    { field: "Name", count: fieldUpdates.name, percentage: Math.round((fieldUpdates.name / totalUpdates) * 100) || 0 },
    { field: "DOB", count: fieldUpdates.dob, percentage: Math.round((fieldUpdates.dob / totalUpdates) * 100) || 0 },
    { field: "Email", count: fieldUpdates.email, percentage: Math.round((fieldUpdates.email / totalUpdates) * 100) || 0 },
    { field: "Gender", count: fieldUpdates.gender, percentage: Math.round((fieldUpdates.gender / totalUpdates) * 100) || 0 },
  ].filter(f => f.count > 0).sort((a, b) => b.count - a.count);
  
  return {
    fieldBreakdown,
    stateAggregates: Object.values(stateAggregates).sort((a: any, b: any) => b.total_updates - a.total_updates),
    totals: fieldUpdates,
  };
}

async function processBiometricData(records: any[]) {
  // Aggregate biometric update types
  const biometricTotals = {
    fingerprint: 0,
    iris: 0,
    face: 0,
    total: 0,
  };
  
  const stateAggregates: Record<string, any> = {};
  
  for (const record of records) {
    const state = record.state || record.State || "Unknown";
    
    biometricTotals.fingerprint += parseInt(record.fingerprint_updates || record["Fingerprint Updates"] || 0);
    biometricTotals.iris += parseInt(record.iris_updates || record["Iris Updates"] || 0);
    biometricTotals.face += parseInt(record.face_updates || record["Face Updates"] || 0);
    biometricTotals.total += parseInt(record.total_updates || record["Total Updates"] || 0);
    
    if (!stateAggregates[state]) {
      stateAggregates[state] = {
        state,
        total_updates: 0,
        fingerprint_updates: 0,
        iris_updates: 0,
        face_updates: 0,
      };
    }
    
    const agg = stateAggregates[state];
    agg.total_updates += parseInt(record.total_updates || record["Total Updates"] || 0);
    agg.fingerprint_updates += parseInt(record.fingerprint_updates || record["Fingerprint Updates"] || 0);
    agg.iris_updates += parseInt(record.iris_updates || record["Iris Updates"] || 0);
    agg.face_updates += parseInt(record.face_updates || record["Face Updates"] || 0);
  }
  
  return {
    totals: biometricTotals,
    stateAggregates: Object.values(stateAggregates).sort((a: any, b: any) => b.total_updates - a.total_updates),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dataType, state, district, limit = 1000, offset = 0 }: FetchRequest = await req.json();
    
    console.log(`Fetching ${dataType} data with limit ${limit}`);
    
    const params: Record<string, string> = {
      limit: String(limit),
      offset: String(offset),
    };
    
    if (state) params["filters[state]"] = state;
    if (district) params["filters[district]"] = district;

    let result: any = {};

    if (dataType === "enrolment" || dataType === "all") {
      try {
        const enrolmentData = await fetchFromDataGov(API_ENDPOINTS.enrolment, params);
        result.enrolment = await processEnrolmentData(enrolmentData.records || []);
        result.enrolmentRaw = enrolmentData.records?.slice(0, 50);
        result.enrolmentTotal = enrolmentData.total || enrolmentData.records?.length || 0;
      } catch (e: any) {
        console.error("Enrolment fetch error:", e);
        result.enrolmentError = e?.message || "Failed to fetch enrolment data";
      }
    }

    if (dataType === "demographic" || dataType === "all") {
      try {
        const demographicData = await fetchFromDataGov(API_ENDPOINTS.demographic, params);
        result.demographic = await processDemographicData(demographicData.records || []);
        result.demographicRaw = demographicData.records?.slice(0, 50);
        result.demographicTotal = demographicData.total || demographicData.records?.length || 0;
      } catch (e: any) {
        console.error("Demographic fetch error:", e);
        result.demographicError = e?.message || "Failed to fetch demographic data";
      }
    }

    if (dataType === "biometric" || dataType === "all") {
      try {
        const biometricData = await fetchFromDataGov(API_ENDPOINTS.biometric, params);
        result.biometric = await processBiometricData(biometricData.records || []);
        result.biometricRaw = biometricData.records?.slice(0, 50);
        result.biometricTotal = biometricData.total || biometricData.records?.length || 0;
      } catch (e: any) {
        console.error("Biometric fetch error:", e);
        result.biometricError = e?.message || "Failed to fetch biometric data";
      }
    }

    // Calculate summary stats
    if (dataType === "all") {
      result.summary = {
        totalEnrollments: result.enrolment?.reduce((acc: number, s: any) => acc + s.total_enrolment, 0) || 0,
        totalDemographicUpdates: result.demographic?.totals?.total || 0,
        totalBiometricUpdates: result.biometric?.totals?.total || 0,
        statesCount: result.enrolment?.length || 0,
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in fetch-aadhaar-data:", error);
    return new Response(
      JSON.stringify({ 
        error: error?.message || "Unknown error",
        details: "Failed to fetch Aadhaar data from data.gov.in APIs"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

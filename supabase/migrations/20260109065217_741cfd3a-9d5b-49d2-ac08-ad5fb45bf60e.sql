-- Aadhaar Analytics Database Schema

-- Enrollment data table
CREATE TABLE public.aadhaar_enrolment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  pincode TEXT,
  gender TEXT,
  age_0_5 INTEGER DEFAULT 0,
  age_5_17 INTEGER DEFAULT 0,
  age_18_plus INTEGER DEFAULT 0,
  total_enrolment INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Demographic update data table
CREATE TABLE public.aadhaar_demographic_update (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  pincode TEXT,
  name_updates INTEGER DEFAULT 0,
  address_updates INTEGER DEFAULT 0,
  dob_updates INTEGER DEFAULT 0,
  gender_updates INTEGER DEFAULT 0,
  mobile_updates INTEGER DEFAULT 0,
  email_updates INTEGER DEFAULT 0,
  total_updates INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Biometric update data table
CREATE TABLE public.aadhaar_biometric_update (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  pincode TEXT,
  fingerprint_updates INTEGER DEFAULT 0,
  iris_updates INTEGER DEFAULT 0,
  face_updates INTEGER DEFAULT 0,
  total_updates INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Precomputed aggregations for fast dashboard loading
CREATE TABLE public.aadhaar_state_aggregates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_enrolment BIGINT DEFAULT 0,
  total_demographic_updates BIGINT DEFAULT 0,
  total_biometric_updates BIGINT DEFAULT 0,
  avg_age_0_5_enrolment NUMERIC DEFAULT 0,
  avg_age_5_17_enrolment NUMERIC DEFAULT 0,
  avg_age_18_plus_enrolment NUMERIC DEFAULT 0,
  digital_inclusion_score NUMERIC DEFAULT 0,
  migration_index NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(state, year, month)
);

-- Migration corridors (precomputed)
CREATE TABLE public.migration_corridors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_state TEXT NOT NULL,
  destination_state TEXT NOT NULL,
  year INTEGER NOT NULL,
  estimated_migration_count BIGINT DEFAULT 0,
  confidence_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Digital Inclusion Index by district
CREATE TABLE public.digital_inclusion_index (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  mobile_penetration_score NUMERIC DEFAULT 0,
  enrollment_accessibility_score NUMERIC DEFAULT 0,
  biometric_success_rate NUMERIC DEFAULT 0,
  age_weighted_adoption NUMERIC DEFAULT 0,
  composite_dii_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(state, district, year, month)
);

-- Anomaly detection results
CREATE TABLE public.anomaly_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  state TEXT NOT NULL,
  district TEXT,
  description TEXT NOT NULL,
  detected_value NUMERIC,
  expected_value NUMERIC,
  deviation_percentage NUMERIC,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  is_resolved BOOLEAN DEFAULT false
);

-- Create indexes for performance
CREATE INDEX idx_enrolment_date ON public.aadhaar_enrolment(date);
CREATE INDEX idx_enrolment_state ON public.aadhaar_enrolment(state);
CREATE INDEX idx_demographic_date ON public.aadhaar_demographic_update(date);
CREATE INDEX idx_demographic_state ON public.aadhaar_demographic_update(state);
CREATE INDEX idx_biometric_date ON public.aadhaar_biometric_update(date);
CREATE INDEX idx_biometric_state ON public.aadhaar_biometric_update(state);

-- Enable RLS but allow public read for dashboard (no auth required for viewing)
ALTER TABLE public.aadhaar_enrolment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aadhaar_demographic_update ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aadhaar_biometric_update ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aadhaar_state_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_corridors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_inclusion_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_alerts ENABLE ROW LEVEL SECURITY;

-- Public read policies (analytics dashboard is public)
CREATE POLICY "Allow public read on enrolment" ON public.aadhaar_enrolment FOR SELECT USING (true);
CREATE POLICY "Allow public read on demographic" ON public.aadhaar_demographic_update FOR SELECT USING (true);
CREATE POLICY "Allow public read on biometric" ON public.aadhaar_biometric_update FOR SELECT USING (true);
CREATE POLICY "Allow public read on aggregates" ON public.aadhaar_state_aggregates FOR SELECT USING (true);
CREATE POLICY "Allow public read on corridors" ON public.migration_corridors FOR SELECT USING (true);
CREATE POLICY "Allow public read on dii" ON public.digital_inclusion_index FOR SELECT USING (true);
CREATE POLICY "Allow public read on alerts" ON public.anomaly_alerts FOR SELECT USING (true);
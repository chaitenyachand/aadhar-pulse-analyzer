-- Drop existing restrictive policies and create permissive ones for data import
DROP POLICY IF EXISTS "Enable read access for all users" ON public.aadhaar_enrolment;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.aadhaar_demographic_update;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.aadhaar_biometric_update;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.aadhaar_state_aggregates;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.migration_corridors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.digital_inclusion_index;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.anomaly_alerts;

-- Create public read policies
CREATE POLICY "Public read access" ON public.aadhaar_enrolment FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.aadhaar_demographic_update FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.aadhaar_biometric_update FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.aadhaar_state_aggregates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.migration_corridors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.digital_inclusion_index FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.anomaly_alerts FOR SELECT USING (true);

-- Create service role insert policies for data import
CREATE POLICY "Service role insert" ON public.aadhaar_enrolment FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role insert" ON public.aadhaar_demographic_update FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role insert" ON public.aadhaar_biometric_update FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role insert" ON public.aadhaar_state_aggregates FOR INSERT WITH CHECK (true);

-- Add age breakdown columns to demographic table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'aadhaar_demographic_update' AND column_name = 'demo_age_5_17') THEN
    ALTER TABLE public.aadhaar_demographic_update ADD COLUMN demo_age_5_17 integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'aadhaar_demographic_update' AND column_name = 'demo_age_17_plus') THEN
    ALTER TABLE public.aadhaar_demographic_update ADD COLUMN demo_age_17_plus integer DEFAULT 0;
  END IF;
END $$;

-- Add age breakdown columns to biometric table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'aadhaar_biometric_update' AND column_name = 'bio_age_5_17') THEN
    ALTER TABLE public.aadhaar_biometric_update ADD COLUMN bio_age_5_17 integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'aadhaar_biometric_update' AND column_name = 'bio_age_17_plus') THEN
    ALTER TABLE public.aadhaar_biometric_update ADD COLUMN bio_age_17_plus integer DEFAULT 0;
  END IF;
END $$;

-- Create monthly trends table for time-series analysis
CREATE TABLE IF NOT EXISTS public.aadhaar_monthly_trends (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  year integer NOT NULL,
  month integer NOT NULL,
  state text NOT NULL,
  enrollments integer DEFAULT 0,
  demographic_updates integer DEFAULT 0,
  biometric_updates integer DEFAULT 0,
  enrol_age_0_5 integer DEFAULT 0,
  enrol_age_5_17 integer DEFAULT 0,
  enrol_age_18_plus integer DEFAULT 0,
  demo_age_5_17 integer DEFAULT 0,
  demo_age_17_plus integer DEFAULT 0,
  bio_age_5_17 integer DEFAULT 0,
  bio_age_17_plus integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(year, month, state)
);

ALTER TABLE public.aadhaar_monthly_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.aadhaar_monthly_trends FOR SELECT USING (true);
CREATE POLICY "Service role insert" ON public.aadhaar_monthly_trends FOR INSERT WITH CHECK (true);

-- Create district aggregates table for granular analysis
CREATE TABLE IF NOT EXISTS public.aadhaar_district_aggregates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  state text NOT NULL,
  district text NOT NULL,
  total_enrollments integer DEFAULT 0,
  total_demographic_updates integer DEFAULT 0,
  total_biometric_updates integer DEFAULT 0,
  enrol_age_0_5 integer DEFAULT 0,
  enrol_age_5_17 integer DEFAULT 0,
  enrol_age_18_plus integer DEFAULT 0,
  demo_age_5_17 integer DEFAULT 0,
  demo_age_17_plus integer DEFAULT 0,
  bio_age_5_17 integer DEFAULT 0,
  bio_age_17_plus integer DEFAULT 0,
  unique_pincodes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(state, district)
);

ALTER TABLE public.aadhaar_district_aggregates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.aadhaar_district_aggregates FOR SELECT USING (true);
CREATE POLICY "Service role insert" ON public.aadhaar_district_aggregates FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role update" ON public.aadhaar_district_aggregates FOR UPDATE USING (true);
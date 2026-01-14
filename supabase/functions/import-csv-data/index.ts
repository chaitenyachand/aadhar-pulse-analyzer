import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const records: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== headers.length) continue;
    
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index]?.trim() || '0';
    });
    records.push(record);
  }
  
  return records;
}

function parseDate(dateStr: string): string | null {
  // Handle DD-MM-YYYY format
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { dataType, csvContent } = await req.json();

    if (!dataType || !csvContent) {
      return new Response(
        JSON.stringify({ error: 'Missing dataType or csvContent' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${dataType} data import...`);
    const records = parseCSV(csvContent);
    console.log(`Parsed ${records.length} records`);

    let insertedCount = 0;
    let errorCount = 0;

    if (dataType === 'enrollment') {
      const stateAggregates: Map<string, {
        total: number;
        age_0_5: number;
        age_5_17: number;
        age_18_plus: number;
        districts: Set<string>;
      }> = new Map();

      const monthlyTrends: Map<string, {
        enrollments: number;
        enrol_age_0_5: number;
        enrol_age_5_17: number;
        enrol_age_18_plus: number;
      }> = new Map();

      // Process and aggregate
      for (const record of records) {
        const age_0_5 = parseInt(record.age_0_5 || '0') || 0;
        const age_5_17 = parseInt(record.age_5_17 || '0') || 0;
        const age_18_plus = parseInt(record.age_18_greater || '0') || 0;
        const total = age_0_5 + age_5_17 + age_18_plus;
        const state = record.state || '';
        const district = record.district || '';
        const date = record.date || '';

        if (!state) continue;

        // State aggregates
        const stateData = stateAggregates.get(state) || {
          total: 0, age_0_5: 0, age_5_17: 0, age_18_plus: 0, districts: new Set<string>()
        };
        stateData.total += total;
        stateData.age_0_5 += age_0_5;
        stateData.age_5_17 += age_5_17;
        stateData.age_18_plus += age_18_plus;
        if (district) stateData.districts.add(district);
        stateAggregates.set(state, stateData);

        // Monthly trends
        const parsedDate = parseDate(date);
        if (parsedDate) {
          const [year, month] = parsedDate.split('-');
          const monthKey = `${state}_${year}_${month}`;
          const monthData = monthlyTrends.get(monthKey) || {
            enrollments: 0, enrol_age_0_5: 0, enrol_age_5_17: 0, enrol_age_18_plus: 0
          };
          monthData.enrollments += total;
          monthData.enrol_age_0_5 += age_0_5;
          monthData.enrol_age_5_17 += age_5_17;
          monthData.enrol_age_18_plus += age_18_plus;
          monthlyTrends.set(monthKey, monthData);
        }
      }

      // Upsert state aggregates
      for (const [state, data] of stateAggregates) {
        const { error } = await supabase
          .from('aadhaar_state_aggregates')
          .upsert({
            state,
            total_enrolments: data.total,
            total_districts: data.districts.size,
            updated_at: new Date().toISOString()
          }, { onConflict: 'state' });

        if (error) {
          console.error(`Error upserting state ${state}:`, error);
          errorCount++;
        } else {
          insertedCount++;
        }
      }

      // Upsert monthly trends
      for (const [key, data] of monthlyTrends) {
        const [state, year, month] = key.split('_');
        const { error } = await supabase
          .from('aadhaar_monthly_trends')
          .upsert({
            state,
            year: parseInt(year),
            month: parseInt(month),
            enrollments: data.enrollments,
            enrol_age_0_5: data.enrol_age_0_5,
            enrol_age_5_17: data.enrol_age_5_17,
            enrol_age_18_plus: data.enrol_age_18_plus
          }, { onConflict: 'year,month,state' });

        if (error) {
          console.error(`Error upserting monthly trend ${key}:`, error);
          errorCount++;
        }
      }

      console.log(`Enrollment import complete: ${insertedCount} states, ${monthlyTrends.size} monthly records`);
    }

    if (dataType === 'demographic') {
      const monthlyTrends: Map<string, {
        demographic_updates: number;
        demo_age_5_17: number;
        demo_age_17_plus: number;
      }> = new Map();

      for (const record of records) {
        const demo_age_5_17 = parseInt(record.demo_age_5_17 || '0') || 0;
        const demo_age_17_plus = parseInt(record.demo_age_17_plus || record['demo_age_17_+'] || '0') || 0;
        const total = demo_age_5_17 + demo_age_17_plus;
        const state = record.state || '';
        const date = record.date || '';

        if (!state) continue;

        const parsedDate = parseDate(date);
        if (parsedDate) {
          const [year, month] = parsedDate.split('-');
          const monthKey = `${state}_${year}_${month}`;
          const monthData = monthlyTrends.get(monthKey) || {
            demographic_updates: 0, demo_age_5_17: 0, demo_age_17_plus: 0
          };
          monthData.demographic_updates += total;
          monthData.demo_age_5_17 += demo_age_5_17;
          monthData.demo_age_17_plus += demo_age_17_plus;
          monthlyTrends.set(monthKey, monthData);
        }
      }

      // Upsert monthly trends for demographic
      for (const [key, data] of monthlyTrends) {
        const [state, year, month] = key.split('_');
        
        // First check if record exists
        const { data: existing } = await supabase
          .from('aadhaar_monthly_trends')
          .select('*')
          .eq('state', state)
          .eq('year', parseInt(year))
          .eq('month', parseInt(month))
          .single();

        if (existing) {
          const { error } = await supabase
            .from('aadhaar_monthly_trends')
            .update({
              demographic_updates: (existing.demographic_updates || 0) + data.demographic_updates,
              demo_age_5_17: (existing.demo_age_5_17 || 0) + data.demo_age_5_17,
              demo_age_17_plus: (existing.demo_age_17_plus || 0) + data.demo_age_17_plus
            })
            .eq('id', existing.id);

          if (error) {
            console.error(`Error updating demographic trend ${key}:`, error);
            errorCount++;
          } else {
            insertedCount++;
          }
        } else {
          const { error } = await supabase
            .from('aadhaar_monthly_trends')
            .insert({
              state,
              year: parseInt(year),
              month: parseInt(month),
              demographic_updates: data.demographic_updates,
              demo_age_5_17: data.demo_age_5_17,
              demo_age_17_plus: data.demo_age_17_plus
            });

          if (error) {
            console.error(`Error inserting demographic trend ${key}:`, error);
            errorCount++;
          } else {
            insertedCount++;
          }
        }
      }

      console.log(`Demographic import complete: ${insertedCount} monthly records`);
    }

    if (dataType === 'biometric') {
      const monthlyTrends: Map<string, {
        biometric_updates: number;
        bio_age_5_17: number;
        bio_age_17_plus: number;
      }> = new Map();

      for (const record of records) {
        const bio_age_5_17 = parseInt(record.bio_age_5_17 || '0') || 0;
        const bio_age_17_plus = parseInt(record.bio_age_17_plus || record['bio_age_17_+'] || '0') || 0;
        const total = bio_age_5_17 + bio_age_17_plus;
        const state = record.state || '';
        const date = record.date || '';

        if (!state) continue;

        const parsedDate = parseDate(date);
        if (parsedDate) {
          const [year, month] = parsedDate.split('-');
          const monthKey = `${state}_${year}_${month}`;
          const monthData = monthlyTrends.get(monthKey) || {
            biometric_updates: 0, bio_age_5_17: 0, bio_age_17_plus: 0
          };
          monthData.biometric_updates += total;
          monthData.bio_age_5_17 += bio_age_5_17;
          monthData.bio_age_17_plus += bio_age_17_plus;
          monthlyTrends.set(monthKey, monthData);
        }
      }

      // Upsert monthly trends for biometric
      for (const [key, data] of monthlyTrends) {
        const [state, year, month] = key.split('_');
        
        const { data: existing } = await supabase
          .from('aadhaar_monthly_trends')
          .select('*')
          .eq('state', state)
          .eq('year', parseInt(year))
          .eq('month', parseInt(month))
          .single();

        if (existing) {
          const { error } = await supabase
            .from('aadhaar_monthly_trends')
            .update({
              biometric_updates: (existing.biometric_updates || 0) + data.biometric_updates,
              bio_age_5_17: (existing.bio_age_5_17 || 0) + data.bio_age_5_17,
              bio_age_17_plus: (existing.bio_age_17_plus || 0) + data.bio_age_17_plus
            })
            .eq('id', existing.id);

          if (error) {
            console.error(`Error updating biometric trend ${key}:`, error);
            errorCount++;
          } else {
            insertedCount++;
          }
        } else {
          const { error } = await supabase
            .from('aadhaar_monthly_trends')
            .insert({
              state,
              year: parseInt(year),
              month: parseInt(month),
              biometric_updates: data.biometric_updates,
              bio_age_5_17: data.bio_age_5_17,
              bio_age_17_plus: data.bio_age_17_plus
            });

          if (error) {
            console.error(`Error inserting biometric trend ${key}:`, error);
            errorCount++;
          } else {
            insertedCount++;
          }
        }
      }

      console.log(`Biometric import complete: ${insertedCount} monthly records`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${records.length} records`,
        insertedCount,
        errorCount,
        dataType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
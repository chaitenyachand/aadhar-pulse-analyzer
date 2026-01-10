import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InsightRequest {
  chartType: string;
  chartTitle: string;
  data: any;
  context?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chartType, chartTitle, data, context }: InsightRequest = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating insights for: ${chartTitle}`);

    const systemPrompt = `You are an expert data analyst for India's Aadhaar program (UIDAI). You analyze Aadhaar enrollment, demographic updates, and biometric data to provide actionable insights for government decision-makers.

Your responses should be structured as JSON with the following fields:
1. "insight": A clear, data-driven observation (2-3 sentences)
2. "importance": Why this insight matters for UIDAI operations (2-3 sentences)
3. "policyAction": A specific, actionable policy recommendation
4. "operationalImpact": Quantified expected impact (e.g., "↓ 18% enrollment center load")
5. "keyMetrics": An array of 2-4 key metrics highlighted from the data
6. "visualizationValue": Why this visualization is important for understanding the data

Be specific, use actual numbers from the data, and focus on actionable insights. Respond ONLY with valid JSON.`;

    const userPrompt = `Analyze this ${chartType} visualization titled "${chartTitle}":

Data: ${JSON.stringify(data, null, 2)}

${context ? `Additional context: ${context}` : ""}

Generate a comprehensive insight with policy recommendations for UIDAI decision-makers.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received:", content.substring(0, 200));

    // Parse the JSON response
    let insight;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insight = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Create a structured response from the text
      insight = {
        insight: content.substring(0, 300),
        importance: "This data provides critical operational insights for UIDAI planning.",
        policyAction: "Review the data patterns and implement targeted interventions.",
        operationalImpact: "Improved resource allocation and service delivery",
        keyMetrics: ["Data analysis in progress"],
        visualizationValue: "Visual representation helps identify patterns and trends quickly.",
      };
    }

    return new Response(JSON.stringify(insight), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error generating insights:", error);
    return new Response(
      JSON.stringify({ 
        error: error?.message || "Unknown error",
        insight: "Unable to generate AI insights at this time.",
        importance: "Please try again later.",
        policyAction: "Review the data manually for insights.",
        operationalImpact: "Manual analysis required",
        keyMetrics: [],
        visualizationValue: "Visual data representation aids in pattern recognition.",
      }),
      {
        status: 200, // Return 200 with fallback content so UI still works
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

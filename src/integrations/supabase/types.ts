export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      aadhaar_biometric_update: {
        Row: {
          created_at: string
          date: string
          district: string | null
          face_updates: number | null
          fingerprint_updates: number | null
          id: string
          iris_updates: number | null
          pincode: string | null
          state: string
          total_updates: number | null
        }
        Insert: {
          created_at?: string
          date: string
          district?: string | null
          face_updates?: number | null
          fingerprint_updates?: number | null
          id?: string
          iris_updates?: number | null
          pincode?: string | null
          state: string
          total_updates?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          district?: string | null
          face_updates?: number | null
          fingerprint_updates?: number | null
          id?: string
          iris_updates?: number | null
          pincode?: string | null
          state?: string
          total_updates?: number | null
        }
        Relationships: []
      }
      aadhaar_demographic_update: {
        Row: {
          address_updates: number | null
          created_at: string
          date: string
          district: string | null
          dob_updates: number | null
          email_updates: number | null
          gender_updates: number | null
          id: string
          mobile_updates: number | null
          name_updates: number | null
          pincode: string | null
          state: string
          total_updates: number | null
        }
        Insert: {
          address_updates?: number | null
          created_at?: string
          date: string
          district?: string | null
          dob_updates?: number | null
          email_updates?: number | null
          gender_updates?: number | null
          id?: string
          mobile_updates?: number | null
          name_updates?: number | null
          pincode?: string | null
          state: string
          total_updates?: number | null
        }
        Update: {
          address_updates?: number | null
          created_at?: string
          date?: string
          district?: string | null
          dob_updates?: number | null
          email_updates?: number | null
          gender_updates?: number | null
          id?: string
          mobile_updates?: number | null
          name_updates?: number | null
          pincode?: string | null
          state?: string
          total_updates?: number | null
        }
        Relationships: []
      }
      aadhaar_enrolment: {
        Row: {
          age_0_5: number | null
          age_18_plus: number | null
          age_5_17: number | null
          created_at: string
          date: string
          district: string | null
          gender: string | null
          id: string
          pincode: string | null
          state: string
          total_enrolment: number | null
        }
        Insert: {
          age_0_5?: number | null
          age_18_plus?: number | null
          age_5_17?: number | null
          created_at?: string
          date: string
          district?: string | null
          gender?: string | null
          id?: string
          pincode?: string | null
          state: string
          total_enrolment?: number | null
        }
        Update: {
          age_0_5?: number | null
          age_18_plus?: number | null
          age_5_17?: number | null
          created_at?: string
          date?: string
          district?: string | null
          gender?: string | null
          id?: string
          pincode?: string | null
          state?: string
          total_enrolment?: number | null
        }
        Relationships: []
      }
      aadhaar_state_aggregates: {
        Row: {
          avg_age_0_5_enrolment: number | null
          avg_age_18_plus_enrolment: number | null
          avg_age_5_17_enrolment: number | null
          created_at: string
          digital_inclusion_score: number | null
          id: string
          migration_index: number | null
          month: number
          state: string
          total_biometric_updates: number | null
          total_demographic_updates: number | null
          total_enrolment: number | null
          year: number
        }
        Insert: {
          avg_age_0_5_enrolment?: number | null
          avg_age_18_plus_enrolment?: number | null
          avg_age_5_17_enrolment?: number | null
          created_at?: string
          digital_inclusion_score?: number | null
          id?: string
          migration_index?: number | null
          month: number
          state: string
          total_biometric_updates?: number | null
          total_demographic_updates?: number | null
          total_enrolment?: number | null
          year: number
        }
        Update: {
          avg_age_0_5_enrolment?: number | null
          avg_age_18_plus_enrolment?: number | null
          avg_age_5_17_enrolment?: number | null
          created_at?: string
          digital_inclusion_score?: number | null
          id?: string
          migration_index?: number | null
          month?: number
          state?: string
          total_biometric_updates?: number | null
          total_demographic_updates?: number | null
          total_enrolment?: number | null
          year?: number
        }
        Relationships: []
      }
      anomaly_alerts: {
        Row: {
          alert_type: string
          description: string
          detected_at: string
          detected_value: number | null
          deviation_percentage: number | null
          district: string | null
          expected_value: number | null
          id: string
          is_resolved: boolean | null
          resolved_at: string | null
          severity: string
          state: string
        }
        Insert: {
          alert_type: string
          description: string
          detected_at?: string
          detected_value?: number | null
          deviation_percentage?: number | null
          district?: string | null
          expected_value?: number | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          severity: string
          state: string
        }
        Update: {
          alert_type?: string
          description?: string
          detected_at?: string
          detected_value?: number | null
          deviation_percentage?: number | null
          district?: string | null
          expected_value?: number | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          state?: string
        }
        Relationships: []
      }
      digital_inclusion_index: {
        Row: {
          age_weighted_adoption: number | null
          biometric_success_rate: number | null
          composite_dii_score: number | null
          created_at: string
          district: string
          enrollment_accessibility_score: number | null
          id: string
          mobile_penetration_score: number | null
          month: number
          state: string
          year: number
        }
        Insert: {
          age_weighted_adoption?: number | null
          biometric_success_rate?: number | null
          composite_dii_score?: number | null
          created_at?: string
          district: string
          enrollment_accessibility_score?: number | null
          id?: string
          mobile_penetration_score?: number | null
          month: number
          state: string
          year: number
        }
        Update: {
          age_weighted_adoption?: number | null
          biometric_success_rate?: number | null
          composite_dii_score?: number | null
          created_at?: string
          district?: string
          enrollment_accessibility_score?: number | null
          id?: string
          mobile_penetration_score?: number | null
          month?: number
          state?: string
          year?: number
        }
        Relationships: []
      }
      migration_corridors: {
        Row: {
          confidence_score: number | null
          created_at: string
          destination_state: string
          estimated_migration_count: number | null
          id: string
          source_state: string
          year: number
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          destination_state: string
          estimated_migration_count?: number | null
          id?: string
          source_state: string
          year: number
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          destination_state?: string
          estimated_migration_count?: number | null
          id?: string
          source_state?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

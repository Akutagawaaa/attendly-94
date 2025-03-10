export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity: string
          id: number
          timestamp: string | null
          user_id: number | null
        }
        Insert: {
          activity: string
          id?: number
          timestamp?: string | null
          user_id?: number | null
        }
        Update: {
          activity?: string
          id?: number
          timestamp?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics: {
        Row: {
          attendance_pattern: Json | null
          attendance_rate: number | null
          avg_hours_per_day: number | null
          check_in_times: Json | null
          id: number
          total_overtime_hours: number | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          attendance_pattern?: Json | null
          attendance_rate?: number | null
          avg_hours_per_day?: number | null
          check_in_times?: Json | null
          id?: number
          total_overtime_hours?: number | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          attendance_pattern?: Json | null
          attendance_rate?: number | null
          avg_hours_per_day?: number | null
          check_in_times?: Json | null
          id?: number
          total_overtime_hours?: number | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          id: number
          total_hours: unknown | null
          user_id: number | null
          weekly_goal: number | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          id?: number
          total_hours?: unknown | null
          user_id?: number | null
          weekly_goal?: number | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          id?: number
          total_hours?: unknown | null
          user_id?: number | null
          weekly_goal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: number
          leave_type: string
          start_date: string
          status: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: number
          leave_type: string
          start_date: string
          status?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: number
          leave_type?: string
          start_date?: string
          status?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          message: string
          read: boolean | null
          type: string
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: string
          read?: boolean | null
          type: string
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string
          read?: boolean | null
          type?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          created_at: string | null
          id: number
          overtime_hours: number | null
          overtime_reason: string | null
          payslip_link: string | null
          salary: number
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          overtime_hours?: number | null
          overtime_reason?: string | null
          payslip_link?: string | null
          salary: number
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          overtime_hours?: number | null
          overtime_reason?: string | null
          payslip_link?: string | null
          salary?: number
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule: {
        Row: {
          created_at: string | null
          event_date: string
          event_name: string
          event_type: string | null
          id: number
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          event_date: string
          event_name: string
          event_type?: string | null
          id?: number
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          event_date?: string
          event_name?: string
          event_type?: string | null
          id?: number
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_time: number | null
          id: number
          status: string | null
          title: string
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: number
          status?: string | null
          title: string
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: number
          status?: string | null
          title?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_status: {
        Row: {
          id: number
          last_updated: string | null
          status: string
          user_id: number | null
        }
        Insert: {
          id?: number
          last_updated?: string | null
          status: string
          user_id?: number | null
        }
        Update: {
          id?: number
          last_updated?: string | null
          status?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          id: number
          name: string
          password_hash: string
          role: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          id?: number
          name: string
          password_hash: string
          role: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          id?: number
          name?: string
          password_hash?: string
          role?: string
          status?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

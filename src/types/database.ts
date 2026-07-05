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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      businesses: {
        Row: {
          created_at: string
          currency: string
          deleted_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          birthday: string | null
          business_id: string
          company: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          id: string
          id_number: string | null
          name: string
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          birthday?: string | null
          business_id: string
          company?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          id_number?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          birthday?: string | null
          business_id?: string
          company?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          id_number?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_actions: {
        Row: {
          action_date: string
          action_type: Database["public"]["Enums"]["collection_type"]
          business_id: string
          client_id: string
          created_at: string
          id: string
          notes: string | null
          promised_amount: number | null
          promised_date: string | null
          result: Database["public"]["Enums"]["collection_result"] | null
          sale_id: string
        }
        Insert: {
          action_date?: string
          action_type: Database["public"]["Enums"]["collection_type"]
          business_id: string
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          promised_amount?: number | null
          promised_date?: string | null
          result?: Database["public"]["Enums"]["collection_result"] | null
          sale_id: string
        }
        Update: {
          action_date?: string
          action_type?: Database["public"]["Enums"]["collection_type"]
          business_id?: string
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          promised_amount?: number | null
          promised_date?: string | null
          result?: Database["public"]["Enums"]["collection_result"] | null
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_actions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_actions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_actions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_birthdays"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "collection_actions_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_actions_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "v_aging_report"
            referencedColumns: ["sale_id"]
          },
          {
            foreignKeyName: "collection_actions_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_collections"
            referencedColumns: ["sale_id"]
          },
        ]
      }
      goals: {
        Row: {
          business_id: string
          collection_target: number | null
          created_at: string
          id: string
          period_month: number
          period_year: number
          sales_target: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          collection_target?: number | null
          created_at?: string
          id?: string
          period_month: number
          period_year: number
          sales_target?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          collection_target?: number | null
          created_at?: string
          id?: string
          period_month?: number
          period_year?: number
          sales_target?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          business_id: string
          created_at: string
          deleted_at: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          receipt_number: string | null
          sale_id: string
        }
        Insert: {
          amount: number
          business_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          receipt_number?: string | null
          sale_id: string
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          receipt_number?: string | null
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "v_aging_report"
            referencedColumns: ["sale_id"]
          },
          {
            foreignKeyName: "payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_collections"
            referencedColumns: ["sale_id"]
          },
        ]
      }
      products: {
        Row: {
          business_id: string
          category: string | null
          cost_price: number | null
          created_at: string
          default_price: number
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          sku: string | null
          stock: number | null
          stock_minimum: number | null
          track_stock: boolean
          unit: string
          updated_at: string
        }
        Insert: {
          business_id: string
          category?: string | null
          cost_price?: number | null
          created_at?: string
          default_price?: number
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sku?: string | null
          stock?: number | null
          stock_minimum?: number | null
          track_stock?: boolean
          unit?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          category?: string | null
          cost_price?: number | null
          created_at?: string
          default_price?: number
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sku?: string | null
          stock?: number | null
          stock_minimum?: number | null
          track_stock?: boolean
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          business_id: string
          client_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          remind_at: string
          reminder_type: Database["public"]["Enums"]["reminder_type"]
          sale_id: string | null
          title: string
        }
        Insert: {
          business_id: string
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          remind_at: string
          reminder_type: Database["public"]["Enums"]["reminder_type"]
          sale_id?: string | null
          title: string
        }
        Update: {
          business_id?: string
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          remind_at?: string
          reminder_type?: Database["public"]["Enums"]["reminder_type"]
          sale_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_birthdays"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "reminders_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "v_aging_report"
            referencedColumns: ["sale_id"]
          },
          {
            foreignKeyName: "reminders_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_collections"
            referencedColumns: ["sale_id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string
          description: string
          id: string
          product_id: string | null
          quantity: number
          sale_id: string
          subtotal: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          product_id?: string | null
          quantity?: number
          sale_id: string
          subtotal?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          product_id?: string | null
          quantity?: number
          sale_id?: string
          subtotal?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "v_aging_report"
            referencedColumns: ["sale_id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_collections"
            referencedColumns: ["sale_id"]
          },
        ]
      }
      sales: {
        Row: {
          balance: number | null
          business_id: string
          client_id: string
          created_at: string
          deleted_at: string | null
          discount: number
          due_date: string | null
          id: string
          installments: number | null
          notes: string | null
          paid_amount: number
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          sale_date: string
          sale_number: number
          sale_type: Database["public"]["Enums"]["sale_type"]
          status: Database["public"]["Enums"]["sale_status"]
          subtotal: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          balance?: number | null
          business_id: string
          client_id: string
          created_at?: string
          deleted_at?: string | null
          discount?: number
          due_date?: string | null
          id?: string
          installments?: number | null
          notes?: string | null
          paid_amount?: number
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          sale_date?: string
          sale_number?: number
          sale_type?: Database["public"]["Enums"]["sale_type"]
          status?: Database["public"]["Enums"]["sale_status"]
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          balance?: number | null
          business_id?: string
          client_id?: string
          created_at?: string
          deleted_at?: string | null
          discount?: number
          due_date?: string | null
          id?: string
          installments?: number | null
          notes?: string | null
          paid_amount?: number
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          sale_date?: string
          sale_number?: number
          sale_type?: Database["public"]["Enums"]["sale_type"]
          status?: Database["public"]["Enums"]["sale_status"]
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_birthdays"
            referencedColumns: ["client_id"]
          },
        ]
      }
    }
    Views: {
      v_aging_report: {
        Row: {
          aging_bucket: string | null
          balance: number | null
          business_id: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          days_overdue: number | null
          due_date: string | null
          last_collection_date: string | null
          last_collection_result:
            | Database["public"]["Enums"]["collection_result"]
            | null
          paid_amount: number | null
          sale_date: string | null
          sale_id: string | null
          sale_number: number | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_birthdays"
            referencedColumns: ["client_id"]
          },
        ]
      }
      v_low_stock_products: {
        Row: {
          business_id: string | null
          id: string | null
          name: string | null
          sku: string | null
          stock: number | null
          stock_minimum: number | null
          units_needed: number | null
        }
        Insert: {
          business_id?: string | null
          id?: string | null
          name?: string | null
          sku?: string | null
          stock?: number | null
          stock_minimum?: number | null
          units_needed?: never
        }
        Update: {
          business_id?: string | null
          id?: string | null
          name?: string | null
          sku?: string | null
          stock?: number | null
          stock_minimum?: number | null
          units_needed?: never
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      v_portfolio_summary: {
        Row: {
          business_id: string | null
          clients_with_debt: number | null
          due_next_7_days: number | null
          open_sales: number | null
          total_collected: number | null
          total_overdue: number | null
          total_pending: number | null
          total_sold: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      v_upcoming_birthdays: {
        Row: {
          birth_day: number | null
          birth_month: number | null
          birthday: string | null
          business_id: string | null
          client_id: string | null
          name: string | null
          phone: string | null
        }
        Insert: {
          birth_day?: never
          birth_month?: never
          birthday?: string | null
          business_id?: string | null
          client_id?: string | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          birth_day?: never
          birth_month?: never
          birthday?: string | null
          business_id?: string | null
          client_id?: string | null
          name?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      v_upcoming_collections: {
        Row: {
          balance: number | null
          business_id: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          days_until_due: number | null
          due_date: string | null
          sale_id: string | null
          sale_number: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_birthdays"
            referencedColumns: ["client_id"]
          },
        ]
      }
    }
    Functions: {
      count_clients_with_recent_action: {
        Args: { p_business_id: string; p_days?: number }
        Returns: number
      }
    }
    Enums: {
      collection_result:
        | "promised"
        | "paid"
        | "no_answer"
        | "refused"
        | "rescheduled"
        | "partial_payment"
        | "other"
      collection_type: "call" | "whatsapp" | "sms" | "visit" | "email" | "other"
      payment_method_type: "cash" | "transfer" | "card" | "other"
      reminder_type:
        | "birthday"
        | "collection"
        | "follow_up"
        | "meeting"
        | "custom"
      sale_status: "paid" | "partial" | "pending" | "overdue" | "cancelled"
      sale_type: "cash" | "credit"
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

// Tipos derivados de los enums de Supabase — expuestos como aliases para imports directos
// El CLI genera los enums como constantes de runtime, no como tipos TypeScript nombrados
export type SaleStatus = (typeof Constants.public.Enums.sale_status)[number]
export type PaymentMethod = (typeof Constants.public.Enums.payment_method_type)[number]
export type SaleType = (typeof Constants.public.Enums.sale_type)[number]
export type CollectionType = (typeof Constants.public.Enums.collection_type)[number]
export type CollectionResult = (typeof Constants.public.Enums.collection_result)[number]
export type ReminderType = (typeof Constants.public.Enums.reminder_type)[number]

export const Constants = {
  public: {
    Enums: {
      collection_result: [
        "promised",
        "paid",
        "no_answer",
        "refused",
        "rescheduled",
        "partial_payment",
        "other",
      ],
      collection_type: ["call", "whatsapp", "sms", "visit", "email", "other"],
      payment_method_type: ["cash", "transfer", "card", "other"],
      reminder_type: [
        "birthday",
        "collection",
        "follow_up",
        "meeting",
        "custom",
      ],
      sale_status: ["paid", "partial", "pending", "overdue", "cancelled"],
      sale_type: ["cash", "credit"],
    },
  },
} as const

export type WhatsAppTemplateType =
  | 'reminder_soft'
  | 'reminder_due_day'
  | 'reminder_overdue'
  | 'payment_thanks'
  | 'account_statement'

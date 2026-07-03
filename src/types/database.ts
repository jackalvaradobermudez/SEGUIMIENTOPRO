// ============================================================
// SeguimientoPro — Database Types
// Este archivo se reemplaza con los tipos generados por Supabase CLI:
// npx supabase gen types typescript --project-id <id> > src/types/database.ts
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SaleStatus = 'paid' | 'partial' | 'pending' | 'overdue' | 'cancelled'
export type SaleType = 'cash' | 'credit'
export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'other'
export type CollectionType = 'call' | 'whatsapp' | 'sms' | 'visit' | 'email' | 'other'
export type CollectionResult = 'promised' | 'paid' | 'no_answer' | 'refused' | 'rescheduled' | 'partial_payment' | 'other'
export type ReminderType = 'birthday' | 'collection' | 'follow_up' | 'meeting' | 'custom'

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          currency: string
          timezone: string
          logo_url: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['businesses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['businesses']['Insert']>
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          business_id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          company: string | null
          id_number: string | null
          birthday: string | null
          notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          category: string | null
          sku: string | null
          default_price: number
          cost_price: number | null
          unit: string
          track_stock: boolean
          stock: number
          stock_minimum: number
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: []
      }
      sales: {
        Row: {
          id: string
          business_id: string
          client_id: string
          sale_number: number
          sale_date: string
          sale_type: SaleType
          due_date: string | null
          installments: number
          subtotal: number
          discount: number
          total_amount: number
          paid_amount: number
          balance: number
          status: SaleStatus
          payment_method: PaymentMethod
          notes: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<
          Database['public']['Tables']['sales']['Row'],
          'id' | 'sale_number' | 'balance' | 'created_at' | 'updated_at' | 'subtotal' | 'total_amount' | 'paid_amount' | 'status'
        > &
          Partial<Pick<Database['public']['Tables']['sales']['Row'], 'subtotal' | 'total_amount' | 'paid_amount' | 'status'>>
        Update: Partial<Database['public']['Tables']['sales']['Insert']>
        Relationships: []
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          product_id: string | null
          description: string
          quantity: number
          unit_price: number
          subtotal: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sale_items']['Row'], 'id' | 'subtotal' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sale_items']['Insert']>
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          sale_id: string
          business_id: string
          amount: number
          payment_date: string
          payment_method: PaymentMethod
          receipt_number: string | null
          notes: string | null
          created_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
        Relationships: []
      }
      collection_actions: {
        Row: {
          id: string
          sale_id: string
          business_id: string
          client_id: string
          action_type: CollectionType
          action_date: string
          result: CollectionResult | null
          promised_date: string | null
          promised_amount: number | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['collection_actions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['collection_actions']['Insert']>
        Relationships: []
      }
      reminders: {
        Row: {
          id: string
          business_id: string
          client_id: string | null
          sale_id: string | null
          reminder_type: ReminderType
          title: string
          description: string | null
          remind_at: string
          is_completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reminders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reminders']['Insert']>
        Relationships: []
      }
      goals: {
        Row: {
          id: string
          business_id: string
          period_year: number
          period_month: number
          sales_target: number
          collection_target: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['goals']['Insert']>
        Relationships: []
      }
    }
    Views: {
      v_aging_report: {
        Row: {
          business_id: string
          client_id: string
          client_name: string
          client_phone: string | null
          sale_id: string
          sale_number: number
          sale_date: string
          due_date: string | null
          total_amount: number
          paid_amount: number
          balance: number
          days_overdue: number
          aging_bucket: 'current' | '1_30' | '31_60' | '61_90' | '90_plus'
          last_collection_date: string | null
          last_collection_result: CollectionResult | null
        }
        Relationships: []
      }
      v_portfolio_summary: {
        Row: {
          business_id: string
          clients_with_debt: number
          open_sales: number
          total_sold: number
          total_collected: number
          total_pending: number
          total_overdue: number
          due_next_7_days: number
        }
        Relationships: []
      }
      v_upcoming_collections: {
        Row: {
          business_id: string
          sale_id: string
          sale_number: number
          client_id: string
          client_name: string
          client_phone: string | null
          due_date: string
          balance: number
          days_until_due: number
        }
        Relationships: []
      }
      v_upcoming_birthdays: {
        Row: {
          business_id: string
          client_id: string
          name: string
          phone: string | null
          birthday: string
          birth_month: number
          birth_day: number
        }
        Relationships: []
      }
      v_low_stock_products: {
        Row: {
          business_id: string
          id: string
          name: string
          sku: string | null
          stock: number
          stock_minimum: number
          units_needed: number
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: {
      sale_status: SaleStatus
      sale_type: SaleType
      payment_method_type: PaymentMethod
      collection_type: CollectionType
      collection_result: CollectionResult
      reminder_type: ReminderType
    }
  }
}

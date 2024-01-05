export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id?: string
          is_public?: boolean
          is_delet?: boolean
          is_body: string
          is_title?: string | null
          is_user_avatar: string | null
          is_user_username: string
          created_at?: string
          updated_at?: string | null
          likes:[]
        }
        Insert: {
          id?: string
          is_public?: boolean
          is_delet?: boolean
          is_body: string
          is_title?: string | null
          is_user_avatar: string | null
          is_user_username: string
          created_at?: string
          updated_at?: string | null
          likes:[]
        }
        Update: {
            id?: string
            is_public?: boolean
            is_delet?: boolean
            is_body: string
            is_title?: string | null
            is_user_avatar: string | null
            is_user_username: string
            created_at?: string
            updated_at?: string | null
            likes:[]
        }
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
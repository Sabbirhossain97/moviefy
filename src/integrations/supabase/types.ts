export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      favorite_movies: {
        Row: {
          favorited_at: string
          id: string
          movie_id: number
          movie_poster_path: string | null
          movie_release_date: string | null
          movie_title: string
          movie_vote_average: number | null
          user_id: string
        }
        Insert: {
          favorited_at?: string
          id?: string
          movie_id: number
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_title: string
          movie_vote_average?: number | null
          user_id: string
        }
        Update: {
          favorited_at?: string
          id?: string
          movie_id?: number
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_title?: string
          movie_vote_average?: number | null
          user_id?: string
        }
        Relationships: []
      }
      favorite_tv_series: {
        Row: {
          favorited_at: string
          id: string
          series_first_air_date: string | null
          series_id: number
          series_name: string
          series_poster_path: string | null
          series_vote_average: number | null
          user_id: string
        }
        Insert: {
          favorited_at?: string
          id?: string
          series_first_air_date?: string | null
          series_id: number
          series_name: string
          series_poster_path?: string | null
          series_vote_average?: number | null
          user_id: string
        }
        Update: {
          favorited_at?: string
          id?: string
          series_first_air_date?: string | null
          series_id?: number
          series_name?: string
          series_poster_path?: string | null
          series_vote_average?: number | null
          user_id?: string
        }
        Relationships: []
      }
      movie_ratings: {
        Row: {
          created_at: string
          id: string
          movie_id: number
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          movie_id: number
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          movie_id?: number
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      movie_reminders: {
        Row: {
          created_at: string
          id: string
          movie_id: number
          remind_by_email: boolean
          remind_on: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          movie_id: number
          remind_by_email?: boolean
          remind_on: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          movie_id?: number
          remind_by_email?: boolean
          remind_on?: string
          user_id?: string
        }
        Relationships: []
      }
      movie_reviews: {
        Row: {
          created_at: string
          id: string
          is_approved: boolean | null
          movie_id: number
          review: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_approved?: boolean | null
          movie_id: number
          review: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_approved?: boolean | null
          movie_id?: number
          review?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      series_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number | null
          series_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating?: number | null
          series_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number | null
          series_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      series_reviews: {
        Row: {
          created_at: string
          id: number
          review: string | null
          series_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          review?: string | null
          series_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          review?: string | null
          series_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "series_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tv_wishlists: {
        Row: {
          added_at: string
          id: string
          series_first_air_date: string | null
          series_id: number
          series_name: string
          series_poster_path: string | null
          series_vote_average: number | null
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          series_first_air_date?: string | null
          series_id: number
          series_name: string
          series_poster_path?: string | null
          series_vote_average?: number | null
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          series_first_air_date?: string | null
          series_id?: number
          series_name?: string
          series_poster_path?: string | null
          series_vote_average?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          created_at: string
          gemini_api_key: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gemini_api_key: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gemini_api_key?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      watched_movies: {
        Row: {
          id: string
          movie_id: number
          movie_poster_path: string | null
          movie_release_date: string | null
          movie_title: string
          movie_vote_average: number | null
          user_id: string
          watched_at: string
        }
        Insert: {
          id?: string
          movie_id: number
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_title: string
          movie_vote_average?: number | null
          user_id: string
          watched_at?: string
        }
        Update: {
          id?: string
          movie_id?: number
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_title?: string
          movie_vote_average?: number | null
          user_id?: string
          watched_at?: string
        }
        Relationships: []
      }
      watched_tv_series: {
        Row: {
          id: string
          series_first_air_date: string | null
          series_id: number
          series_name: string
          series_poster_path: string | null
          series_vote_average: number | null
          user_id: string
          watched_at: string
        }
        Insert: {
          id?: string
          series_first_air_date?: string | null
          series_id: number
          series_name: string
          series_poster_path?: string | null
          series_vote_average?: number | null
          user_id: string
          watched_at?: string
        }
        Update: {
          id?: string
          series_first_air_date?: string | null
          series_id?: number
          series_name?: string
          series_poster_path?: string | null
          series_vote_average?: number | null
          user_id?: string
          watched_at?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          added_at: string
          id: string
          movie_id: number
          movie_poster_path: string | null
          movie_release_date: string | null
          movie_title: string
          movie_vote_average: number | null
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          movie_id: number
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_title: string
          movie_vote_average?: number | null
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          movie_id?: number
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_title?: string
          movie_vote_average?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

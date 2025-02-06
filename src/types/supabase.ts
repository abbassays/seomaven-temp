export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      seo_duplicate_content: {
        Row: {
          cache_control: Json | null;
          checks: Json | null;
          content_metrics: Json | null;
          created_at: string | null;
          id: string;
          page_timing: Json | null;
          resource_metrics: Json | null;
          similarity_score: number;
          source_meta: Json | null;
          target_meta: Json | null;
          task_id: string | null;
          url_from: string;
          url_to: string;
        };
        Insert: {
          cache_control?: Json | null;
          checks?: Json | null;
          content_metrics?: Json | null;
          created_at?: string | null;
          id?: string;
          page_timing?: Json | null;
          resource_metrics?: Json | null;
          similarity_score: number;
          source_meta?: Json | null;
          target_meta?: Json | null;
          task_id?: string | null;
          url_from: string;
          url_to: string;
        };
        Update: {
          cache_control?: Json | null;
          checks?: Json | null;
          content_metrics?: Json | null;
          created_at?: string | null;
          id?: string;
          page_timing?: Json | null;
          resource_metrics?: Json | null;
          similarity_score?: number;
          source_meta?: Json | null;
          target_meta?: Json | null;
          task_id?: string | null;
          url_from?: string;
          url_to?: string;
        };
        Relationships: [
          {
            foreignKeyName: "seo_duplicate_content_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "seo_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      seo_duplicate_tags: {
        Row: {
          accumulator: string;
          created_at: string | null;
          id: string;
          pages: Json;
          task_id: string | null;
          total_count: number;
        };
        Insert: {
          accumulator: string;
          created_at?: string | null;
          id?: string;
          pages: Json;
          task_id?: string | null;
          total_count: number;
        };
        Update: {
          accumulator?: string;
          created_at?: string | null;
          id?: string;
          pages?: Json;
          task_id?: string | null;
          total_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "seo_duplicate_tags_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "seo_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      seo_keyword_density: {
        Row: {
          created_at: string | null;
          density: number;
          frequency: number;
          id: string;
          keyword: string;
          task_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          density: number;
          frequency: number;
          id?: string;
          keyword: string;
          task_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          density?: number;
          frequency?: number;
          id?: string;
          keyword?: string;
          task_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "seo_keyword_density_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "seo_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      seo_links: {
        Row: {
          created_at: string | null;
          dofollow: boolean | null;
          id: string;
          link_attributes: Json | null;
          link_type: string | null;
          task_id: string | null;
          url_from: string;
          url_to: string;
        };
        Insert: {
          created_at?: string | null;
          dofollow?: boolean | null;
          id?: string;
          link_attributes?: Json | null;
          link_type?: string | null;
          task_id?: string | null;
          url_from: string;
          url_to: string;
        };
        Update: {
          created_at?: string | null;
          dofollow?: boolean | null;
          id?: string;
          link_attributes?: Json | null;
          link_type?: string | null;
          task_id?: string | null;
          url_from?: string;
          url_to?: string;
        };
        Relationships: [
          {
            foreignKeyName: "seo_links_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "seo_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      seo_non_indexable: {
        Row: {
          created_at: string | null;
          id: string;
          meta_robots: Json | null;
          reason: string | null;
          task_id: string | null;
          url: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          meta_robots?: Json | null;
          reason?: string | null;
          task_id?: string | null;
          url: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          meta_robots?: Json | null;
          reason?: string | null;
          task_id?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "seo_non_indexable_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "seo_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      seo_pages: {
        Row: {
          content_encoding: string | null;
          created_at: string | null;
          id: string;
          load_time: number | null;
          media_type: string | null;
          meta: Json | null;
          size: number | null;
          status_code: number | null;
          task_id: string | null;
          url: string;
        };
        Insert: {
          content_encoding?: string | null;
          created_at?: string | null;
          id?: string;
          load_time?: number | null;
          media_type?: string | null;
          meta?: Json | null;
          size?: number | null;
          status_code?: number | null;
          task_id?: string | null;
          url: string;
        };
        Update: {
          content_encoding?: string | null;
          created_at?: string | null;
          id?: string;
          load_time?: number | null;
          media_type?: string | null;
          meta?: Json | null;
          size?: number | null;
          status_code?: number | null;
          task_id?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "seo_pages_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "seo_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      seo_resources: {
        Row: {
          created_at: string | null;
          encoded_size: number | null;
          fetch_time: number | null;
          fetch_timing: Json | null;
          id: string;
          resource_type: string | null;
          size: number | null;
          task_id: string | null;
          total_transfer_size: number | null;
          url: string;
        };
        Insert: {
          created_at?: string | null;
          encoded_size?: number | null;
          fetch_time?: number | null;
          fetch_timing?: Json | null;
          id?: string;
          resource_type?: string | null;
          size?: number | null;
          task_id?: string | null;
          total_transfer_size?: number | null;
          url: string;
        };
        Update: {
          created_at?: string | null;
          encoded_size?: number | null;
          fetch_time?: number | null;
          fetch_timing?: Json | null;
          id?: string;
          resource_type?: string | null;
          size?: number | null;
          task_id?: string | null;
          total_transfer_size?: number | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "seo_resources_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "seo_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      seo_summaries: {
        Row: {
          broken_links_count: number | null;
          broken_resources_count: number | null;
          checks: Json | null;
          crawl_progress: string | null;
          crawl_status: string | null;
          created_at: string | null;
          duplicate_content_count: number | null;
          duplicate_description_count: number | null;
          duplicate_title_count: number | null;
          external_links_count: number | null;
          id: string;
          internal_links_count: number | null;
          page_metrics: Json | null;
          pages_crawled: number | null;
          schema_types: Json | null;
          task_id: string | null;
          total_pages: number | null;
        };
        Insert: {
          broken_links_count?: number | null;
          broken_resources_count?: number | null;
          checks?: Json | null;
          crawl_progress?: string | null;
          crawl_status?: string | null;
          created_at?: string | null;
          duplicate_content_count?: number | null;
          duplicate_description_count?: number | null;
          duplicate_title_count?: number | null;
          external_links_count?: number | null;
          id?: string;
          internal_links_count?: number | null;
          page_metrics?: Json | null;
          pages_crawled?: number | null;
          schema_types?: Json | null;
          task_id?: string | null;
          total_pages?: number | null;
        };
        Update: {
          broken_links_count?: number | null;
          broken_resources_count?: number | null;
          checks?: Json | null;
          crawl_progress?: string | null;
          crawl_status?: string | null;
          created_at?: string | null;
          duplicate_content_count?: number | null;
          duplicate_description_count?: number | null;
          duplicate_title_count?: number | null;
          external_links_count?: number | null;
          id?: string;
          internal_links_count?: number | null;
          page_metrics?: Json | null;
          pages_crawled?: number | null;
          schema_types?: Json | null;
          task_id?: string | null;
          total_pages?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "seo_summaries_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "seo_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      seo_tasks: {
        Row: {
          created_at: string | null;
          id: string;
          status: string;
          target_url: string;
          task_id: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          status?: string;
          target_url: string;
          task_id: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          status?: string;
          target_url?: string;
          task_id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      task_responses: {
        Row: {
          created_at: string | null;
          id: string;
          response_data: Json;
          task_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          response_data: Json;
          task_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          response_data?: Json;
          task_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "task_responses_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "seo_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_task_with_response: {
        Args: {
          p_task_id: string;
          p_target_url: string;
          p_user_id: string;
          p_response_data: Json;
        };
        Returns: {
          created_at: string | null;
          id: string;
          status: string;
          target_url: string;
          task_id: string;
          updated_at: string | null;
          user_id: string | null;
        };
      };
    };
    Enums: {
      task_status: "pending" | "processing" | "completed" | "failed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

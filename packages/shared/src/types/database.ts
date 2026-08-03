// Database types for the Supabase `public` schema.
//
// WHY: typed row/insert/update shapes + enums for `createClient<Database>()`,
// so backend queries are type-checked end to end.
//
// REGENERATION: this file mirrors `supabase/migrations/*.sql`. Regenerate it
// whenever the schema changes (see /docs/DB.md). The Supabase CLI offers two
// routes:
//   • with Docker:        npx supabase gen types typescript --db-url "$DATABASE_URL" --schema public > packages/shared/src/types/database.ts
//   • with access token:  SUPABASE_ACCESS_TOKEN=... npx supabase gen types typescript --project-id <ref> --schema public > ...
// This copy was hand-authored to match the initial migration because neither
// Docker nor an access token was available at generation time; keep it in sync
// with the SQL (and with src/enums) on every schema change.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          plan: string;
          mode: Database['public']['Enums']['user_mode'];
          daily_send_cap: number;
          physical_address: string | null;
          booking_url: string | null;
          email_signature: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          plan?: string;
          mode?: Database['public']['Enums']['user_mode'];
          daily_send_cap?: number;
          physical_address?: string | null;
          booking_url?: string | null;
          email_signature?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          plan?: string;
          mode?: Database['public']['Enums']['user_mode'];
          daily_send_cap?: number;
          physical_address?: string | null;
          booking_url?: string | null;
          email_signature?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      company_profiles: {
        Row: {
          id: string;
          user_id: string;
          website: string | null;
          logo_url: string | null;
          brand_color: string | null;
          theme_source: Database['public']['Enums']['theme_source'];
          services: string | null;
          about: string | null;
          value_prop: string | null;
          tone: string | null;
          proof_points: Json;
          raw_crawl: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          website?: string | null;
          logo_url?: string | null;
          brand_color?: string | null;
          theme_source?: Database['public']['Enums']['theme_source'];
          services?: string | null;
          about?: string | null;
          value_prop?: string | null;
          tone?: string | null;
          proof_points?: Json;
          raw_crawl?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          website?: string | null;
          logo_url?: string | null;
          brand_color?: string | null;
          theme_source?: Database['public']['Enums']['theme_source'];
          services?: string | null;
          about?: string | null;
          value_prop?: string | null;
          tone?: string | null;
          proof_points?: Json;
          raw_crawl?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'company_profiles_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      mailboxes: {
        Row: {
          id: string;
          user_id: string;
          provider: Database['public']['Enums']['mailbox_provider'];
          email: string;
          access_token_encrypted: string | null;
          refresh_token_encrypted: string | null;
          token_expires_at: string | null;
          daily_cap: number;
          warmup_state: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: Database['public']['Enums']['mailbox_provider'];
          email: string;
          access_token_encrypted?: string | null;
          refresh_token_encrypted?: string | null;
          token_expires_at?: string | null;
          daily_cap?: number;
          warmup_state?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: Database['public']['Enums']['mailbox_provider'];
          email?: string;
          access_token_encrypted?: string | null;
          refresh_token_encrypted?: string | null;
          token_expires_at?: string | null;
          daily_cap?: number;
          warmup_state?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'mailboxes_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      searches: {
        Row: {
          id: string;
          user_id: string;
          industry: string | null;
          location: string | null;
          filters: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          industry?: string | null;
          location?: string | null;
          filters?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          industry?: string | null;
          location?: string | null;
          filters?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'searches_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          search_id: string | null;
          name: string | null;
          website: string | null;
          email: string | null;
          phone: string | null;
          reviews: Json;
          hook: string | null;
          status: Database['public']['Enums']['lead_status'];
          enrichment_status: Database['public']['Enums']['enrichment_status'];
          place_id: string | null;
          address: string | null;
          rating: number | null;
          review_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          search_id?: string | null;
          name?: string | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          reviews?: Json;
          hook?: string | null;
          status?: Database['public']['Enums']['lead_status'];
          enrichment_status?: Database['public']['Enums']['enrichment_status'];
          place_id?: string | null;
          address?: string | null;
          rating?: number | null;
          review_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          search_id?: string | null;
          name?: string | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          reviews?: Json;
          hook?: string | null;
          status?: Database['public']['Enums']['lead_status'];
          enrichment_status?: Database['public']['Enums']['enrichment_status'];
          place_id?: string | null;
          address?: string | null;
          rating?: number | null;
          review_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'leads_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leads_search_id_fkey';
            columns: ['search_id'];
            referencedRelation: 'searches';
            referencedColumns: ['id'];
          },
        ];
      };
      lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lists_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      lead_list: {
        Row: {
          id: string;
          list_id: string;
          lead_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          lead_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          list_id?: string;
          lead_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lead_list_list_id_fkey';
            columns: ['list_id'];
            referencedRelation: 'lists';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lead_list_lead_id_fkey';
            columns: ['lead_id'];
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
        ];
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          list_id: string | null;
          channel: Database['public']['Enums']['campaign_channel'];
          mode: Database['public']['Enums']['user_mode'];
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          list_id?: string | null;
          channel?: Database['public']['Enums']['campaign_channel'];
          mode?: Database['public']['Enums']['user_mode'];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          list_id?: string | null;
          channel?: Database['public']['Enums']['campaign_channel'];
          mode?: Database['public']['Enums']['user_mode'];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'campaigns_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'campaigns_list_id_fkey';
            columns: ['list_id'];
            referencedRelation: 'lists';
            referencedColumns: ['id'];
          },
        ];
      };
      sequence_steps: {
        Row: {
          id: string;
          campaign_id: string;
          step_order: number;
          wait_days: number;
          template_ref: string | null;
          prompt: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          step_order: number;
          wait_days?: number;
          template_ref?: string | null;
          prompt?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          step_order?: number;
          wait_days?: number;
          template_ref?: string | null;
          prompt?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sequence_steps_campaign_id_fkey';
            columns: ['campaign_id'];
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          campaign_id: string | null;
          lead_id: string;
          channel: Database['public']['Enums']['campaign_channel'];
          state: Database['public']['Enums']['message_state'];
          thread_id: string | null;
          sent_at: string | null;
          subject: string | null;
          body: string | null;
          step_order: number;
          approved: boolean;
          mailbox_id: string | null;
          provider_message_id: string | null;
          scheduled_at: string | null;
          send_error: string | null;
          direction: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id?: string | null;
          lead_id: string;
          channel?: Database['public']['Enums']['campaign_channel'];
          state?: Database['public']['Enums']['message_state'];
          thread_id?: string | null;
          sent_at?: string | null;
          subject?: string | null;
          body?: string | null;
          step_order?: number;
          approved?: boolean;
          mailbox_id?: string | null;
          provider_message_id?: string | null;
          scheduled_at?: string | null;
          send_error?: string | null;
          direction?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string | null;
          lead_id?: string;
          channel?: Database['public']['Enums']['campaign_channel'];
          state?: Database['public']['Enums']['message_state'];
          thread_id?: string | null;
          sent_at?: string | null;
          subject?: string | null;
          body?: string | null;
          step_order?: number;
          approved?: boolean;
          mailbox_id?: string | null;
          provider_message_id?: string | null;
          scheduled_at?: string | null;
          send_error?: string | null;
          direction?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_campaign_id_fkey';
            columns: ['campaign_id'];
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_lead_id_fkey';
            columns: ['lead_id'];
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
        ];
      };
      suppressions: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          reason: Database['public']['Enums']['suppression_reason'];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          reason: Database['public']['Enums']['suppression_reason'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          reason?: Database['public']['Enums']['suppression_reason'];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'suppressions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      credit_ledger: {
        Row: {
          id: string;
          user_id: string;
          delta: number;
          reason: Database['public']['Enums']['credit_reason'];
          ref_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          delta: number;
          reason: Database['public']['Enums']['credit_reason'];
          ref_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          delta?: number;
          reason?: Database['public']['Enums']['credit_reason'];
          ref_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'credit_ledger_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      usage_events: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          credits: number;
          status: Database['public']['Enums']['usage_status'];
          ref_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          credits: number;
          status?: Database['public']['Enums']['usage_status'];
          ref_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          credits?: number;
          status?: Database['public']['Enums']['usage_status'];
          ref_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'usage_events_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      click_events: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string | null;
          message_id: string | null;
          payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_id?: string | null;
          message_id?: string | null;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lead_id?: string | null;
          message_id?: string | null;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'click_events_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'click_events_lead_id_fkey';
            columns: ['lead_id'];
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'click_events_message_id_fkey';
            columns: ['message_id'];
            referencedRelation: 'messages';
            referencedColumns: ['id'];
          },
        ];
      };
      reply_events: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string | null;
          message_id: string | null;
          payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_id?: string | null;
          message_id?: string | null;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lead_id?: string | null;
          message_id?: string | null;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reply_events_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reply_events_lead_id_fkey';
            columns: ['lead_id'];
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reply_events_message_id_fkey';
            columns: ['message_id'];
            referencedRelation: 'messages';
            referencedColumns: ['id'];
          },
        ];
      };
      bounce_events: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string | null;
          message_id: string | null;
          payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_id?: string | null;
          message_id?: string | null;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lead_id?: string | null;
          message_id?: string | null;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bounce_events_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bounce_events_lead_id_fkey';
            columns: ['lead_id'];
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bounce_events_message_id_fkey';
            columns: ['message_id'];
            referencedRelation: 'messages';
            referencedColumns: ['id'];
          },
        ];
      };
      booking_events: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string | null;
          message_id: string | null;
          cal_uid: string | null;
          cal_trigger: string | null;
          payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_id?: string | null;
          message_id?: string | null;
          cal_uid?: string | null;
          cal_trigger?: string | null;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lead_id?: string | null;
          message_id?: string | null;
          cal_uid?: string | null;
          cal_trigger?: string | null;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'booking_events_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'booking_events_lead_id_fkey';
            columns: ['lead_id'];
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'booking_events_message_id_fkey';
            columns: ['message_id'];
            referencedRelation: 'messages';
            referencedColumns: ['id'];
          },
        ];
      };
      stripe_events: {
        Row: {
          id: string;
          type: string;
          user_id: string | null;
          credits: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          type: string;
          user_id?: string | null;
          credits?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          user_id?: string | null;
          credits?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'stripe_events_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      credit_balance: {
        Args: { p_user: string };
        Returns: number;
      };
      reserve_credits: {
        Args: { p_user: string; p_action: string; p_cost: number; p_ref?: string | null };
        Returns: string;
      };
      commit_usage: {
        Args: { p_usage: string };
        Returns: boolean;
      };
      refund_usage: {
        Args: { p_usage: string };
        Returns: boolean;
      };
    };
    Enums: {
      lead_status: 'new' | 'contacted' | 'replied' | 'meeting' | 'won' | 'lost';
      enrichment_status: 'pending' | 'in_progress' | 'complete' | 'failed';
      message_state: 'queued' | 'sent' | 'bounced' | 'replied' | 'stopped';
      user_mode: 'draft' | 'autonomous';
      mailbox_provider: 'gmail' | 'outlook';
      campaign_channel: 'email' | 'whatsapp';
      theme_source: 'fetched' | 'official';
      credit_reason:
        | 'purchase'
        | 'search'
        | 'enrichment'
        | 'draft'
        | 'send'
        | 'refund';
      usage_status: 'reserved' | 'committed' | 'refunded';
      suppression_reason: 'unsubscribe' | 'bounce' | 'manual';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// --- Convenience helpers (mirror the Supabase-generated helper types) ---
type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update'];
export type Enums<T extends keyof PublicSchema['Enums']> =
  PublicSchema['Enums'][T];

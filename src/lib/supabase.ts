import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from './config';

/**
 * Supabase client. Returns null when not configured, which signals the auth
 * layer to use the local mock auth store instead — so the app runs offline.
 *
 * TODO(supabase): Create the project and apply supabase/schema.sql, then set
 *   EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.
 */
export const supabase: SupabaseClient | null = config.supabase.isConfigured
  ? createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const isSupabaseEnabled = supabase !== null;

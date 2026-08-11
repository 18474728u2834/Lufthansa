import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Auth and database features will not work.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type RobloxVerification = {
  id: string;
  user_id: string;
  roblox_username: string;
  roblox_user_id: string | null;
  verification_code: string;
  status: 'pending' | 'verified';
  created_at: string;
  verified_at: string | null;
};

export type ApplicationStatus = 'submitted' | 'reviewing' | 'accepted' | 'rejected';

export type Application = {
  id: string;
  user_id: string;
  roblox_username: string;
  roblox_user_id: string | null;
  full_name: string;
  discord_username: string | null;
  position: string;
  experience: string;
  why_join: string;
  age_group: '13-15' | '16-17' | '18+';
  status: ApplicationStatus;
  created_at: string;
};

export const POSITIONS = [
  'Pilot (Captain)',
  'Pilot (First Officer)',
  'Cabin Crew',
  'Ground Operations',
  'Air Traffic Control',
  'Aircraft Maintenance',
  'Customer Service',
] as const;

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = 
  process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

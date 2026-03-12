import { createClient } from '@supabase/supabase-js';

// These would normally be environment variables
// For this demonstration, we'll use a public placeholder or ask the user
// Since I'm an agent, I'll provide a structure that the user can easily fill
// or I can try to find them if they exist in the codebase (unlikely for new integration)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const CHAT_CHANNEL = 'global_discipline_chat';

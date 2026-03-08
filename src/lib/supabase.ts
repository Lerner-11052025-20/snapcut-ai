import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://glntihbvumnkmbicgjzb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbnRpaGJ2dW1ua21iaWNnanpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDYxOTEsImV4cCI6MjA4ODQ4MjE5MX0.eCfQZe9clckNaRT45Oy83VzuM6MQj0NVtHp_oFSiK48';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type { User, Session } from '@supabase/supabase-js';

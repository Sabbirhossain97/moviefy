// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vbmtblkfzwpddpiepgsw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXRibGtmendwZGRwaWVwZ3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTA5MTMsImV4cCI6MjA2NTQ4NjkxM30.11LxWB8WYo2V-rhx6a0MOataoox6BTJrWDFOweKHZkg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
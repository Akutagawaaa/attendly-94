// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jfgzfryslqwvhdyvbppn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ3pmcnlzbHF3dmhkeXZicHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTY4MjQsImV4cCI6MjA1NzE5MjgyNH0.ttcEQwfB9AFNdv96urdrlCRbRar2ILVFu8CTV-IytXA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
// // src/utils/supabase.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with the project URL and API key
const supabase = createClient(
  `${process.env.SUPABASE_URL}`, // Your Supabase URL
  `${process.env.SUPABASE_ANON_KEY}` // Your Supabase Public API Key
);

module.exports = supabase;

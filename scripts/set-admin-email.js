require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key has higher privileges
const supabase = createClient(supabaseUrl, supabaseKey);

async function setAdminEmail() {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    
    if (!adminEmail) {
      console.error('NEXT_PUBLIC_ADMIN_EMAIL is not set in your .env.local file');
      process.exit(1);
    }

    // Execute SQL to set admin email
    const { data, error } = await supabase.rpc('set_admin_email', {
      email: adminEmail
    });

    if (error) {
      throw error;
    }

    console.log('Successfully set admin email to:', adminEmail);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error setting admin email:', error);
  }
}

setAdminEmail(); 
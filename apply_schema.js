import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://pvrggtslrmznfkodzexl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cmdndHNscm16bmZrb2R6ZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAzNjkwNiwiZXhwIjoyMDg3NjEyOTA2fQ.uVs43910AII1G-kMKXVhZlpCkmDu66Z9AqqheZsc1g0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSchema() {
  try {
    const schemaPath = path.join(__dirname, '..', '..', 'full_stack', 'apps', 'api', 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Supabase JS client doesn't have a direct way to run arbitrary schema SQL easily
    // We will instruct the user to run the schema manually if this fails, or use the REST API.
    // However, the REST API for executing raw SQL is often restricted or not exposed via standard apis.
    console.log("To apply the schema reliably, please run the following SQL in your Supabase SQL Editor:");
    console.log(schema);
    
  } catch (error) {
    console.error('Error reading schema:', error);
  }
}

runSchema();

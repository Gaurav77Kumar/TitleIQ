import { sql } from './src/db/index.js';
import './src/lib/env.js';

async function migrate() {
  try {
    console.log('🚀 Starting migrations...');

    // 1. Create simulations table
    console.log('Creating simulations table...');
    await sql`
      CREATE TABLE IF NOT EXISTS simulations (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
        title       TEXT NOT NULL,
        niche       TEXT NOT NULL,
        result_json JSONB NOT NULL,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    console.log('✅ Simulations table ready.');

    // 2. Add keyword_data to analyses
    console.log('Checking for keyword_data in analyses...');
    await sql`
      ALTER TABLE analyses 
      ADD COLUMN IF NOT EXISTS keyword_data JSONB
    `;
    console.log('✅ keyword_data column ready.');

    // 3. Add niche to analyses if missing
    console.log('Checking for niche in analyses...');
    await sql`
      ALTER TABLE analyses 
      ADD COLUMN IF NOT EXISTS niche TEXT
    `;
    console.log('✅ niche column ready.');

    console.log('🎉 Migrations completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();

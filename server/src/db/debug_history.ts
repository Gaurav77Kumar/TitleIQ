import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function check() {
  try {
    const rows = await sql`SELECT * FROM analyses LIMIT 5`;
    console.log('Analyses rows:', JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('Query failed:', err);
  }
}

check();

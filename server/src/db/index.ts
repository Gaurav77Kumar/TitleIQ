import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

/**
 * Lazily-initialized Neon SQL tag.
 * Throws a clear error at query-time (not module-load-time) when DATABASE_URL is missing.
 */
let _sql: NeonQueryFunction<false, false> | null = null;

function getSQL(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL is not set. Add it to your .env file before running DB queries.'
      );
    }
    _sql = neon(url);
  }
  return _sql;
}

/**
 * Tagged template literal for Neon SQL queries.
 *
 * Usage:
 *   const rows = await sql`SELECT * FROM users WHERE id = ${userId}`;
 */
export const sql: NeonQueryFunction<false, false> = new Proxy(
  // Placeholder function — never called directly
  (() => {}) as unknown as NeonQueryFunction<false, false>,
  {
    apply(_target, _thisArg, args) {
      const fn = getSQL();
      return (fn as Function).apply(null, args);
    },
  }
);

export default sql;

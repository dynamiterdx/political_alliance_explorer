const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkDb() {
    const client = await pool.connect();
    try {
        console.log('--- Schema Tables ---');
        const tables = await client.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
        `);
        console.log(tables.rows);
        console.log('--- Done ---');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkDb();

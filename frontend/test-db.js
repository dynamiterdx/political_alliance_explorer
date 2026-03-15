const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkDb() {
    const client = await pool.connect();
    try {
        console.log('--- DB Check ---');
        const states = await client.query('SELECT id, year, created_at FROM "WorldState" ORDER BY created_at DESC');
        console.log('WorldStates:', states.rows);

        const alliances = await client.query('SELECT COUNT(*) FROM "Alliance"');
        console.log('Total Alliances:', alliances.rows[0].count);

        const situations = await client.query('SELECT COUNT(*) FROM "Situation"');
        console.log('Total Situations:', situations.rows[0].count);

        console.log('--- Done ---');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkDb();

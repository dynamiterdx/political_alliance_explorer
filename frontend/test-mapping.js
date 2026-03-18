const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkDb() {
    const client = await pool.connect();
    try {
        const amRes = await client.query('SELECT * FROM "_AllianceMembers" LIMIT 5');
        console.log('Sample _AllianceMembers:', amRes.rows);
        const aRes = await client.query('SELECT id, name FROM "Actor" LIMIT 5');
        console.log('Sample Actors:', aRes.rows);
        const allRes = await client.query('SELECT id, name FROM "Alliance" LIMIT 5');
        console.log('Sample Alliances:', allRes.rows);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkDb();

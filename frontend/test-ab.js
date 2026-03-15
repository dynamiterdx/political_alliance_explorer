const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkDb() {
    const client = await pool.connect();
    try {
        console.log('--- A/B Column Mapping Check ---');
        const rels = await client.query('SELECT "A", "B" FROM "_WorldStateSituations" LIMIT 1');
        console.log('_WorldStateSituations snippet:', rels.rows[0]);

        const sit = await client.query('SELECT id FROM "Situation" WHERE id = $1', [rels.rows[0].A]);
        if (sit.rows.length > 0) {
            console.log('A maps to Situation');
        } else {
            console.log('A maps to WorldState');
        }

        const arels = await client.query('SELECT "A", "B" FROM "_WorldStateAlliances" LIMIT 1');
        const alli = await client.query('SELECT id FROM "Alliance" WHERE id = $1', [arels.rows[0].A]);
        if (alli.rows.length > 0) {
            console.log('A maps to Alliance for _WorldStateAlliances');
        }

        console.log('--- Done ---');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkDb();

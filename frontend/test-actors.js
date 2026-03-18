const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkDb() {
    const client = await pool.connect();
    try {
        const actors = await client.query('SELECT name, country_code FROM "Actor" LIMIT 5');
        console.log('Sample Actors:', actors.rows);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkDb();

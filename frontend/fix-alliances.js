const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixAlliances() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Find all alliances grouped by name
        const namesRes = await client.query('SELECT DISTINCT name FROM "Alliance"');

        for (const { name } of namesRes.rows) {
            // Get all alliance IDs for this name
            const alliancesRes = await client.query('SELECT id FROM "Alliance" WHERE name = $1', [name]);
            const ids = alliancesRes.rows.map(r => r.id);

            // Find one that has members
            let sourceId = null;
            let members = [];
            for (const id of ids) {
                const check = await client.query('SELECT "A" FROM "_AllianceMembers" WHERE "B" = $1', [id]);
                if (check.rows.length > 0) {
                    sourceId = id;
                    members = check.rows.map(r => r.A); // Actor IDs
                    break;
                }
            }

            // If we found members, copy to the others
            if (sourceId && members.length > 0) {
                for (const id of ids) {
                    if (id !== sourceId) {
                        for (const actorId of members) {
                            // Insert ignoring duplicates (well, pg doesn't have INSERT IGNORE, so we check first)
                            const exists = await client.query('SELECT 1 FROM "_AllianceMembers" WHERE "A"=$1 AND "B"=$2', [actorId, id]);
                            if (exists.rows.length === 0) {
                                await client.query('INSERT INTO "_AllianceMembers" ("A", "B") VALUES ($1, $2)', [actorId, id]);
                            }
                        }
                    }
                }
            }
        }

        await client.query('COMMIT');
        console.log('Successfully copied members to all duplicate alliances!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error:', e);
    } finally {
        client.release();
        process.exit(0);
    }
}

fixAlliances();

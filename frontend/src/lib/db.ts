import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export async function fetchWorldStateWithRelations(year: number) {
    const client = await pool.connect();
    try {
        const stateQuery = `
            SELECT * FROM "WorldState" 
            WHERE year = $1
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        const stateRes = await client.query(stateQuery, [year]);

        if (stateRes.rows.length === 0) {
            return null;
        }

        const worldState = stateRes.rows[0];

        const situationsQuery = `
            SELECT s.* 
            FROM "Situation" s
            JOIN "_WorldStateSituations" wss ON wss."A" = s.id
            WHERE wss."B" = $1
        `;
        const sitRes = await client.query(situationsQuery, [worldState.id]);

        const alliancesQuery = `
            SELECT a.* 
            FROM "Alliance" a
            JOIN "_WorldStateAlliances" wsa ON wsa."A" = a.id
            WHERE wsa."B" = $1
        `;
        const allRes = await client.query(alliancesQuery, [worldState.id]);

        worldState.situations = sitRes.rows;
        worldState.alliances = allRes.rows;

        return worldState;
    } finally {
        client.release();
    }
}

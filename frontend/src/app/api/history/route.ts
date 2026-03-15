import { NextResponse } from 'next/server';
import { fetchWorldStateWithRelations } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');

        if (!year) {
            return NextResponse.json({ error: 'Year parameter is required' }, { status: 400 });
        }

        const worldState = await fetchWorldStateWithRelations(parseInt(year));

        if (!worldState) {
            return NextResponse.json({ error: 'No data found for this year' }, { status: 404 });
        }

        return NextResponse.json(worldState);
    } catch (error) {
        console.error('History API Error:', error);
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
}



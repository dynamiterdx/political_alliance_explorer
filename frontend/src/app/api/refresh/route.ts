import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
    try {
        // Navigate up from frontend/ directory and execute the backend job
        const { stdout, stderr } = await execPromise('node ../backend/src/services/SynthesisJob.js');
        console.log('Refresh stdout:', stdout);
        if (stderr) console.error('Refresh stderr:', stderr);

        return NextResponse.json({ success: true, message: 'Refresh complete' });
    } catch (error) {
        console.error('Refresh Execution Error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}

import { IngestionService } from './IngestionService.js';
import { ExtractionEngine } from './ExtractionEngine.js';
import { StatePublisher } from './StatePublisher.js';

/**
 * SynthesisJob
 * 
 * Orchestrates the full Signal Processing Pipeline:
 * Ingestion -> Extraction -> Structuring -> Publishing
 */
export class SynthesisJob {
    constructor() {
        this.ingestion = new IngestionService();
        this.extractor = new ExtractionEngine();
        this.publisher = new StatePublisher();
    }

    /**
     * Runs a complete cycle of the pipeline to synthesize a new WorldState.
     * In a production environment, this would run hourly or daily via a cron job.
     */
    async runCycle() {
        console.log('[SynthesisJob] Starting new synthesis cycle...');
        const startTime = Date.now();

        try {
            // 1. Ingestion
            const rawSignals = await this.ingestion.fetchLatestSignals();
            console.log(`[SynthesisJob] Ingested ${rawSignals.length} raw signals.`);

            if (rawSignals.length === 0) {
                console.log('[SynthesisJob] No active signals. Cycle aborted.');
                return;
            }

            // 2. Extraction & Structuring
            const situations = await this.extractor.extractSituationsFromSignals(rawSignals);

            if (!situations || situations.length === 0) {
                console.log('[SynthesisJob] No material situations extracted. Cycle aborted.');
                return;
            }

            // 3. Prepare Payload & Metadata
            const payload = { situations };
            const metadata = {
                year: new Date().getFullYear(),
                freshness_status: 'live',
                source_type: 'live_scan',
                last_scan_time: new Date()
            };

            // 4. Publish to Canonical Store (PostgreSQL) and Cache (Redis)
            const newWorldState = await this.publisher.publishNewState(payload, metadata);

            const duration = Date.now() - startTime;
            console.log(`[SynthesisJob] Cycle completed successfully in ${duration}ms.`);
            console.log(`[SynthesisJob] Active WorldRevision ID: ${newWorldState.revision_id}`);
            return newWorldState;

        } catch (error) {
            console.error('[SynthesisJob] Critical failure during synthesis cycle:', error);
            throw error;
        } finally {
            await this.publisher.close();
        }
    }
}

// Automatically execute the cycle if this file is run directly
if (process.argv[1].endsWith('SynthesisJob.js')) {
    const job = new SynthesisJob();
    job.runCycle().catch(console.error);
}

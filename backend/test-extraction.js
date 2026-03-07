import { IngestionService } from './src/services/IngestionService.js';
import { ExtractionEngine } from './src/services/ExtractionEngine.js';

async function testExtraction() {
    const ingestion = new IngestionService();
    const extractor = new ExtractionEngine();

    try {
        const rawSignals = await ingestion.fetchLatestSignals();
        console.log(`[Test] Fetched ${rawSignals.length} raw signals.`);

        const situations = await extractor.extractSituationsFromSignals(rawSignals);
        console.log("[Test] Extracted Situations:\n", JSON.stringify(situations, null, 2));

    } catch (err) {
        console.error("[Test] Error:", err);
    }
}

testExtraction();

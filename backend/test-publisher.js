import { StatePublisher } from './src/services/StatePublisher.js';

async function test() {
    const publisher = new StatePublisher();

    const mockPayload = {
        situations: [
            {
                title: "Test Geopolitical Situation",
                type: "Political Crisis",
                status: "emerging",
                summary: "A test crisis for system validation.",
                causes: "Testing purposes",
                trajectory: "stabilizing",
                intensity_score: 5,
                trend_direction: "stable",
                confidence_level: "high"
            }
        ]
    };

    const metadata = {
        year: new Date().getFullYear(),
        freshness_status: "live",
        source_type: "live_scan",
        last_scan_time: new Date()
    };

    try {
        const activeState = await publisher.publishNewState(mockPayload, metadata);
        console.log("Test World State created:", activeState.id);
    } catch (e) {
        console.error("Test failed", e);
    } finally {
        await publisher.close();
    }
}

test();

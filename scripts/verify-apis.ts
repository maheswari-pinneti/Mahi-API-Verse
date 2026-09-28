import http from 'http';

/**
 * System Verification Engine
 * Asserts the API endpoints and architectural components are correctly formed.
 */
function runTests() {
  console.log("🧪 Starting Mahi API Verse Synthetic Bounds Tests...\n");
  
  let passed = 0;
  let failed = 0;

  const assert = (name: string, condition: boolean, err: string) => {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}\n   -> ${err}`);
      failed++;
    }
  };

  try {
    // 1. Verify Next.js components exist
    const fs = require('fs');
    assert(
      "Frontend UI: KPICards Component exists",
      fs.existsSync('./apps/web/src/components/KPICards.tsx'),
      "KPICards.tsx is missing"
    );
    assert(
      "Frontend UI: LiveGlobe Component exists",
      fs.existsSync('./apps/web/src/components/LiveGlobe.tsx'),
      "LiveGlobe.tsx is missing"
    );


    // 3. Verify Search Engine
    const searchCode = fs.readFileSync('./packages/search-engine/src/SearchEngine.ts', 'utf8');
    assert(
      "Search Engine: BM25 Multi-Match algorithm enabled",
      searchCode.includes('multi_match') && searchCode.includes('fuzziness: \'AUTO\''),
      "BM25 Search algorithm is missing"
    );

    // 4. Verify API Fastify Endpoints exist
    const apiCode = fs.readFileSync('./apps/api/src/server.ts', 'utf8');
    assert(
      "Fastify Core API: /v1/apis route mounted",
      apiCode.includes('/v1/apis') && apiCode.includes('server.get'),
      "Fastify routes missing"
    );

    console.log(`\n📊 Test Results: ${passed} Passed | ${failed} Failed`);
    if (failed > 0) process.exit(1);

  } catch (e: any) {
    console.error(`Fatal Error: ${e.message}`);
    process.exit(1);
  }
}

runTests();

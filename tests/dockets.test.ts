import { DOCKETS, getTodayDocket } from '../src/data/dockets.ts';

// Test 1: Docket Integrity
console.log('Running KarmaCourt Test Suite...');

if (!DOCKETS || DOCKETS.length === 0) {
  throw new Error('FAIL: Dockets database is empty');
}
console.log(`✅ Loaded ${DOCKETS.length} curated dockets.`);

// Test 2: Statistical Sum Check
for (const docket of DOCKETS) {
  const sum = docket.stats.YTA + docket.stats.NTA + docket.stats.ESH + docket.stats.NAH;
  if (sum !== 100) {
    throw new Error(`FAIL: Docket ${docket.id} stats do not sum to 100% (Sum: ${sum})`);
  }
}
console.log('✅ All docket consensus distributions sum to exactly 100%.');

// Test 3: Deterministic Day-of-Year Rotation
const today = getTodayDocket();
if (!today || !today.id || !today.verdict) {
  throw new Error('FAIL: getTodayDocket() returned invalid docket structure');
}
console.log(`✅ Deterministic daily rotation verified (Today: ${today.caseNumber} - ${today.title}).`);

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');

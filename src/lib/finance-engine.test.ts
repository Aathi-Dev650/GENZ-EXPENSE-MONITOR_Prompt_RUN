import { calculateFinancialMetrics, simulateDecision } from './finance-engine';
import { INITIAL_SEED_STATE } from './seed-data';

// Basic assertions test
function runEngineTests() {
  const metrics = calculateFinancialMetrics(INITIAL_SEED_STATE);

  console.log('Testing calculateFinancialMetrics:');
  console.log('Starting budget:', INITIAL_SEED_STATE.startingBudget);
  console.log('Total expenses:', metrics.totalExpenses);
  console.log('Remaining balance:', metrics.remainingBalance);
  console.log('Available to spend:', metrics.availableToSpend);
  console.log('Safe daily allowance:', metrics.safeDailyAllowance);
  console.log('Health score:', metrics.health.overallScore);
  console.log('Primary goal %:', metrics.primarySavingsGoal.percentage);

  // Assertions
  if (metrics.remainingBalance !== 7650) {
    throw new Error(`Expected remaining balance 7650, got ${metrics.remainingBalance}`);
  }
  if (metrics.totalExpenses !== 2350) {
    throw new Error(`Expected total expenses 2350, got ${metrics.totalExpenses}`);
  }
  if (metrics.primarySavingsGoal.percentage !== 73) {
    throw new Error(`Expected savings % 73, got ${metrics.primarySavingsGoal.percentage}`);
  }
  if (metrics.health.overallScore !== 78) {
    console.warn(`Health score is ${metrics.health.overallScore}`);
  }

  // Simulation test
  const simulation = simulateDecision(INITIAL_SEED_STATE, INITIAL_SEED_STATE.activeSimulation!);
  console.log('\nTesting simulateDecision for Wireless Headphones (₹2,499):');
  console.log('Before balance:', simulation.currentBalance, 'After balance:', simulation.projectedBalance);
  console.log('Before daily spend:', simulation.currentDailySpend, 'After daily spend:', simulation.projectedDailySpend);
  console.log('Verdict:', simulation.verdictTitle);
  console.log('Verdict description:', simulation.verdictDescription);

  if (simulation.projectedBalance !== 5151) {
    throw new Error(`Expected simulated balance 5151, got ${simulation.projectedBalance}`);
  }
  console.log('All financial engine tests passed successfully! ✅');
}

runEngineTests();

export type TransactionCategory =
  | 'food'
  | 'travel'
  | 'fun'
  | 'bills'
  | 'shopping'
  | 'health'
  | 'other';

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  day: number; // 1 to 30
  dateStr: string;
  note?: string;
  isSimulated?: boolean;
}

export interface Commitment {
  id: string;
  title: string;
  amount: number;
  category: TransactionCategory;
  dueDay: number; // 1 to 30
  isPaid: boolean;
  isActive: boolean;
  note?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDay: number; // 1 to 30
  category: TransactionCategory;
  isActive: boolean;
  color: string;
  frequency: 'monthly';
  icon: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDay: number;
  color: string;
  category?: string;
}

export interface DecisionScenario {
  id: string;
  title: string;
  cost: number;
  category: TransactionCategory;
  plannedDay: number;
  isEssential: boolean;
  paymentType: 'immediate' | 'scheduled';
  tagline?: string;
  note?: string;
  presetIcon?: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high';
export type VerdictType = 'safe' | 'tradeoff' | 'risky';

export interface DecisionImpact {
  currentBalance: number;
  projectedBalance: number;
  balanceDiff: number;

  currentDailySpend: number;
  projectedDailySpend: number;
  dailySpendDiff: number;

  currentSavingsPct: number;
  projectedSavingsPct: number;
  savingsPctDiff: number;

  currentHealthScore: number;
  projectedHealthScore: number;
  healthScoreDiff: number;

  currentRisk: RiskLevel;
  projectedRisk: RiskLevel;

  verdict: VerdictType;
  verdictTitle: string;
  verdictDescription: string;
  impactTag: 'LOW IMPACT' | 'MEDIUM IMPACT' | 'HIGH IMPACT';
  cheaperAlternativeCost: number;
  delayedRecommendedDay: number;
}

export interface FinancialHealthBreakdown {
  overallScore: number;
  spendingControl: number;
  savingsProgress: number;
  commitmentCoverage: number;
  riskLevel: number;
  statusLabel: 'EXCELLENT' | 'LOOKING GOOD' | 'MANAGEABLE' | 'AT RISK';
  statusColor: string;
  recommendations: Array<{
    id: string;
    type: 'warning' | 'tip' | 'praise';
    message: string;
    actionLabel?: string;
  }>;
}

export interface ForecastPoint {
  day: number;
  dayLabel: string;
  actualBalance?: number;
  projectedBalance?: number;
  commitmentsDeduction?: number;
  cautiousBalance?: number;
  bestCaseBalance?: number;
  isCurrentDay?: boolean;
}

export interface AppFinancialState {
  currentDay: number; // 1 to 30, defaults to 12
  startingBudget: number; // 10,000
  emergencyReserve: number; // default 500
  transactions: Transaction[];
  commitments: Commitment[];
  subscriptions: Subscription[];
  savingsGoals: SavingsGoal[];
  activeSimulation: DecisionScenario | null;
  customScenarios?: DecisionScenario[];
}

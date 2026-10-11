import React from 'react';
import { HeroBalanceCard } from '../dashboard/HeroBalanceCard';
import { ForecastChartCard } from '../dashboard/ForecastChartCard';
import { QuickMetricPills } from '../dashboard/QuickMetricPills';
import { DecisionSimulatorWidget } from '../dashboard/DecisionSimulatorWidget';
import { MoneyHealthSidebarCard } from '../dashboard/MoneyHealthSidebarCard';
import { CategorySpendingCard } from '../dashboard/CategorySpendingCard';
import { RecentTransactionsCard } from '../dashboard/RecentTransactionsCard';
import { NavTabId } from '../layout/Sidebar';

interface OverviewViewProps {
  onNavigate: (tab: NavTabId) => void;
  onOpenAddModal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top 3 Bento Grid: Hero Balance (left 5 cols) + Forecast Chart (middle 4 cols) + Money Health (right 3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Hero Card: 5 columns on desktop */}
        <div className="lg:col-span-5 flex flex-col">
          <HeroBalanceCard
            onAddExpense={onOpenAddModal}
            onSimulate={() => onNavigate('simulator')}
            onAddIncome={onOpenAddModal}
          />
        </div>

        {/* 30-Day Forecast Chart: 4 columns on desktop */}
        <div className="lg:col-span-4 flex flex-col">
          <ForecastChartCard onViewDetails={() => onNavigate('forecast')} />
        </div>

        {/* Money Health: 3 columns on desktop */}
        <div className="lg:col-span-3 flex flex-col">
          <MoneyHealthSidebarCard onViewDetails={() => onNavigate('health')} />
        </div>
      </div>

      {/* 3 Quick Metric Pills */}
      <QuickMetricPills onNavigate={onNavigate} />

      {/* Centerpiece: SHOULD I BUY IT? Decision Simulator */}
      <DecisionSimulatorWidget onOpenFullSimulator={() => onNavigate('simulator')} />

      {/* Bottom Section: Spending by Category (7 cols) + Recent Transactions (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <CategorySpendingCard
            onNavigateToTransactions={() => onNavigate('transactions')}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <RecentTransactionsCard
            onViewAll={() => onNavigate('transactions')}
          />
        </div>
      </div>
    </div>
  );
};

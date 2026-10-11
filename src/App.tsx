import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Sidebar, NavTabId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/ToastContainer';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { ProductionSettingsModal } from './components/modals/ProductionSettingsModal';

import { OverviewView } from './components/views/OverviewView';
import { SimulatorView } from './components/views/SimulatorView';
import { TransactionsView } from './components/views/TransactionsView';
import { GoalsView } from './components/views/GoalsView';
import { SubscriptionsView } from './components/views/SubscriptionsView';
import { ForecastView } from './components/views/ForecastView';
import { HealthView } from './components/views/HealthView';

import {
  Menu,
  LayoutDashboard,
  ReceiptText,
  Zap,
  Target,
  LineChart,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const mobileNavItems: { id: NavTabId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Spends', icon: ReceiptText },
    { id: 'simulator', label: 'Moves', icon: Zap },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'forecast', label: 'Forecast', icon: LineChart },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex">
      {/* Persistent Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <div className="relative">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden fixed bottom-20 right-4 z-40 p-3 rounded-full bg-[#00f59b] text-black shadow-2xl active:scale-95 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6 stroke-[2.5]" />
          </button>

          <Header
            onOpenAddModal={() => setShowAddModal(true)}
            onOpenQuickSimModal={() => setActiveTab('simulator')}
            onSelectNav={(tab) => setActiveTab(tab as NavTabId)}
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        </div>

        {/* View Content */}
        <main className="flex-1 px-4 lg:px-8 pt-6 pb-20 lg:pb-12 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAddModal={() => setShowAddModal(true)}
            />
          )}

          {activeTab === 'simulator' && <SimulatorView />}

          {activeTab === 'transactions' && (
            <TransactionsView onOpenAddModal={() => setShowAddModal(true)} />
          )}

          {activeTab === 'goals' && <GoalsView />}

          {activeTab === 'subscriptions' && <SubscriptionsView />}

          {activeTab === 'forecast' && <ForecastView />}

          {activeTab === 'health' && <HealthView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0a0e18]/95 backdrop-blur-xl border-t border-[#1d273c] px-2 py-2 flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-[#00f59b] font-bold' : 'text-gray-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Production Deployment & Budget Settings Modal */}
      <ProductionSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Global In-App Toast Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainApp />
    </FinanceProvider>
  );
}

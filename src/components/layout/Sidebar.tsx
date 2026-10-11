import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  Zap,
  Target,
  CalendarDays,
  LineChart,
  Trophy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { MascotBadge } from '../ui/MascotBadge';

export type NavTabId =
  | 'overview'
  | 'transactions'
  | 'simulator'
  | 'goals'
  | 'subscriptions'
  | 'forecast'
  | 'health';

interface SidebarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview' as NavTabId,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'transactions' as NavTabId,
      label: 'Transactions',
      icon: ReceiptText,
      badge: null,
    },
    {
      id: 'simulator' as NavTabId,
      label: 'Money Moves',
      icon: Zap,
      badge: '✨',
      badgeColor: 'text-[#a855f7]',
    },
    {
      id: 'goals' as NavTabId,
      label: 'Goals',
      icon: Target,
      badge: '✨',
      badgeColor: 'text-[#06b6d4]',
    },
    {
      id: 'subscriptions' as NavTabId,
      label: 'Subscriptions',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'forecast' as NavTabId,
      label: 'Forecast',
      icon: LineChart,
      badge: null,
    },
    {
      id: 'health' as NavTabId,
      label: 'Rewards',
      icon: Trophy,
      badge: null,
    },
  ];

  const handleSelect = (id: NavTabId) => {
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0e16] border-r border-[#192233] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex-1 flex flex-col overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-[#0e2118] border border-[#00f59b]/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,245,155,0.3)]">
              <MascotBadge size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-heading text-lg font-black tracking-wider text-[#00f59b]">
                MINTMATE
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Your money, your rules.</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#12281e] text-[#00f59b] border border-[#00f59b]/30 shadow-[0_0_15px_rgba(0,245,155,0.15)] font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-[#131b2c]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-[#00f59b]' : 'text-gray-400 group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-xs ${item.badgeColor} animate-pulse`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mascot Banner Card (Matches screenshot exactly) */}
          <div className="mt-6 mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12102e] via-[#1a1442] to-[#0c182a] border border-[#3b2b68] p-4 group">
            {/* Crown & star decorative icons */}
            <div className="absolute top-2 right-2 text-purple-400 text-sm">👑</div>
            <div className="absolute top-7 right-4 text-pink-400 text-xs">✨</div>

            <div className="relative z-10">
              <div className="text-[11px] font-black tracking-wider uppercase text-purple-300 leading-tight">
                SMALL MONEY MOVES
              </div>
              <div className="text-sm font-black font-heading text-[#00f59b] leading-tight mt-0.5">
                BIG MAIN CHARACTER ENERGY.
              </div>

              {/* Pixel character graphic illustration */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MascotBadge size="md" withCoins={true} />
                  <div className="text-[10px] text-gray-300 font-medium">
                    <span className="text-[#00f59b] font-bold">100%</span> in control
                  </div>
                </div>
                <button
                  onClick={() => handleSelect('simulator')}
                  className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-bold"
                >
                  Simulate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-[#192233] bg-[#090d15]">
          <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#131b2c] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                A
              </div>
              <div>
                <div className="text-xs font-bold text-white">Aathithyan</div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  ₹10k Budget Active
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </aside>
    </>
  );
};

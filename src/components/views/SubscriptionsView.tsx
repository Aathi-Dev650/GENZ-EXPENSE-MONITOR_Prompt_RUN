import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { TransactionCategory } from '../../types/finance';

export const SubscriptionsView: React.FC = () => {
  const {
    state,
    metrics,
    toggleSubscriptionActive,
    toggleCommitmentPaid,
    addCommitment,
    addSubscription,
  } = useFinance();

  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [subName, setSubName] = useState('');
  const [subAmount, setSubAmount] = useState('');
  const [subBillingDay, setSubBillingDay] = useState(15);

  // Calculate potential savings from cancelled subscriptions
  const inactiveSubs = state.subscriptions.filter((s) => !s.isActive);
  const totalPausedSavings = inactiveSubs.reduce((sum, s) => sum + s.amount, 0);
  const dailyBoost = Math.round(totalPausedSavings / Math.max(1, metrics.remainingDays));

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(subAmount);
    if (!subName.trim() || isNaN(amt) || amt <= 0) return;

    addSubscription({
      name: subName.trim(),
      amount: Math.round(amt),
      billingDay: Math.max(1, Math.min(30, subBillingDay)),
      category: 'bills',
      isActive: true,
      color: '#06B6D4',
      frequency: 'monthly',
      icon: 'Tv',
    });

    setSubName('');
    setSubAmount('');
    setShowAddSubModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-heading tracking-tight">
            Subscriptions & Monthly Commitments
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Auto-renewals and essential commitments reserved to keep you solvent all 30 days.
          </p>
        </div>

        <button
          onClick={() => setShowAddSubModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-xs shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Cancellation Simulator Banner */}
      <div className="rounded-[26px] bg-gradient-to-r from-[#172038] via-[#1a2b4c] to-[#12233f] border border-[#2d4875] p-5 lg:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-cyan-300 font-heading">
              SUBSCRIPTION CANCELLATION SIMULATOR
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {totalPausedSavings > 0
                ? `You're saving ${formatINR(totalPausedSavings)}/mo with paused services!`
                : 'Toggle off unused subscriptions to reclaim cash.'}
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              {totalPausedSavings > 0
                ? `This boosts your safe daily spend by +₹${dailyBoost}/day for the remaining ${metrics.remainingDays} days.`
                : 'Click any switch below to simulate cancellation without deleting records.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-gray-400 font-semibold">Protected Monthly Cash</div>
            <div className="text-xl font-black text-[#00f59b] font-heading">
              {formatINR(totalPausedSavings)}
            </div>
          </div>
        </div>
      </div>

      {/* Commitments Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-white font-heading tracking-wide uppercase flex items-center gap-2">
            <span>Essential Reserved Commitments</span>
            <span className="text-xs text-amber-400 font-normal">
              ({formatINR(metrics.unpaidCommitments)} pending)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {state.commitments.map((comm) => (
            <div
              key={comm.id}
              className={`p-5 rounded-[22px] border transition-all ${
                comm.isPaid
                  ? 'bg-[#101924]/60 border-[#1c2e42] opacity-70'
                  : 'bg-[#101726] border-[#222f47] shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{comm.title}</h4>
                  <div className="text-xs text-gray-400 mt-0.5">Due Day {comm.dueDay} of 30</div>
                </div>
                <div className="text-base font-black text-amber-300 font-heading">
                  {formatINR(comm.amount)}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1b273d] flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold ${
                    comm.isPaid ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {comm.isPaid ? '✓ Paid' : '⏳ Reserved in plan'}
                </span>

                <button
                  onClick={() => toggleCommitmentPaid(comm.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    comm.isPaid
                      ? 'bg-gray-800 text-gray-300'
                      : 'bg-[#00f59b]/20 hover:bg-[#00f59b]/30 text-[#00f59b] border border-[#00f59b]/40'
                  }`}
                >
                  {comm.isPaid ? 'Undo Paid' : 'Mark as Paid'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriptions Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-white font-heading tracking-wide uppercase">
            Active & Paused Subscriptions
          </h3>
        </div>

        <div className="rounded-[26px] bg-[#101625] border border-[#202c42] divide-y divide-[#1b253b] overflow-hidden shadow-xl">
          {state.subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#131b2d] transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs text-white"
                  style={{ backgroundColor: sub.color }}
                >
                  {sub.name.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white tracking-tight">{sub.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.isActive
                          ? 'bg-emerald-500/20 text-[#00f59b] border border-emerald-500/30'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {sub.isActive ? 'Active' : 'Paused / Cancelled'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Renews Day {sub.billingDay} of 30 · Monthly cycle
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-base font-extrabold text-white font-heading">
                    {formatINR(sub.amount)}
                  </div>
                  <div className="text-[10px] text-gray-400">/ month</div>
                </div>

                {/* Toggle Active Switch */}
                <button
                  onClick={() => toggleSubscriptionActive(sub.id)}
                  className="p-1 rounded-xl text-gray-400 hover:text-white transition-colors"
                  title={sub.isActive ? 'Simulate Cancel / Pause' : 'Reactivate'}
                >
                  {sub.isActive ? (
                    <ToggleRight className="w-8 h-8 text-[#00f59b]" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showAddSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111726] border border-[#232f48] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setShowAddSubModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#1b243a]/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white font-heading mb-4">Add Subscription</h3>

            <form onSubmit={handleAddSub} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Disney+ Hotstar, Apple Music, Gym"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#162035] border border-[#253456] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Monthly Cost (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  step={1}
                  placeholder="299"
                  value={subAmount}
                  onChange={(e) => setSubAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#162035] border border-[#253456] text-white text-sm font-bold focus:outline-none focus:border-[#00f59b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Renewal Day (1-30)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={subBillingDay}
                  onChange={(e) => setSubBillingDay(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-2xl bg-[#162035] border border-[#253456] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-sm shadow-lg mt-2"
              >
                Track Subscription
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

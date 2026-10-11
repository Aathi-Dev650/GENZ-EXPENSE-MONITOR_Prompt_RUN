import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import { Target, Plus, PiggyBank, Sparkles, CheckCircle2, ArrowDownRight, ArrowUpRight, X } from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { state, depositToGoal, withdrawFromGoal, addSavingsGoal, metrics } = useFinance();
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDay, setNewGoalDay] = useState(30);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newGoalTarget);
    if (!newGoalName.trim() || isNaN(target) || target <= 0) return;

    addSavingsGoal({
      name: newGoalName.trim(),
      targetAmount: Math.round(target),
      currentAmount: 0,
      targetDay: Math.max(1, Math.min(30, newGoalDay)),
      color: '#06B6D4',
      category: 'Target',
    });

    setNewGoalName('');
    setNewGoalTarget('');
    setShowNewGoalModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-heading tracking-tight flex items-center gap-2">
            <span>Savings Goals & Stashes</span>
            <span className="text-[#a855f7]">✨</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Lock in funds for your future moves. Stashed savings protect your emergency runway without counting as expenses.
          </p>
        </div>

        <button
          onClick={() => setShowNewGoalModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-xs shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#101726] border border-[#202c44]">
          <div className="text-[11px] text-gray-400 font-semibold">Total Stashed in Goals</div>
          <div className="text-2xl font-black text-white font-heading mt-0.5">
            {formatINR(metrics.totalSavingsReserved)}
          </div>
          <div className="text-[11px] text-[#00f59b] mt-0.5">Safely preserved</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101726] border border-[#202c44]">
          <div className="text-[11px] text-gray-400 font-semibold">Primary Cushion Goal</div>
          <div className="text-2xl font-black text-purple-300 font-heading mt-0.5">
            {metrics.primarySavingsGoal.percentage}%
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {formatINR(metrics.primarySavingsGoal.current)} of {formatINR(metrics.primarySavingsGoal.target)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101726] border border-[#202c44]">
          <div className="text-[11px] text-gray-400 font-semibold">Available Liquid Cash</div>
          <div className="text-2xl font-black text-cyan-300 font-heading mt-0.5">
            {formatINR(metrics.availableToSpend)}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">After reserved commitments</div>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {state.savingsGoals.map((goal) => {
          const pct = Math.min(
            100,
            Math.round((goal.currentAmount / Math.max(1, goal.targetAmount)) * 100)
          );
          const isComplete = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              {isComplete && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#00f59b] to-emerald-600 text-black font-black text-[10px] px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                  Goal Achieved 🎉
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border"
                    style={{
                      backgroundColor: `${goal.color}20`,
                      borderColor: `${goal.color}40`,
                      color: goal.color,
                    }}
                  >
                    🎯
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">{goal.name}</h4>
                    <p className="text-xs text-gray-400">Target by Day {goal.targetDay} of 30</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 my-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-300">
                      {formatINR(goal.currentAmount)}{' '}
                      <span className="text-gray-500 font-normal">/ {formatINR(goal.targetAmount)}</span>
                    </span>
                    <span className="font-mono text-sm" style={{ color: goal.color }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#192338] rounded-full overflow-hidden p-0.5 border border-[#243350]">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: goal.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick deposit and withdraw buttons */}
              <div className="pt-4 border-t border-[#1b253b] space-y-2">
                <div className="text-[11px] font-semibold text-gray-400">Stash Rupees:</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => depositToGoal(goal.id, 100)}
                    className="py-1.5 rounded-xl bg-[#172238] hover:bg-[#202e4c] border border-[#27385a] text-xs font-bold text-white transition-all"
                  >
                    +₹100
                  </button>
                  <button
                    onClick={() => depositToGoal(goal.id, 300)}
                    className="py-1.5 rounded-xl bg-[#172238] hover:bg-[#202e4c] border border-[#27385a] text-xs font-bold text-white transition-all"
                  >
                    +₹300
                  </button>
                  <button
                    onClick={() => depositToGoal(goal.id, 500)}
                    className="py-1.5 rounded-xl bg-[#00f59b]/20 hover:bg-[#00f59b]/30 border border-[#00f59b]/40 text-xs font-bold text-[#00f59b] transition-all"
                  >
                    +₹500
                  </button>
                </div>

                {goal.currentAmount > 0 && (
                  <button
                    onClick={() => withdrawFromGoal(goal.id, 200)}
                    className="w-full py-1 text-[11px] text-gray-400 hover:text-rose-400 transition-colors text-center"
                  >
                    Withdraw ₹200 to cash
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111726] border border-[#232f48] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setShowNewGoalModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#1b243a]/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white font-heading mb-4">Create Savings Goal</h3>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concert Ticket, Keyboard, Emergency Fund"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#162035] border border-[#253456] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={100}
                  step={50}
                  placeholder="2000"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#162035] border border-[#253456] text-white text-sm font-bold focus:outline-none focus:border-[#00f59b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target Day in Cycle (1-30)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={newGoalDay}
                  onChange={(e) => setNewGoalDay(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-2xl bg-[#162035] border border-[#253456] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-sm shadow-lg mt-2"
              >
                Set Goal 🎯
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

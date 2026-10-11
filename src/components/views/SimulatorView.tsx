import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import { PRESET_DECISION_SCENARIOS } from '../../lib/seed-data';
import { TransactionCategory, DecisionScenario } from '../../types/finance';
import {
  Zap,
  ArrowRight,
  Sparkles,
  Sliders,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Tag,
  Clock,
  ShieldAlert,
  ThumbsUp,
  XCircle,
  Plus,
} from 'lucide-react';
import { ProductComparisonStudio } from '../simulator/ProductComparisonStudio';
import { CatalogProduct } from '../../lib/product-catalog';

const CATEGORIES: { id: TransactionCategory; label: string; icon: string }[] = [
  { id: 'fun', label: 'Fun & Outings', icon: '🎮' },
  { id: 'shopping', label: 'Gear & Shopping', icon: '🛍️' },
  { id: 'food', label: 'Food & Dining', icon: '🍔' },
  { id: 'travel', label: 'Travel & Cab', icon: '✈️' },
  { id: 'bills', label: 'Bills & Essential', icon: '⚡' },
  { id: 'other', label: 'Other', icon: '📦' },
];

export const SimulatorView: React.FC = () => {
  const {
    state,
    metrics,
    activeScenario,
    simulation,
    allScenarios,
    saveCustomScenario,
    deleteCustomScenario,
    updateSimulationCost,
    updateSimulationField,
    setSimulationScenario,
    commitSimulation,
    addCommitment,
    showToast,
    playLaserSynth,
  } = useFinance();

  const [customTitle, setCustomTitle] = useState(activeScenario.title);
  const [costInput, setCostInput] = useState(activeScenario.cost.toString());
  const [scheduledDay, setScheduledDay] = useState(simulation.delayedRecommendedDay);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync inputs when active scenario tab changes
  useEffect(() => {
    setCustomTitle(activeScenario.title);
    setCostInput(activeScenario.cost.toString());
  }, [activeScenario.id]);

  const handleStartNewCustomMove = () => {
    playLaserSynth();
    const newCustom: DecisionScenario = {
      id: `custom-${Date.now()}`,
      title: 'White Shoes',
      cost: 2500,
      category: 'shopping',
      plannedDay: state.currentDay,
      isEssential: false,
      paymentType: 'immediate',
      tagline: 'Custom internet search move',
      note: 'Live product search scenario',
    };
    setSimulationScenario(newCustom);
    setCustomTitle('White Shoes');
    setCostInput('2500');
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 50);
    showToast(
      'New Move Created 👟',
      'Searching internet stores for "White Shoes" at ₹2,500! Type any product name to search.',
      'info'
    );
  };

  const handleCostChange = (newCost: number) => {
    const clamped = Math.max(0, Math.min(10000, newCost));
    setCostInput(clamped.toString());
    updateSimulationCost(clamped);
  };

  const handleSelectPreset = (preset: DecisionScenario) => {
    setSimulationScenario(preset);
    setCustomTitle(preset.title);
    setCostInput(preset.cost.toString());
  };

  const handleAdoptProduct = (product: CatalogProduct) => {
    setCustomTitle(product.name);
    setCostInput(product.price.toString());
    updateSimulationField({
      title: product.name,
      cost: product.price,
      category: product.category,
      tagline: product.whyBetter,
    });
    updateSimulationCost(product.price);
    showToast(
      'Product Adopted 🎯',
      `Simulation updated to "${product.name}" (${formatINR(product.price)})`,
      'info'
    );
  };

  const handleScheduleForLater = () => {
    addCommitment({
      title: activeScenario.title,
      amount: activeScenario.cost,
      category: activeScenario.category,
      dueDay: scheduledDay,
      isPaid: false,
      isActive: true,
      note: 'Scheduled via Decision Simulator',
    });
    showToast(
      'Purchase Scheduled 📅',
      `Reserved ₹${activeScenario.cost} for Day ${scheduledDay}. Safe daily spend rebalanced!`,
      'info'
    );
  };

  const handleSkipPurchase = () => {
    showToast(
      'Discipline Win! 🏆',
      `You passed on spending ₹${activeScenario.cost}. Your ₹${metrics.safeDailyAllowance}/day budget is safe!`,
      'success'
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Studio Banner */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#171138] via-[#1f164d] to-[#0f1f3d] border border-[#3f2972] p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
              <span>Interactive Decision Studio</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white font-heading tracking-tight">
              Should I Buy It? — Instant Plan Simulator
            </h2>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Simulate any purchase before spending a single rupee. See the immediate effect on your
              remaining balance, safe daily allowance, and 30-day forecast.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">
              Simulation Mode:
            </span>
            <span className="px-3 py-1 rounded-full bg-[#00F59B]/20 border border-[#00F59B]/40 text-[#00F59B] text-xs font-black font-mono">
              ZERO-RISK SANDBOX
            </span>
          </div>
        </div>
      </div>

      {/* Preset Decision Chips */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Select a Scenario or Create a Custom Move:
          </div>
          <button
            onClick={handleStartNewCustomMove}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00f59b]/20 hover:bg-[#00f59b]/30 border border-[#00f59b]/40 text-[#00f59b] text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Create Custom Move</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Dedicated Custom Creator Card */}
          <button
            onClick={handleStartNewCustomMove}
            className="p-3 rounded-2xl border-2 border-dashed border-[#00f59b]/50 bg-[#091a14] hover:bg-[#0f2920] text-left transition-all flex flex-col justify-between group cursor-pointer shadow-[0_0_15px_rgba(0,245,155,0.15)] hover:border-[#00f59b]"
          >
            <div>
              <div className="flex items-center gap-1.5 font-black text-sm text-[#00f59b]">
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Custom Move</span>
              </div>
              <div className="text-xs font-bold text-white mt-1">
                Your Idea
              </div>
            </div>
            <div className="text-[10px] text-emerald-300 font-medium mt-2">
              Type any item & price →
            </div>
          </button>

          {allScenarios.map((preset) => {
            const isSelected = activeScenario.id === preset.id;
            const isCustom = preset.id.startsWith('custom-') || preset.id.startsWith('move-');
            return (
              <div
                key={preset.id}
                className="relative group"
              >
                <button
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    isSelected
                      ? 'bg-[#201844] border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-[#101726] border-[#1e2a42] text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <div className="text-sm font-bold truncate pr-3">{preset.title}</div>
                  <div className="text-xs font-mono font-bold text-purple-300 mt-1">
                    {formatINR(preset.cost)}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5 truncate">{preset.tagline || 'Simulated move'}</div>
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00f59b]" />
                  )}
                </button>

                {isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomScenario(preset.id);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                    title="Delete custom move tab"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Studio Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Customization Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b253b]">
            <h3 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00f59b]" />
              <span>Purchase Parameters</span>
            </h3>
            <span className="text-xs text-gray-400 font-mono">Day {state.currentDay} Timeline</span>
          </div>

          {/* Item Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300">Purchase Name</label>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Live Internet Search</span>
              </span>
            </div>
            <input
              ref={titleInputRef}
              type="text"
              placeholder="e.g. White Shoes, Watch, Mechanical Keyboard, Air Fryer..."
              value={customTitle}
              onChange={(e) => {
                setCustomTitle(e.target.value);
                updateSimulationField({ title: e.target.value });
              }}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#162035] border border-[#253456] text-white text-sm font-semibold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder-gray-500 shadow-inner"
            />

            {/* Quick search idea pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { name: 'White Shoes', cost: 2500, cat: 'shopping' as TransactionCategory },
                { name: 'Watch', cost: 2800, cat: 'shopping' as TransactionCategory },
                { name: 'Mechanical Keyboard', cost: 2499, cat: 'fun' as TransactionCategory },
                { name: 'Air Fryer', cost: 2999, cat: 'bills' as TransactionCategory },
                { name: 'Noise Cancelling Headphones', cost: 2499, cat: 'fun' as TransactionCategory },
              ].map((pill) => (
                <button
                  key={pill.name}
                  type="button"
                  onClick={() => {
                    playLaserSynth();
                    setCustomTitle(pill.name);
                    setCostInput(pill.cost.toString());
                    updateSimulationField({
                      title: pill.name,
                      cost: pill.cost,
                      category: pill.cat,
                    });
                    updateSimulationCost(pill.cost);
                  }}
                  className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    customTitle.toLowerCase() === pill.name.toLowerCase()
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-[#151f33] border-[#22304d] text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {pill.name} (₹{pill.cost})
                </button>
              ))}
            </div>
          </div>

          {/* Cost Slider & Direct Number Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300">Cost (₹ INR)</label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-400">₹</span>
                <input
                  type="number"
                  min={0}
                  max={10000}
                  value={costInput}
                  onChange={(e) => {
                    setCostInput(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) updateSimulationCost(val);
                  }}
                  className="w-24 px-2 py-1 rounded-xl bg-[#162035] border border-[#253456] text-white text-sm font-mono font-bold text-right outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <input
              type="range"
              min={100}
              max={6000}
              step={50}
              value={activeScenario.cost}
              onChange={(e) => handleCostChange(Number(e.target.value))}
              className="w-full h-2.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
            />

            <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-mono">
              <span>₹100</span>
              <span>₹3,000</span>
              <span>₹6,000</span>
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateSimulationField({ category: cat.id })}
                  className={`p-2 rounded-xl text-left border text-xs flex items-center gap-1.5 transition-all ${
                    activeScenario.category === cat.id
                      ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                      : 'bg-[#151e33] border-[#222e49] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Essential vs Discretionary Toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Expense Priority</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateSimulationField({ isEssential: false })}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  !activeScenario.isEssential
                    ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                    : 'bg-[#151e33] border-[#222e49] text-gray-400'
                }`}
              >
                🎉 Discretionary (Wants)
              </button>
              <button
                type="button"
                onClick={() => updateSimulationField({ isEssential: true })}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  activeScenario.isEssential
                    ? 'bg-[#00f59b]/20 border-[#00f59b] text-[#00f59b]'
                    : 'bg-[#151e33] border-[#222e49] text-gray-400'
                }`}
              >
                🛡️ Essential (Needs)
              </button>
            </div>
          </div>

          {/* Save & Pin Tab Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                const title = customTitle.trim() || 'Custom Move';
                const cost = Math.max(1, Math.round(Number(costInput) || activeScenario.cost));
                saveCustomScenario({
                  ...activeScenario,
                  id: `custom-${Date.now()}`,
                  title,
                  cost,
                });
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-600/40 via-indigo-600/40 to-cyan-600/40 hover:from-purple-600/60 hover:to-cyan-600/60 border border-purple-500/50 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Save & Pin Tab ({customTitle || 'New Move'} - ₹{costInput})</span>
            </button>
          </div>
        </div>

        {/* Right: Detailed Before-vs-After & Verdict Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Verdict Banner */}
          <div
            className={`rounded-[26px] p-6 border shadow-xl transition-all ${
              simulation.verdict === 'risky'
                ? 'bg-[#29131a] border-rose-500/50 text-rose-100'
                : simulation.verdict === 'tradeoff'
                ? 'bg-[#261d12] border-amber-500/50 text-amber-100'
                : 'bg-[#0f241a] border-[#00f59b]/50 text-emerald-100'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">
                  {simulation.verdict === 'risky'
                    ? '🚨'
                    : simulation.verdict === 'tradeoff'
                    ? '😐'
                    : '😃'}
                </span>
                <div>
                  <div className="text-xs font-black tracking-wider uppercase opacity-75 font-heading">
                    DECISION VERDICT
                  </div>
                  <h3 className="text-xl font-black font-heading mt-0.5">
                    {simulation.verdictTitle}
                  </h3>
                  <p className="text-sm mt-1 leading-relaxed opacity-90">
                    {simulation.verdictDescription}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                  simulation.impactTag === 'HIGH IMPACT'
                    ? 'bg-rose-500 text-white'
                    : simulation.impactTag === 'MEDIUM IMPACT'
                    ? 'bg-amber-500 text-black'
                    : 'bg-[#00f59b] text-black'
                }`}
              >
                {simulation.impactTag}
              </span>
            </div>
          </div>

          {/* Before vs After Metric Cards Comparison */}
          <div className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl">
            <h4 className="text-xs font-black tracking-wider uppercase text-gray-400 font-heading mb-4">
              COMPLETE IMPACT BREAKDOWN
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* Balance */}
              <div className="p-3.5 rounded-2xl bg-[#141b2c] border border-[#222e48]">
                <div className="text-[11px] text-gray-400 font-semibold">Remaining Balance</div>
                <div className="text-sm text-gray-400 line-through mt-1">
                  {formatINR(simulation.currentBalance)}
                </div>
                <div className="text-lg font-black text-white font-heading">
                  {formatINR(simulation.projectedBalance)}
                </div>
                <div className="text-[10px] text-rose-400 font-mono mt-0.5">
                  -{formatINR(simulation.balanceDiff)}
                </div>
              </div>

              {/* Safe Daily Spend */}
              <div className="p-3.5 rounded-2xl bg-[#141b2c] border border-[#222e48]">
                <div className="text-[11px] text-gray-400 font-semibold">Safe Daily Spend</div>
                <div className="text-sm text-gray-400 line-through mt-1">
                  {formatINR(simulation.currentDailySpend)}/d
                </div>
                <div className="text-lg font-black text-cyan-300 font-heading">
                  {formatINR(simulation.projectedDailySpend)}/d
                </div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                  -{formatINR(simulation.dailySpendDiff)}/day
                </div>
              </div>

              {/* Savings Goal Progress */}
              <div className="p-3.5 rounded-2xl bg-[#141b2c] border border-[#222e48]">
                <div className="text-[11px] text-gray-400 font-semibold">Savings Goal</div>
                <div className="text-sm text-gray-400 line-through mt-1">
                  {simulation.currentSavingsPct}%
                </div>
                <div className="text-lg font-black text-purple-300 font-heading">
                  {simulation.projectedSavingsPct}%
                </div>
                <div className="text-[10px] text-purple-400 font-mono mt-0.5">
                  -{simulation.savingsPctDiff}% pace
                </div>
              </div>

              {/* Health Score */}
              <div className="p-3.5 rounded-2xl bg-[#141b2c] border border-[#222e48]">
                <div className="text-[11px] text-gray-400 font-semibold">Financial Health</div>
                <div className="text-sm text-gray-400 line-through mt-1">
                  {simulation.currentHealthScore}/100
                </div>
                <div
                  className={`text-lg font-black font-heading ${
                    simulation.projectedHealthScore >= 70
                      ? 'text-[#00f59b]'
                      : simulation.projectedHealthScore >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {simulation.projectedHealthScore}/100
                </div>
                <div className="text-[10px] text-rose-400 font-mono mt-0.5">
                  -{simulation.healthScoreDiff} pts
                </div>
              </div>
            </div>
          </div>

          {/* 4 Action Pathways */}
          <div className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-gray-400 font-heading mb-2">
              TAKE ACTION ON THIS MOVE
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Pathway 1: Buy Now (Commit as real expense) */}
              <button
                onClick={commitSimulation}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#00f59b] via-[#05e08f] to-[#06b6d4] hover:from-[#10b981] hover:to-[#0891b2] text-black font-black text-sm shadow-[0_0_25px_rgba(0,245,155,0.45)] transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black stroke-black" />
                <span>DROP THIS MOVE ⚡ ({formatINR(activeScenario.cost)})</span>
              </button>

              {/* Pathway 2: Cheaper Alternative */}
              <button
                onClick={() => handleCostChange(simulation.cheaperAlternativeCost)}
                className="py-3 px-4 rounded-2xl bg-[#192238] hover:bg-[#23314f] border border-[#2c3d61] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Tag className="w-4 h-4 text-cyan-400" />
                <span>Try ₹{simulation.cheaperAlternativeCost} Alternative</span>
              </button>

              {/* Pathway 3: Schedule for Later */}
              <div className="p-2 rounded-2xl bg-[#151c2e] border border-[#222f4b] flex items-center gap-2">
                <input
                  type="number"
                  min={state.currentDay + 1}
                  max={30}
                  value={scheduledDay}
                  onChange={(e) => setScheduledDay(Number(e.target.value))}
                  className="w-16 px-2 py-1.5 rounded-xl bg-[#1b253d] text-white text-xs font-bold text-center border border-gray-600 outline-none"
                />
                <button
                  onClick={handleScheduleForLater}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 text-xs font-bold transition-all text-center"
                >
                  Delay to Day {scheduledDay}
                </button>
              </div>

              {/* Pathway 4: Skip */}
              <button
                onClick={handleSkipPurchase}
                className="py-3 px-4 rounded-2xl bg-[#191924] hover:bg-[#252538] border border-[#30304a] text-gray-300 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Skip / Save the Money</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real Products & Cheaper Options Studio */}
      <div className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl">
        <ProductComparisonStudio onSelectProduct={handleAdoptProduct} />
      </div>
    </div>
  );
};

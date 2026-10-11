import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import {
  Zap,
  ArrowRight,
  Headphones,
  Edit2,
  Calendar,
  Sparkles,
  Tag,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  Star,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react';
import { PRESET_DECISION_SCENARIOS } from '../../lib/seed-data';
import { getProductSuggestionsForCost, CatalogProduct } from '../../lib/product-catalog';

interface DecisionSimulatorWidgetProps {
  onOpenFullSimulator: () => void;
}

export const DecisionSimulatorWidget: React.FC<DecisionSimulatorWidgetProps> = ({
  onOpenFullSimulator,
}) => {
  const {
    activeScenario,
    simulation,
    allScenarios,
    commitSimulation,
    updateSimulationCost,
    updateSimulationField,
    resetSimulationToPreset,
    playLaserSynth,
    showToast,
  } = useFinance();

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempCost, setTempCost] = useState(activeScenario.cost.toString());
  const [showCatalogPicks, setShowCatalogPicks] = useState(true);

  const { currentTierProducts, cheaperOptions } = getProductSuggestionsForCost(
    activeScenario.category,
    activeScenario.cost,
    activeScenario.title
  );

  const handlePriceSave = () => {
    const val = parseFloat(tempCost);
    if (!isNaN(val) && val >= 0) {
      updateSimulationCost(Math.round(val));
    }
    setIsEditingPrice(false);
  };

  const handleTryCheaper = () => {
    if (cheaperOptions.length > 0) {
      handleSelectProduct(cheaperOptions[0]);
    } else {
      updateSimulationCost(simulation.cheaperAlternativeCost);
      setTempCost(simulation.cheaperAlternativeCost.toString());
    }
  };

  const handleSelectProduct = (product: CatalogProduct) => {
    playLaserSynth();
    updateSimulationField({
      title: product.name,
      cost: product.price,
      category: product.category,
      tagline: product.whyBetter,
    });
    updateSimulationCost(product.price);
    setTempCost(product.price.toString());
    showToast(
      'Adopted Choice 🎯',
      `Switched to "${product.name}" (${formatINR(product.price)})`,
      'info'
    );
  };

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-[#0d1322] border border-[#23314a] p-6 lg:p-7 shadow-2xl space-y-6">
      {/* Background glow and subtle dots */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <h3 className="text-base lg:text-lg font-black tracking-wider uppercase text-white font-heading flex items-center gap-1.5">
              <span>SHOULD I BUY IT?</span>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Simulate a purchase and see the real impact on your plan.
          </p>
        </div>

        {/* Preset quick switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-gray-400 font-medium">Tabs:</span>
          {allScenarios.slice(0, 4).map((preset) => (
            <button
              key={preset.id}
              onClick={() => resetSimulationToPreset(preset.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                activeScenario.id === preset.id
                  ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                  : 'bg-[#151e33] border-[#222e49] text-gray-400 hover:text-white'
              }`}
            >
              {preset.title.split(' ')[0]} ({formatINR(preset.cost)})
            </button>
          ))}
          <button
            onClick={onOpenFullSimulator}
            className="px-2 py-1 rounded-xl bg-[#1d273f] hover:bg-[#273555] text-gray-300 hover:text-white border border-[#2b3a5c] text-xs flex items-center gap-1 cursor-pointer transition-all"
            title="Open Studio"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Studio</span>
          </button>
          <button
            onClick={onOpenFullSimulator}
            className="px-2.5 py-1 rounded-xl bg-[#00f59b]/20 hover:bg-[#00f59b]/30 text-[#00f59b] border border-[#00f59b]/40 text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Create a custom simulated move"
          >
            <Plus className="w-3 h-3 stroke-[3]" />
            <span>+ New Move</span>
          </button>
        </div>
      </div>

      {/* Main 3-Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Section 1: Product Card (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#131b2e] border border-[#23314e] p-5 flex flex-col justify-between relative group">
          <div className="flex items-start justify-between">
            {/* Visual Headphone / Gadget Illustration */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1f283d] to-[#2d3a56] border border-[#3b4b6f] flex items-center justify-center text-white shadow-inner relative overflow-hidden">
              <Headphones className="w-9 h-9 text-gray-200 drop-shadow-md group-hover:scale-110 transition-transform" />
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00f59b] animate-ping" />
            </div>

            <button
              onClick={() => setIsEditingPrice(!isEditingPrice)}
              className="p-2 rounded-xl bg-[#1b253d] hover:bg-[#253353] text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Edit scenario price"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-bold text-white tracking-tight">
              {activeScenario.title}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{activeScenario.tagline}</p>

            {/* Price Pill */}
            <div className="mt-3">
              {isEditingPrice ? (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      autoFocus
                      value={tempCost}
                      onChange={(e) => setTempCost(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePriceSave()}
                      className="w-full pl-6 pr-2 py-1 rounded-xl bg-[#1a2236] border border-purple-500 text-white font-bold text-sm outline-none"
                    />
                  </div>
                  <button
                    onClick={handlePriceSave}
                    className="px-2.5 py-1 rounded-xl bg-[#00f59b] text-black text-xs font-bold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingPrice(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-[#7c3aed] text-white font-black text-lg tracking-tight shadow-md cursor-pointer hover:bg-[#6d28d9] transition-all"
                  title="Click to edit price"
                >
                  <span>{formatINR(activeScenario.cost)}</span>
                  <Edit2 className="w-3 h-3 text-purple-200 opacity-70" />
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 pt-4 mt-2 border-t border-[#1e2a44] text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-[#1a2238] border border-[#2a3857] text-gray-300 flex items-center gap-1 font-medium capitalize">
              🎮 {activeScenario.category}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#1a2238] border border-[#2a3857] text-gray-300 flex items-center gap-1 font-medium">
              📅 Day {activeScenario.plannedDay}
            </span>
          </div>
        </div>

        {/* Section 2: IMPACT PREVIEW (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#111829] border border-[#212e47] p-5 flex flex-col justify-between">
          <div className="text-[11px] font-black tracking-wider uppercase text-purple-300 font-heading mb-3">
            IMPACT PREVIEW
          </div>

          <div className="grid grid-cols-2 gap-3 relative py-1">
            {/* Center Arrow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#1b253b] border border-[#2d3d5f] flex items-center justify-center text-purple-400 z-10 shadow-lg">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Before Column */}
            <div className="space-y-3.5 pr-2">
              <div className="text-[11px] font-bold text-gray-400">Before Purchase</div>

              <div>
                <div className="text-base font-extrabold text-white font-heading">
                  {formatINR(simulation.currentBalance)}
                </div>
                <div className="text-[11px] text-gray-400">Balance</div>
              </div>

              <div>
                <div className="text-base font-extrabold text-white font-heading">
                  {formatINR(simulation.currentDailySpend)}
                </div>
                <div className="text-[11px] text-gray-400">Daily spend</div>
              </div>

              <div>
                <div className="text-base font-extrabold text-white font-heading">
                  {simulation.currentSavingsPct}%
                </div>
                <div className="text-[11px] text-gray-400">Savings goal</div>
              </div>

              <div>
                <div className="text-base font-extrabold text-[#00f59b] font-heading">
                  {simulation.currentHealthScore}
                  <span className="text-xs text-gray-400 font-normal">/100</span>
                </div>
                <div className="text-[11px] text-gray-400">Money health</div>
              </div>
            </div>

            {/* After Column */}
            <div className="space-y-3.5 pl-3 border-l border-[#1d273f]">
              <div className="text-[11px] font-bold text-purple-300">After Purchase</div>

              <div>
                <div className="text-base font-extrabold text-white font-heading">
                  {formatINR(simulation.projectedBalance)}
                </div>
                <div className="text-[11px] text-gray-400">Balance</div>
              </div>

              <div>
                <div className="text-base font-extrabold text-purple-300 font-heading">
                  {formatINR(simulation.projectedDailySpend)}
                </div>
                <div className="text-[11px] text-gray-400">Daily spend</div>
              </div>

              <div>
                <div className="text-base font-extrabold text-purple-300 font-heading">
                  {simulation.projectedSavingsPct}%
                </div>
                <div className="text-[11px] text-gray-400">Savings goal</div>
              </div>

              <div>
                <div
                  className={`text-base font-extrabold font-heading ${
                    simulation.projectedHealthScore >= 70
                      ? 'text-[#00f59b]'
                      : simulation.projectedHealthScore >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {simulation.projectedHealthScore}
                  <span className="text-xs text-gray-400 font-normal">/100</span>
                </div>
                <div className="text-[11px] text-gray-400">Money health</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: VERDICT & ACTIONS (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#141b2d] border border-[#273654] p-5 flex flex-col justify-between relative overflow-hidden">
          {/* Top Tag */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black tracking-wider uppercase text-gray-400 font-heading">
              VERDICT
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                simulation.impactTag === 'HIGH IMPACT'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : simulation.impactTag === 'MEDIUM IMPACT'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {simulation.impactTag}
            </span>
          </div>

          {/* Verdict Box */}
          <div className="my-2">
            <div className="flex items-start gap-2.5 mb-2">
              <span className="text-2xl">
                {simulation.verdict === 'risky'
                  ? '🚨'
                  : simulation.verdict === 'tradeoff'
                  ? '😐'
                  : '😃'}
              </span>
              <h4 className="text-base font-extrabold text-amber-300 font-heading leading-tight">
                {simulation.verdictTitle}
              </h4>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {simulation.verdictDescription}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-[#202c46]">
            {/* Primary Action: Commit / Buy Now */}
            <button
              onClick={commitSimulation}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#06b6d4] hover:from-[#7c3aed] hover:to-[#0891b2] text-white font-black text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              <span>DROP THIS MOVE ⚡</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Try Cheaper Option */}
            <button
              onClick={handleTryCheaper}
              className="w-full py-2 px-3 rounded-xl bg-[#1b2438] hover:bg-[#25324d] border border-[#2a3857] text-gray-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Tag className="w-3 h-3 text-cyan-400" />
              <span>
                {cheaperOptions.length > 0
                  ? `Try ${cheaperOptions[0].name.split(' ')[0]} (${formatINR(cheaperOptions[0].price)} · Save ${formatINR(activeScenario.cost - cheaperOptions[0].price)})`
                  : `Try a Cheaper Option (${formatINR(simulation.cheaperAlternativeCost)})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Products & Cheaper Options Drawer on Hero Widget */}
      <div className="pt-4 border-t border-[#1d273f]">
        <button
          onClick={() => setShowCatalogPicks(!showCatalogPicks)}
          className="w-full flex items-center justify-between text-xs font-bold text-gray-300 hover:text-white py-1 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00f59b]" />
            <span>Real Products & Smart Cheaper Picks in this Price Range:</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-cyan-400">
            <span>{showCatalogPicks ? 'Hide Options' : 'Show Verified Picks'}</span>
            {showCatalogPicks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showCatalogPicks && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            {cheaperOptions.map((opt) => {
              const savings = activeScenario.cost - opt.price;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectProduct(opt)}
                  className="p-3 rounded-xl bg-[#121929] hover:bg-[#18233a] border border-[#21304a] hover:border-[#00f59b]/50 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold text-[#00f59b]">
                        Save {formatINR(savings)}
                      </span>
                      <span className="text-amber-400 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-400" /> {opt.rating}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white tracking-tight truncate">
                      {opt.name}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                      {opt.whyBetter}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-[#1a263d] flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-300 font-mono">
                      {formatINR(opt.price)}
                    </span>
                    <span className="text-[10px] text-gray-400 group-hover:text-[#00f59b] font-bold transition-colors">
                      Switch →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

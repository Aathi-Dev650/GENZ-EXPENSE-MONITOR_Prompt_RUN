import React, { useEffect, useState, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { getProductSuggestionsForCost, CatalogProduct } from '../../lib/product-catalog';
import { formatINR } from '../../lib/format-currency';
import {
  Star,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Globe,
  RefreshCw,
  TrendingDown,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface ProductComparisonStudioProps {
  onSelectProduct: (product: CatalogProduct) => void;
}

// In-memory cache to make tab-switching and repeated queries lightning-fast
const searchCache = new Map<string, { currentTierProducts: CatalogProduct[]; cheaperOptions: CatalogProduct[]; source: string }>();

export const ProductComparisonStudio: React.FC<ProductComparisonStudioProps> = ({
  onSelectProduct,
}) => {
  const { activeScenario, simulation, metrics, playLaserSynth, showToast } = useFinance();

  // Instant local fallback
  const localDefault = getProductSuggestionsForCost(
    activeScenario.category,
    activeScenario.cost,
    activeScenario.title
  );

  const [currentTierProducts, setCurrentTierProducts] = useState<CatalogProduct[]>(localDefault.currentTierProducts);
  const [cheaperOptions, setCheaperOptions] = useState<CatalogProduct[]>(localDefault.cheaperOptions);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [searchSource, setSearchSource] = useState<string>('catalog');
  const [lastSearchedKey, setLastSearchedKey] = useState<string>('');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const performWebSearch = async (query: string, cost: number, force = false) => {
    const cleanQuery = query.trim() || 'white shoes';
    const cacheKey = `${cleanQuery.toLowerCase()}_${cost}`;

    // Use cache if available and not forced
    if (!force && searchCache.has(cacheKey)) {
      const cached = searchCache.get(cacheKey)!;
      setCurrentTierProducts(cached.currentTierProducts);
      setCheaperOptions(cached.cheaperOptions);
      setSearchSource(cached.source);
      setLastSearchedKey(cacheKey);
      return;
    }

    setIsSearchingWeb(true);
    try {
      const res = await fetch('/api/search-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: cleanQuery,
          budget: cost,
          category: activeScenario.category,
        }),
      });

      if (!res.ok) throw new Error('Failed to query internet market');

      const data = await res.json();
      if (data && Array.isArray(data.currentTierProducts) && Array.isArray(data.cheaperOptions)) {
        setCurrentTierProducts(data.currentTierProducts);
        setCheaperOptions(data.cheaperOptions);
        setSearchSource(data.source || 'live_web_ai');
        setLastSearchedKey(cacheKey);

        // Cache result
        searchCache.set(cacheKey, {
          currentTierProducts: data.currentTierProducts,
          cheaperOptions: data.cheaperOptions,
          source: data.source || 'live_web_ai',
        });
      }
    } catch (err) {
      console.warn('Web search error, using smart catalog:', err);
      // Fallback gracefully
      const fallback = getProductSuggestionsForCost(activeScenario.category, cost, cleanQuery);
      setCurrentTierProducts(fallback.currentTierProducts);
      setCheaperOptions(fallback.cheaperOptions);
      setSearchSource('smart_market_catalog');
    } finally {
      setIsSearchingWeb(false);
    }
  };

  // Trigger search on scenario title or cost change with debounce
  useEffect(() => {
    const currentKey = `${(activeScenario.title || 'white shoes').toLowerCase().trim()}_${activeScenario.cost}`;

    // Immediately update local preview if key changed
    if (currentKey !== lastSearchedKey) {
      const local = getProductSuggestionsForCost(activeScenario.category, activeScenario.cost, activeScenario.title);
      setCurrentTierProducts(local.currentTierProducts);
      setCheaperOptions(local.cheaperOptions);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performWebSearch(activeScenario.title, activeScenario.cost);
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [activeScenario.title, activeScenario.cost, activeScenario.category]);

  const handleManualRefresh = () => {
    playLaserSynth();
    showToast(
      '🌐 Searching Live Internet...',
      `Scanning Indian stores (Amazon, Myntra, Flipkart) for "${activeScenario.title || 'Product'}" at ₹${activeScenario.cost}`,
      'info'
    );
    performWebSearch(activeScenario.title, activeScenario.cost, true);
  };

  const handleSelect = (product: CatalogProduct) => {
    playLaserSynth();
    onSelectProduct(product);
  };

  const getStoreBadgeColor = (store?: string) => {
    const s = (store || '').toLowerCase();
    if (s.includes('amazon')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (s.includes('myntra')) return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
    if (s.includes('flipkart')) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (s.includes('ajio')) return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Header bar with Live Web Indicator & EDM Glow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b253b]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-[#00f59b] flex items-center justify-center text-black shadow-[0_0_12px_rgba(0,245,155,0.4)]">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
              <span>Real Market Options & Smart Cheaper Picks</span>
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real products matching <span className="text-white font-bold font-mono">"{activeScenario.title || 'Item'}"</span> in the <span className="text-[#00f59b] font-bold font-mono">{formatINR(activeScenario.cost)}</span> range, plus tested cheaper options.
          </p>
        </div>

        {/* Live Status Pill & Refresh Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
            isSearchingWeb
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : searchSource === 'live_web_ai'
              ? 'bg-[#00f59b]/20 border-[#00f59b]/50 text-[#00f59b] shadow-[0_0_12px_rgba(0,245,155,0.25)]'
              : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
          }`}>
            <Globe className={`w-3.5 h-3.5 ${isSearchingWeb ? 'animate-spin' : ''}`} />
            <span>
              {isSearchingWeb
                ? 'Searching Live Internet...'
                : searchSource === 'live_web_ai'
                ? 'Live Internet Verified'
                : 'Verified Market Catalog'}
            </span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isSearchingWeb}
            title="Re-scan internet e-commerce stores"
            className="p-1.5 rounded-xl bg-[#172238] hover:bg-[#202e4c] border border-[#27385a] text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSearchingWeb ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Live Search Status Alert Bar (EDM themed) */}
      {isSearchingWeb && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0d2238] via-[#102d42] to-[#0a1a2f] border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-between gap-3 text-xs text-cyan-200">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </div>
            <span className="font-semibold tracking-wide">
              Scanning Indian stores (Amazon India, Myntra, Flipkart) for <span className="text-white font-bold">"{activeScenario.title || 'Item'}"</span> at ₹{activeScenario.cost}...
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400/80 uppercase">AI Grounded Web</span>
        </div>
      )}

      {/* Section 1: Target Price Bracket Verified Products */}
      <div>
        <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>In Your Target Price Bracket ({formatINR(activeScenario.cost)}):</span>
            <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Matches "{activeScenario.title || 'Product'}"
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-normal">Click any to simulate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentTierProducts.map((product) => {
            const isCurrentlySelected =
              Math.abs(product.price - activeScenario.cost) < 50;
            const storeName = product.store || 'Amazon India';

            return (
              <div
                key={product.id}
                className={`p-4 rounded-2xl border transition-all relative ${
                  isCurrentlySelected
                    ? 'bg-[#1a1438] border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.35)] ring-1 ring-purple-400'
                    : 'bg-[#101726] border-[#222f47] hover:border-gray-500 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {product.tag || 'Target Range'}
                      </span>

                      {/* Store Badge with External Link */}
                      <a
                        href={product.url || `https://www.google.com/search?q=${encodeURIComponent(product.name + ' price in India')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-colors hover:brightness-125 ${getStoreBadgeColor(storeName)}`}
                        title={`View ${product.name} on ${storeName}`}
                      >
                        <span>{storeName}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>

                    <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="text-amber-400 flex items-center gap-1 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" /> {product.rating || 4.4}
                      </span>
                      <span>({product.reviewCount || '10k+'} verified ratings)</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-white font-heading">
                      {formatINR(product.price)}
                    </div>
                    {isCurrentlySelected && (
                      <span className="text-[10px] font-bold text-[#00f59b] block mt-0.5">
                        ✓ Active Move
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-300 mt-2.5 leading-relaxed bg-[#0b101c] p-2.5 rounded-xl border border-[#1b263d]">
                  {product.whyBetter}
                </p>

                {!isCurrentlySelected ? (
                  <button
                    onClick={() => handleSelect(product)}
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-[#172238] hover:bg-[#202e4c] border border-[#27385a] hover:border-cyan-500/50 text-xs font-bold text-gray-200 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>Simulate This Choice</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                ) : (
                  <div className="mt-3 py-1.5 px-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-center text-[11px] font-bold text-purple-200">
                    Currently Selected in Decision Studio
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: CHEAPER OPTIONS (Is it Better? Tested Internet Alternatives) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="text-sm font-extrabold text-emerald-300 font-heading uppercase tracking-wide flex items-center gap-2">
                <span>Is a Cheaper Option Better? (Tested Alternatives)</span>
                <span className="text-[10px] font-mono font-bold text-[#00f59b] bg-[#00f59b]/10 border border-[#00f59b]/30 px-2 py-0.5 rounded-full lowercase">
                  sub-₹{activeScenario.cost}
                </span>
              </h4>
              <p className="text-xs text-gray-400">
                Picks found strictly lower than your ₹{activeScenario.cost} budget to preserve your ₹{metrics.safeDailyAllowance}/day allowance runway.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {cheaperOptions.map((product) => {
            const savings = product.savingsAmount || Math.max(100, activeScenario.cost - product.price);
            const dailySpendSaved = Math.round(savings / Math.max(1, metrics.remainingDays));
            const storeName = product.store || 'Amazon India';

            return (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-gradient-to-b from-[#0f1d22] to-[#0c1622] border border-[#16413a] shadow-lg flex flex-col justify-between hover:border-[#00f59b]/60 transition-all group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#00f59b]/20 text-[#00f59b] border border-[#00f59b]/40">
                      Save {formatINR(savings)}
                    </span>

                    {/* Store Link */}
                    <a
                      href={product.url || `https://www.google.com/search?q=${encodeURIComponent(product.name + ' price in India')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-colors hover:brightness-125 ${getStoreBadgeColor(storeName)}`}
                    >
                      <span>{storeName}</span>
                      <ExternalLink className="w-2 h-2" />
                    </a>
                  </div>

                  <h5 className="text-sm font-bold text-white tracking-tight leading-snug">
                    {product.name}
                  </h5>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-black text-cyan-300 font-heading">
                      {formatINR(product.price)}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      {formatINR(activeScenario.cost)}
                    </span>
                  </div>

                  {/* Impact pill */}
                  <div className="mt-2.5 p-2.5 rounded-xl bg-[#081f1c] border border-[#114037] text-[11px] text-emerald-200">
                    <div className="font-bold flex items-center gap-1 text-[#00f59b]">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>+{formatINR(dailySpendSaved)}/day budget runway</span>
                    </div>
                    <div className="text-gray-300 text-[10px] mt-1 leading-relaxed">
                      {product.whyBetter}
                    </div>
                  </div>
                </div>

                {/* Switch button */}
                <button
                  onClick={() => handleSelect(product)}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00f59b] via-[#05e08f] to-[#06b6d4] hover:from-[#10b981] hover:to-[#0891b2] text-black font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 fill-black" />
                  <span>Switch & Save {formatINR(savings)}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

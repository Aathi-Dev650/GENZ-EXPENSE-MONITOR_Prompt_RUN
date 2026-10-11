import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import { Transaction, TransactionCategory, TransactionType } from '../../types/finance';
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Tag,
} from 'lucide-react';

interface TransactionsViewProps {
  onOpenAddModal: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onOpenAddModal }) => {
  const { state, deleteTransaction, metrics } = useFinance();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredTransactions = state.transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || tx.category === selectedCategory;
    const matchesType = selectedType === 'all' || tx.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'food', label: '🍔 Food' },
    { id: 'travel', label: '✈️ Travel' },
    { id: 'fun', label: '🎮 Fun' },
    { id: 'bills', label: '⚡ Bills' },
    { id: 'shopping', label: '🛍️ Shopping' },
    { id: 'health', label: '💪 Health' },
    { id: 'other', label: '📦 Other' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Metrics summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-heading tracking-tight">
            Transactions & Cash Moves
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Every verified transaction recorded during your 30-day budget cycle.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-xs shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Record Transaction</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#101726] border border-[#202c44] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-400 font-semibold">Total Spent Outflows</div>
            <div className="text-xl font-black text-rose-400 font-heading mt-0.5">
              -{formatINR(metrics.totalExpenses)}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101726] border border-[#202c44] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-400 font-semibold">Total Inflow / Budget</div>
            <div className="text-xl font-black text-[#00f59b] font-heading mt-0.5">
              {formatINR(state.startingBudget + metrics.totalIncome)}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#00f59b]/10 text-[#00f59b] flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101726] border border-[#202c44] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-400 font-semibold">Active Liquid Balance</div>
            <div className="text-xl font-black text-white font-heading mt-0.5">
              {formatINR(metrics.remainingBalance)}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#101726] border border-[#202c44] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#172138] border border-[#253456] flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, place, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
          />
        </div>

        {/* Categories scrollable pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                  : 'bg-[#151e33] border-[#222e49] text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-[26px] bg-[#101625] border border-[#202c42] overflow-hidden shadow-xl">
        <div className="divide-y divide-[#1b253b]">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Receipt className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <div className="text-base font-bold text-white">No transactions found</div>
              <p className="text-xs mt-1">Try clearing filters or search term</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#141d30] transition-colors group"
              >
                {/* Left details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-[#00f59b]/20 text-[#00f59b] border border-[#00f59b]/30'
                        : 'bg-[#1e2a44] text-gray-300 border border-[#2a3857]'
                    }`}
                  >
                    {tx.category === 'food'
                      ? '🍔'
                      : tx.category === 'travel'
                      ? '✈️'
                      : tx.category === 'fun'
                      ? '🎮'
                      : tx.category === 'bills'
                      ? '⚡'
                      : '🛍️'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-tight truncate">
                        {tx.title}
                      </h4>
                      {tx.isSimulated && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          Simulated
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span className="capitalize font-medium text-gray-300">
                        {tx.category}
                      </span>
                      <span>·</span>
                      <span>Day {tx.day} ({tx.dateStr})</span>
                      {tx.note && (
                        <>
                          <span>·</span>
                          <span className="italic text-gray-500 truncate max-w-xs">{tx.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right amount and actions */}
                <div className="flex items-center gap-4 shrink-0">
                  <div
                    className={`text-base font-extrabold font-mono tracking-tight text-right ${
                      tx.type === 'income' ? 'text-[#00f59b]' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatINR(tx.amount)}
                  </div>

                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

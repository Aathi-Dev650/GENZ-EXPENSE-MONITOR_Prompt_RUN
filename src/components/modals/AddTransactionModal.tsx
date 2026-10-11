import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionCategory, TransactionType } from '../../types/finance';
import { X, Plus, ArrowDownRight, ArrowUpRight, Tag, Calendar, DollarSign } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: TransactionCategory; label: string; icon: string; color: string }[] = [
  { id: 'food', label: 'Food & Dining', icon: '🍔', color: '#10B981' },
  { id: 'travel', label: 'Travel & Cab', icon: '✈️', color: '#06B6D4' },
  { id: 'fun', label: 'Fun & Outings', icon: '🎮', color: '#F43F5E' },
  { id: 'bills', label: 'Bills & Utilities', icon: '⚡', color: '#EAB308' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#A855F7' },
  { id: 'health', label: 'Health & Fitness', icon: '💪', color: '#EC4899' },
  { id: 'other', label: 'Other', icon: '📦', color: '#64748B' },
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { state, addTransaction } = useFinance();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [day, setDay] = useState<number>(state.currentDay);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;

    addTransaction({
      title: title.trim(),
      amount: Math.round(numAmount),
      type,
      category,
      day: Math.max(1, Math.min(30, day)),
      dateStr: day === state.currentDay ? 'Today' : `Day ${day}`,
      note: note.trim() || undefined,
    });

    // Reset and close
    setTitle('');
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#111726] border border-[#232f48] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#1b243a]/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#00f59b]/20 text-[#00f59b] flex items-center justify-center border border-[#00f59b]/30">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">Record New Money Move</h3>
            <p className="text-xs text-gray-400">Updates balance, daily allowance, and health score</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector */}
          <div className="flex rounded-2xl bg-[#172136] p-1 border border-[#22304d]">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
              Expense Outflow
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                type === 'income'
                  ? 'bg-[#00f59b]/20 text-[#00f59b] border border-[#00f59b]/40 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-[#00f59b]" />
              Income Inflow
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Swiggy Bowl, Metro Card, Freelance Stash"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#162035] border border-[#253456] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f59b]"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Amount (₹ INR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                required
                min={1}
                step={1}
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#162035] border border-[#253456] text-white text-base font-bold placeholder-gray-500 focus:outline-none focus:border-[#00f59b]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-xl text-left border text-xs flex items-center gap-2 transition-all ${
                    category === cat.id
                      ? 'bg-[#1e2a42] border-[#00f59b] text-white font-semibold'
                      : 'bg-[#151e33] border-[#222e49] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Day */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Day in 30-Day Budget Cycle (Day {day})
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-2xl bg-[#162035] border border-[#253456] text-white text-sm focus:outline-none focus:border-[#00f59b]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(0,245,155,0.4)] transition-all active:scale-[0.98] mt-2"
          >
            Confirm & Update Financial Plan 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

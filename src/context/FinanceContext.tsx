import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AppFinancialState,
  Commitment,
  DecisionImpact,
  DecisionScenario,
  SavingsGoal,
  Subscription,
  Transaction,
} from '../types/finance';
import { INITIAL_SEED_STATE, PRESET_DECISION_SCENARIOS } from '../lib/seed-data';
import {
  calculateFinancialMetrics,
  CalculatedFinancials,
  simulateDecision,
} from '../lib/finance-engine';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface FinanceContextType {
  state: AppFinancialState;
  metrics: CalculatedFinancials;
  simulation: DecisionImpact;
  activeScenario: DecisionScenario;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;

  // Sound system
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playEdmDrop: () => void;
  playLaserSynth: () => void;

  // Timeline
  setCurrentDay: (day: number) => void;

  // Transactions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updated: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Commitments
  toggleCommitmentPaid: (id: string) => void;
  addCommitment: (comm: Omit<Commitment, 'id'>) => void;
  deleteCommitment: (id: string) => void;

  // Subscriptions
  toggleSubscriptionActive: (id: string) => void;
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  deleteSubscription: (id: string) => void;

  // Goals
  depositToGoal: (goalId: string, amount: number) => void;
  withdrawFromGoal: (goalId: string, amount: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;

  // Simulation
  allScenarios: DecisionScenario[];
  setSimulationScenario: (scenario: DecisionScenario) => void;
  saveCustomScenario: (scenario: DecisionScenario) => void;
  deleteCustomScenario: (id: string) => void;
  updateSimulationCost: (cost: number) => void;
  updateSimulationField: (field: Partial<DecisionScenario>) => void;
  commitSimulation: () => void;
  resetSimulationToPreset: (presetId: string) => void;

  // Production deployment features
  updateBudgetSettings: (startingBudget: number, emergencyReserve: number) => void;
  exportDataAsJson: () => void;
  exportTransactionsCsv: () => void;
  importDataFromJson: (jsonData: string) => boolean;
  startCleanBudget: (startingBudget: number) => void;
  resetToDemoData: () => void;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const STORAGE_KEY = 'mintmate_app_state_v1';
const SOUND_KEY = 'mintmate_sound_enabled_v1';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppFinancialState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading state from localStorage', e);
    }
    return INITIAL_SEED_STATE;
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }, [state]);

  // Persist sound preference
  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, JSON.stringify(isSoundEnabled));
    } catch (e) {
      console.error('Error saving sound preference', e);
    }
  }, [isSoundEnabled]);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  const showToast = (
    title: string,
    message: string,
    type: ToastMessage['type'] = 'success'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // EDM Synthesizer Sound Engine using Web Audio API
  const getAudioContext = (): AudioContext | null => {
    if (!isSoundEnabled) return null;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      return new AudioCtx();
    } catch {
      return null;
    }
  };

  const playLaserSynth = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio context may be restricted before user gesture
    }
  };

  const playEdmDrop = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // 1. Sub Bass 808 drop
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sine';
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);

      bass.frequency.setValueAtTime(140, now);
      bass.frequency.exponentialRampToValueAtTime(45, now + 0.45);
      bassGain.gain.setValueAtTime(0.25, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      bass.start(now);
      bass.stop(now + 0.55);

      // 2. High Laser Chime Sweep
      const lead = ctx.createOscillator();
      const leadGain = ctx.createGain();
      lead.type = 'triangle';
      lead.connect(leadGain);
      leadGain.connect(ctx.destination);

      lead.frequency.setValueAtTime(440, now);
      lead.frequency.exponentialRampToValueAtTime(880, now + 0.18);
      lead.frequency.exponentialRampToValueAtTime(1320, now + 0.35);
      leadGain.gain.setValueAtTime(0.12, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      lead.start(now);
      lead.stop(now + 0.4);
    } catch {
      // safely ignore
    }
  };

  const playGoalChime = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        const start = now + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {
      // safely ignore
    }
  };

  const activeScenario: DecisionScenario =
    state.activeSimulation || INITIAL_SEED_STATE.activeSimulation!;

  const metrics = calculateFinancialMetrics(state, 0);
  const simulation = simulateDecision(state, activeScenario);

  // Timeline
  const setCurrentDay = (day: number) => {
    const clamped = Math.max(1, Math.min(30, day));
    setState((prev) => ({ ...prev, currentDay: clamped }));
    playLaserSynth();
    showToast('Day Updated', `Viewing financial timeline on Day ${clamped} of 30`, 'info');
  };

  // Transactions CRUD
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));
    playLaserSynth();
    showToast(
      'Transaction Logged',
      `${tx.type === 'income' ? 'Received' : 'Spent'} ₹${tx.amount.toLocaleString('en-IN')} for "${tx.title}"`
    );
  };

  const editTransaction = (id: string, updated: Partial<Transaction>) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    }));
    showToast('Updated', 'Transaction updated successfully');
  };

  const deleteTransaction = (id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
    playLaserSynth();
    showToast('Removed', 'Transaction deleted and budget restored', 'warning');
  };

  // Commitments
  const toggleCommitmentPaid = (id: string) => {
    setState((prev) => {
      const comm = prev.commitments.find((c) => c.id === id);
      if (!comm) return prev;
      const newPaid = !comm.isPaid;

      let newTransactions = prev.transactions;
      if (newPaid) {
        newTransactions = [
          {
            id: `tx-comm-${comm.id}-${Date.now()}`,
            title: `Paid: ${comm.title}`,
            amount: comm.amount,
            type: 'expense',
            category: comm.category,
            day: prev.currentDay,
            dateStr: 'Today',
            note: 'Paid monthly commitment',
          },
          ...prev.transactions,
        ];
      }

      return {
        ...prev,
        transactions: newTransactions,
        commitments: prev.commitments.map((c) => (c.id === id ? { ...c, isPaid: newPaid } : c)),
      };
    });
    playLaserSynth();
    showToast('Commitment Updated', 'Commitment status toggled');
  };

  const addCommitment = (comm: Omit<Commitment, 'id'>) => {
    const newComm: Commitment = {
      ...comm,
      id: `comm-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      commitments: [...prev.commitments, newComm],
    }));
    playLaserSynth();
    showToast('Commitment Added', `₹${comm.amount} reserved for ${comm.title}`);
  };

  const deleteCommitment = (id: string) => {
    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.filter((c) => c.id !== id),
    }));
    showToast('Commitment Removed', 'Commitment removed from future deductions');
  };

  // Subscriptions
  const toggleSubscriptionActive = (id: string) => {
    setState((prev) => {
      const target = prev.subscriptions.find((s) => s.id === id);
      const nextActive = target ? !target.isActive : false;
      return {
        ...prev,
        subscriptions: prev.subscriptions.map((s) =>
          s.id === id ? { ...s, isActive: nextActive } : s
        ),
      };
    });
    playLaserSynth();
    showToast(
      'Subscription Toggled',
      'Recurring forecast recalculated without this subscription'
    );
  };

  const addSubscription = (sub: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...sub,
      id: `sub-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      subscriptions: [...prev.subscriptions, newSub],
    }));
    playLaserSynth();
    showToast('Subscription Added', `${sub.name} (₹${sub.amount}/mo) added to tracking`);
  };

  const deleteSubscription = (id: string) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((s) => s.id !== id),
    }));
    showToast('Deleted', 'Subscription deleted');
  };

  // Goals
  const depositToGoal = (goalId: string, amount: number) => {
    if (amount <= 0) return;
    let targetGoalReached = false;
    setState((prev) => {
      const updatedGoals = prev.savingsGoals.map((g) => {
        if (g.id === goalId) {
          const nextAmount = g.currentAmount + amount;
          if (nextAmount >= g.targetAmount && g.currentAmount < g.targetAmount) {
            targetGoalReached = true;
          }
          return { ...g, currentAmount: nextAmount };
        }
        return g;
      });
      return { ...prev, savingsGoals: updatedGoals };
    });

    if (targetGoalReached) {
      playGoalChime();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00F59B', '#A855F7', '#FFD700', '#06B6D4', '#F43F5E'],
      });
      showToast('🎉 GOAL ACHIEVED!', 'You successfully hit your savings target! Main character moves!', 'success');
    } else {
      playLaserSynth();
      showToast('Savings Stashed', `₹${amount} added to your goal!`);
    }
  };

  const withdrawFromGoal = (goalId: string, amount: number) => {
    if (amount <= 0) return;
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: Math.max(0, g.currentAmount - amount) } : g
      ),
    }));
    playLaserSynth();
    showToast('Funds Released', `₹${amount} transferred back to available cash`);
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal],
    }));
    playLaserSynth();
    showToast('Goal Created', `Created savings target: ${goal.name}`);
  };

  // Decision Simulator
  const setSimulationScenario = (scenario: DecisionScenario) => {
    setState((prev) => ({
      ...prev,
      activeSimulation: scenario,
    }));
    playLaserSynth();
  };

  const updateSimulationCost = (cost: number) => {
    const validCost = Math.max(0, Math.round(cost));
    setState((prev) => {
      const active = prev.activeSimulation || INITIAL_SEED_STATE.activeSimulation!;
      return {
        ...prev,
        activeSimulation: {
          ...active,
          cost: validCost,
        },
      };
    });
  };

  const updateSimulationField = (field: Partial<DecisionScenario>) => {
    setState((prev) => {
      const active = prev.activeSimulation || INITIAL_SEED_STATE.activeSimulation!;
      return {
        ...prev,
        activeSimulation: {
          ...active,
          ...field,
        },
      };
    });
  };

  const commitSimulation = () => {
    const scenario = activeScenario;
    if (!scenario || scenario.cost <= 0) return;

    const newTx: Transaction = {
      id: `tx-sim-committed-${Date.now()}`,
      title: scenario.title,
      amount: scenario.cost,
      type: 'expense',
      category: scenario.category,
      day: state.currentDay,
      dateStr: 'Today',
      note: `Committed from Decision Simulator: ${scenario.tagline || ''}`,
    };

    setState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));

    // EDM Drop + Laser Confetti
    playEdmDrop();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#00F59B', '#A855F7', '#F43F5E', '#06B6D4', '#FFE600'],
    });

    showToast(
      'DROP COMMITTED! ⚡',
      `Purchased "${scenario.title}" for ₹${scenario.cost}. Your balance and daily spend are live!`,
      'success'
    );
  };

  const allScenarios: DecisionScenario[] = [
    ...(state.customScenarios || []),
    ...PRESET_DECISION_SCENARIOS.filter(
      (preset) => !(state.customScenarios || []).some((c) => c.id === preset.id)
    ),
  ];

  const saveCustomScenario = (scenario: DecisionScenario) => {
    setState((prev) => {
      const existing = prev.customScenarios || [];
      const updated = [scenario, ...existing.filter((s) => s.id !== scenario.id)];
      return {
        ...prev,
        customScenarios: updated,
        activeSimulation: scenario,
      };
    });
    playLaserSynth();
    showToast(
      'Scenario Saved as Tab 🎯',
      `"${scenario.title}" added to your simulation tabs!`,
      'success'
    );
  };

  const deleteCustomScenario = (id: string) => {
    setState((prev) => ({
      ...prev,
      customScenarios: (prev.customScenarios || []).filter((s) => s.id !== id),
      activeSimulation:
        prev.activeSimulation?.id === id
          ? PRESET_DECISION_SCENARIOS[0]
          : prev.activeSimulation,
    }));
    playLaserSynth();
    showToast('Tab Removed', 'Scenario tab deleted', 'info');
  };

  const resetSimulationToPreset = (presetId: string) => {
    const found =
      allScenarios.find((p) => p.id === presetId) || PRESET_DECISION_SCENARIOS[0];
    setSimulationScenario(found);
  };

  // Production Deployment Methods
  const updateBudgetSettings = (startingBudget: number, emergencyReserve: number) => {
    const validBudget = Math.max(1000, Math.round(startingBudget));
    const validReserve = Math.max(0, Math.round(emergencyReserve));
    setState((prev) => ({
      ...prev,
      startingBudget: validBudget,
      emergencyReserve: validReserve,
    }));
    playLaserSynth();
    showToast(
      'Budget Configured ⚙️',
      `Updated starting budget to ₹${validBudget.toLocaleString('en-IN')}`,
      'success'
    );
  };

  const exportDataAsJson = () => {
    try {
      const jsonStr = JSON.stringify(state, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mintmate-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      playLaserSynth();
      showToast('Export Complete', 'Financial data backup downloaded', 'success');
    } catch {
      showToast('Export Failed', 'Could not export backup data', 'warning');
    }
  };

  const exportTransactionsCsv = () => {
    try {
      const headers = ['ID', 'Date', 'Day', 'Title', 'Type', 'Category', 'Amount (INR)', 'Note'];
      const rows = state.transactions.map((tx) => [
        tx.id,
        tx.dateStr,
        tx.day,
        `"${tx.title.replace(/"/g, '""')}"`,
        tx.type,
        tx.category,
        tx.amount,
        `"${(tx.note || '').replace(/"/g, '""')}"`,
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mintmate-statement-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      playLaserSynth();
      showToast('Statement Exported', 'Transactions CSV statement downloaded', 'success');
    } catch {
      showToast('Export Failed', 'Could not export CSV', 'warning');
    }
  };

  const importDataFromJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (typeof parsed.startingBudget === 'number' && Array.isArray(parsed.transactions)) {
        setState(parsed);
        playGoalChime();
        showToast('Restore Success', 'All financial records and plan restored', 'success');
        return true;
      }
      throw new Error('Invalid format');
    } catch {
      showToast('Import Failed', 'Uploaded file is not a valid MintMate backup JSON', 'warning');
      return false;
    }
  };

  const startCleanBudget = (startingBudget: number) => {
    const cleanState: AppFinancialState = {
      currentDay: 1,
      startingBudget: Math.max(1000, Math.round(startingBudget)),
      emergencyReserve: 500,
      transactions: [],
      commitments: [],
      subscriptions: [],
      savingsGoals: [
        {
          id: 'goal-emergency',
          name: 'Emergency Cushion',
          targetAmount: Math.round(startingBudget * 0.25),
          currentAmount: 0,
          targetDay: 30,
          color: '#00F59B',
          category: 'Safety',
        },
      ],
      activeSimulation: INITIAL_SEED_STATE.activeSimulation,
    };
    setState(cleanState);
    playLaserSynth();
    showToast('Clean Budget Initialized', `Started fresh Day 1 plan with ₹${startingBudget.toLocaleString('en-IN')}`, 'info');
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_SEED_STATE);
    playLaserSynth();
    showToast('Demo State Restored', 'Restored Day 12 demo state with ₹10,000 budget', 'info');
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        metrics,
        simulation,
        activeScenario,
        toasts,
        dismissToast,
        showToast,
        isSoundEnabled,
        toggleSound,
        playEdmDrop,
        playLaserSynth,
        setCurrentDay,
        addTransaction,
        editTransaction,
        deleteTransaction,
        toggleCommitmentPaid,
        addCommitment,
        deleteCommitment,
        toggleSubscriptionActive,
        addSubscription,
        deleteSubscription,
        depositToGoal,
        withdrawFromGoal,
        addSavingsGoal,
        allScenarios,
        setSimulationScenario,
        saveCustomScenario,
        deleteCustomScenario,
        updateSimulationCost,
        updateSimulationField,
        commitSimulation,
        resetSimulationToPreset,
        updateBudgetSettings,
        exportDataAsJson,
        exportTransactionsCsv,
        importDataFromJson,
        startCleanBudget,
        resetToDemoData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

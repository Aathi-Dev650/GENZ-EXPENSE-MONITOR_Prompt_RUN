import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { generateForecastData } from '../../lib/finance-engine';
import { formatCompactINR, formatINR } from '../../lib/format-currency';
import { LineChart as ChartIcon, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Info } from 'lucide-react';

export const ForecastView: React.FC = () => {
  const { state, metrics } = useFinance();
  const [selectedDay, setSelectedDay] = useState(state.currentDay);

  const forecastData = generateForecastData(state);
  const activePoint = forecastData.find((p) => p.day === selectedDay) || forecastData[state.currentDay - 1];
  const finalPoint = forecastData[forecastData.length - 1];

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-heading tracking-tight flex items-center gap-2">
            <span>30-Day Cash-Flow Forecast</span>
            <span className="text-cyan-400">📈</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Transparent simulation of your financial runway through Day 30 under 3 spending scenarios.
          </p>
        </div>

        {/* Risk Badge */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-semibold">30-Day Plan Risk:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              metrics.riskLevel === 'low'
                ? 'bg-emerald-500/20 text-[#00f59b] border border-emerald-500/40'
                : metrics.riskLevel === 'moderate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {metrics.riskLevel === 'low'
              ? 'Low Risk (Solvent)'
              : metrics.riskLevel === 'moderate'
              ? 'Moderate (Tight)'
              : 'High (Overdraw Risk)'}
          </span>
        </div>
      </div>

      {/* 3 Scenarios Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Expected */}
        <div className="p-5 rounded-[22px] bg-[#101726] border border-[#202c44] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300">Expected Pace (₹{metrics.safeDailyAllowance}/d)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading mt-2">
            {formatINR(finalPoint?.projectedBalance || 0)}
          </div>
          <p className="text-xs text-gray-400 mt-1">Projected surplus remaining on Day 30</p>
        </div>

        {/* Best Case */}
        <div className="p-5 rounded-[22px] bg-[#101726] border border-[#202c44] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#00f59b]">Best Case (Disciplined 25% Saver)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f59b]" />
          </div>
          <div className="text-2xl font-black text-[#00f59b] font-heading mt-2">
            {formatINR(finalPoint?.bestCaseBalance || 0)}
          </div>
          <p className="text-xs text-gray-400 mt-1">Maximized surplus for savings goals</p>
        </div>

        {/* Cautious */}
        <div className="p-5 rounded-[22px] bg-[#101726] border border-[#202c44] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">Cautious (Impulse Buffer +25%)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-heading mt-2">
            {formatINR(finalPoint?.cautiousBalance || 0)}
          </div>
          <p className="text-xs text-gray-400 mt-1">Safety cushion under higher spending</p>
        </div>
      </div>

      {/* Main Interactive Forecast Chart */}
      <div className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-extrabold text-white font-heading">
              Interactive 30-Day Trajectory
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Click any point on the chart to inspect balances and upcoming deductions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
              <span>Actual (Day 1..{state.currentDay})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
              <span>Projected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F59B]" />
              <span>Best Case</span>
            </div>
          </div>
        </div>

        {/* Recharts Curve */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={forecastData}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setSelectedDay(e.activePayload[0].payload.day);
                }
              }}
              margin={{ top: 15, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="actualArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="day"
                tickFormatter={(d) => `Day ${d}`}
                stroke="#475569"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#1e293b' }}
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => formatCompactINR(v)}
                domain={[0, 10000]}
                axisLine={{ stroke: '#1e293b' }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const pt = payload[0].payload;
                  return (
                    <div className="bg-[#0b0f17] border border-[#2b3752] rounded-xl p-3 shadow-xl text-xs">
                      <div className="font-bold text-white mb-1">Day {pt.day} of 30</div>
                      {pt.actualBalance !== undefined && (
                        <div className="text-purple-400 font-semibold">
                          Actual: {formatINR(pt.actualBalance)}
                        </div>
                      )}
                      {pt.projectedBalance !== undefined && (
                        <div className="text-cyan-400 font-semibold">
                          Projected: {formatINR(pt.projectedBalance)}
                        </div>
                      )}
                      {pt.bestCaseBalance !== undefined && (
                        <div className="text-[#00f59b] font-semibold">
                          Best Case: {formatINR(pt.bestCaseBalance)}
                        </div>
                      )}
                      {pt.commitmentsDeduction && (
                        <div className="text-rose-400 text-[11px] mt-1 font-bold">
                          ⚠️ Commitment Due: -{formatINR(pt.commitmentsDeduction)}
                        </div>
                      )}
                    </div>
                  );
                }}
              />

              <ReferenceLine
                x={state.currentDay}
                stroke="#FFFFFF"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: `Today (Day ${state.currentDay})`,
                  position: 'top',
                  fill: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              />

              <Area
                type="monotone"
                dataKey="actualBalance"
                stroke="#8B5CF6"
                strokeWidth={3}
                fill="url(#actualArea)"
              />
              <Line
                type="monotone"
                dataKey="projectedBalance"
                stroke="#06B6D4"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="bestCaseBalance"
                stroke="#00F59B"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cautiousBalance"
                stroke="#F59E0B"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Day Inspector */}
        <div className="mt-6 p-4 rounded-2xl bg-[#141d30] border border-[#23314d] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black font-heading">
              D{selectedDay}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Inspecting Timeline: Day {selectedDay} of 30
              </div>
              <div className="text-xs text-gray-400">
                {selectedDay <= state.currentDay
                  ? `Recorded actual: ${formatINR(activePoint?.actualBalance || 0)}`
                  : `Projected expected: ${formatINR(activePoint?.projectedBalance || 0)}`}
              </div>
            </div>
          </div>

          {activePoint?.commitmentsDeduction && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
              Scheduled commitment due: -{formatINR(activePoint.commitmentsDeduction)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

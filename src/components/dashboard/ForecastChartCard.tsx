import React from 'react';
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
import { ArrowUpRight } from 'lucide-react';

interface ForecastChartCardProps {
  onViewDetails: () => void;
}

export const ForecastChartCard: React.FC<ForecastChartCardProps> = ({ onViewDetails }) => {
  const { state } = useFinance();
  const data = generateForecastData(state);

  return (
    <div className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl flex flex-col justify-between">
      {/* Header and Legend */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white font-heading">
            <span className="text-[#a855f7]">30-DAY</span>
            <span>MONEY FORECAST</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </div>

          <button
            onClick={onViewDetails}
            className="px-3 py-1 rounded-xl bg-[#192236] hover:bg-[#222f4b] border border-[#263554] text-gray-300 text-xs font-semibold transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-300 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
            <span>Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] ring-2 ring-[#06B6D4]/30" />
            <span>Projected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
            <span>Commitments</span>
          </div>
        </div>
      </div>

      {/* Recharts Forecast Plot */}
      <div className="h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              tickFormatter={(d) => `Day ${d}`}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              ticks={[1, 6, 12, 18, 24, 30]}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
            />
            <YAxis
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(v) => formatCompactINR(v)}
              domain={[0, 10000]}
              ticks={[0, 2500, 5000, 7500, 10000]}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const pt = payload[0]?.payload;
                return (
                  <div className="bg-[#0b0f17] border border-[#2b3752] rounded-xl p-2.5 shadow-xl text-xs">
                    <div className="font-bold text-gray-300 mb-1">Day {label} of 30</div>
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
                    {pt.commitmentsDeduction && (
                      <div className="text-rose-400 text-[11px] mt-0.5">
                        Commitment: -{formatINR(pt.commitmentsDeduction)}
                      </div>
                    )}
                  </div>
                );
              }}
            />

            {/* Vertical Marker for Active Day */}
            <ReferenceLine
              x={state.currentDay}
              stroke="#FFFFFF"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: `Day ${state.currentDay}`,
                position: 'top',
                fill: '#FFFFFF',
                fontSize: 10,
                fontWeight: 'bold',
              }}
            />

            {/* Actual Balance Area */}
            <Area
              type="monotone"
              dataKey="actualBalance"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fill="url(#actualGradient)"
              connectNulls={false}
            />

            {/* Projected Balance Line */}
            <Line
              type="monotone"
              dataKey="projectedBalance"
              stroke="#06B6D4"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 2.5, fill: '#06B6D4' }}
              connectNulls={true}
            />

            {/* Scheduled Commitments Dots */}
            <Line
              type="monotone"
              dataKey="commitmentsDeduction"
              stroke="#F43F5E"
              strokeWidth={0}
              dot={{ r: 3, fill: '#F43F5E' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

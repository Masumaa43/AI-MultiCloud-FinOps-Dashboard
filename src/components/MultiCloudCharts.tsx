import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  CloudProvider,
  MonthlySpendPoint,
  ServiceDistributionItem,
  ServiceCategory,
} from '../data/mockFinOpsData';

interface MultiCloudChartsProps {
  monthlyData: MonthlySpendPoint[];
  serviceData: ServiceDistributionItem[];
  selectedProvider: 'ALL' | CloudProvider;
  selectedServiceFilter: 'ALL' | ServiceCategory;
  onSelectServiceFilter: (service: 'ALL' | ServiceCategory) => void;
}

export const MultiCloudCharts: React.FC<MultiCloudChartsProps> = ({
  monthlyData,
  serviceData,
  selectedProvider,
  selectedServiceFilter,
  onSelectServiceFilter,
}) => {
  const [chartType, setChartType] = useState<'stacked' | 'area'>('stacked');

  const computedServiceItems = serviceData.map((item) => {
    const amount =
      selectedProvider === 'ALL'
        ? item.total
        : item[selectedProvider];
    return {
      ...item,
      activeAmount: amount,
    };
  });

  const totalServiceSpend = computedServiceItems.reduce(
    (sum, item) => sum + item.activeAmount,
    0
  );

  return (
    <section
      id="multi-cloud-charts"
      aria-label="Multi-Cloud Cost Analytics Charts"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      {/* Left 7 Cols: 6-Month Multi-Cloud Cost Breakdown (AWS vs GCP vs Azure) */}
      <div className="lg:col-span-7 bg-[#141417] border border-[#262522] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#F5F3EF] tracking-tight">
                Multi-Cloud Cost Breakdown (6-Month Trend)
              </h2>
              <p className="text-xs text-[#9E9A90] mt-1">
                AWS vs GCP vs Azure amortized monthly spend · May – Oct 2026
              </p>
            </div>

            {/* Interactive Chart Mode Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-[#0C0C0E] border border-[#262522] rounded-lg">
              <button
                type="button"
                onClick={() => setChartType('stacked')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  chartType === 'stacked'
                    ? 'bg-[#262522] text-[#F5F3EF]'
                    : 'text-[#9E9A90] hover:text-[#F5F3EF]'
                }`}
              >
                Stacked Bars
              </button>
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  chartType === 'area'
                    ? 'bg-[#262522] text-[#F5F3EF]'
                    : 'text-[#9E9A90] hover:text-[#F5F3EF]'
                }`}
              >
                Area Velocity
              </button>
            </div>
          </div>

          {/* Legend row — clean unboxed text with subtle color swatches */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#262522] text-xs text-[#D6D2C8] font-mono tabular-nums">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#E07A5F] inline-block" />
                <span>AWS (Oct: $24,120)</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#52B788] inline-block" />
                <span>GCP (Oct: $12,840)</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#7EA8BE] inline-block" />
                <span>Azure (Oct: $8,270)</span>
              </span>
            </div>
            <span className="text-[#9E9A90]">
              6-Mo Delta: <strong className="text-[#F5F3EF]">+$5,560 (+14.0%)</strong>
            </span>
          </div>
        </div>

        <div className="h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'stacked' ? (
              <BarChart
                data={monthlyData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#22211E"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#8A857B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#262522' }}
                />
                <YAxis
                  stroke="#8A857B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(229, 184, 105, 0.06)' }}
                  contentStyle={{
                    backgroundColor: '#0C0C0E',
                    borderColor: '#2E2C27',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#F5F3EF',
                  }}
                  formatter={(value: number, name: string) => [
                    `$${Number(value).toLocaleString()}`,
                    name,
                  ]}
                />
                {(selectedProvider === 'ALL' || selectedProvider === 'AWS') && (
                  <Bar
                    dataKey="AWS"
                    stackId="spend"
                    fill="#E07A5F"
                    radius={
                      selectedProvider === 'AWS' ? [4, 4, 0, 0] : [0, 0, 0, 0]
                    }
                  />
                )}
                {(selectedProvider === 'ALL' || selectedProvider === 'GCP') && (
                  <Bar
                    dataKey="GCP"
                    stackId="spend"
                    fill="#52B788"
                    radius={
                      selectedProvider === 'GCP' ? [4, 4, 0, 0] : [0, 0, 0, 0]
                    }
                  />
                )}
                {(selectedProvider === 'ALL' || selectedProvider === 'Azure') && (
                  <Bar
                    dataKey="Azure"
                    stackId="spend"
                    fill="#7EA8BE"
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            ) : (
              <AreaChart
                data={monthlyData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradAWS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E07A5F" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#E07A5F" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradGCP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52B788" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#52B788" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradAzure" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7EA8BE" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#7EA8BE" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#22211E"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#8A857B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#262522' }}
                />
                <YAxis
                  stroke="#8A857B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0C0C0E',
                    borderColor: '#2E2C27',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#F5F3EF',
                  }}
                  formatter={(value: number, name: string) => [
                    `$${Number(value).toLocaleString()}`,
                    name,
                  ]}
                />
                {(selectedProvider === 'ALL' || selectedProvider === 'AWS') && (
                  <Area
                    type="monotone"
                    dataKey="AWS"
                    stackId="1"
                    stroke="#E07A5F"
                    strokeWidth={2}
                    fill="url(#gradAWS)"
                  />
                )}
                {(selectedProvider === 'ALL' || selectedProvider === 'GCP') && (
                  <Area
                    type="monotone"
                    dataKey="GCP"
                    stackId="1"
                    stroke="#52B788"
                    strokeWidth={2}
                    fill="url(#gradGCP)"
                  />
                )}
                {(selectedProvider === 'ALL' || selectedProvider === 'Azure') && (
                  <Area
                    type="monotone"
                    dataKey="Azure"
                    stackId="1"
                    stroke="#7EA8BE"
                    strokeWidth={2}
                    fill="url(#gradAzure)"
                  />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right 5 Cols: Cost Distribution by Service (Compute, Storage, Database, Networking) */}
      <div className="lg:col-span-5 bg-[#141417] border border-[#262522] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#F5F3EF] tracking-tight">
                Cost Distribution by Service
              </h2>
              <p className="text-xs text-[#9E9A90] mt-1">
                {selectedProvider === 'ALL'
                  ? 'All Providers ($45,230/mo)'
                  : `${selectedProvider} Filtered Spend ($${totalServiceSpend.toLocaleString()}/mo)`}{' '}
                · Click a category to filter recommendations
              </p>
            </div>
            {selectedServiceFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => onSelectServiceFilter('ALL')}
                className="px-2.5 py-1 text-xs font-medium text-[#E5B869] hover:text-[#F0CA86] bg-[#1C1B18] border border-[#383327] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
              >
                Clear ({selectedServiceFilter})
              </button>
            )}
          </div>

          {/* Recharts Donut + Interactive Service Table */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-5 h-[190px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={computedServiceItems}
                    dataKey="activeAmount"
                    nameKey="service"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={3}
                    onClick={(entry) => {
                      const clickedService = entry.service as ServiceCategory;
                      onSelectServiceFilter(
                        selectedServiceFilter === clickedService
                          ? 'ALL'
                          : clickedService
                      );
                    }}
                  >
                    {computedServiceItems.map((entry) => (
                      <Cell
                        key={entry.service}
                        fill={entry.color}
                        stroke="#141417"
                        strokeWidth={2}
                        style={{
                          cursor: 'pointer',
                          opacity:
                            selectedServiceFilter === 'ALL' ||
                            selectedServiceFilter === entry.service
                              ? 1
                              : 0.35,
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0C0C0E',
                      borderColor: '#2E2C27',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: '#F5F3EF',
                    }}
                    formatter={(value: number, name: string) => [
                      `$${Number(value).toLocaleString()}/mo`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] text-[#9E9A90]">Total</span>
                <span className="text-sm font-semibold text-[#F5F3EF] font-mono tabular-nums">
                  ${(totalServiceSpend / 1000).toFixed(1)}k
                </span>
              </div>
            </div>

            <div className="sm:col-span-7 space-y-2">
              {computedServiceItems.map((item) => {
                const share =
                  totalServiceSpend > 0
                    ? ((item.activeAmount / totalServiceSpend) * 100).toFixed(1)
                    : '0.0';
                const isSelected = selectedServiceFilter === item.service;

                return (
                  <button
                    key={item.service}
                    type="button"
                    onClick={() =>
                      onSelectServiceFilter(
                        isSelected ? 'ALL' : item.service
                      )
                    }
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#22201B] border-[#E5B869]/60 text-[#F5F3EF]'
                        : 'bg-[#0C0C0E]/80 border-[#262522] hover:bg-[#1C1C20] text-[#D6D2C8]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs font-medium truncate">
                          {item.service}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#9E9A90] font-mono tabular-nums mt-0.5">
                        {share}% share · {item.momChange} MoM
                      </div>
                    </div>

                    <div className="text-right font-mono tabular-nums shrink-0">
                      <div className="text-xs font-semibold text-[#F5F3EF]">
                        ${item.activeAmount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-[#78746B]">/month</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Provider Split Footer */}
        <div className="mt-5 pt-4 border-t border-[#262522] flex items-center justify-between text-xs text-[#9E9A90] font-mono tabular-nums">
          <span>Compute + DB Ratio: 70.0%</span>
          <span aria-hidden="true">·</span>
          <span>Networking Egress Alert: +9.2% MoM</span>
        </div>
      </div>
    </section>
  );
};

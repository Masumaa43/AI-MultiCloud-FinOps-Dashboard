import React from 'react';
import { TeamBudgetAllocation } from '../data/mockFinOpsData';

interface TeamBudgetsSectionProps {
  teams: TeamBudgetAllocation[];
  selectedTeamFilter: string | null;
  onSelectTeamFilter: (team: string | null) => void;
}

export const TeamBudgetsSection: React.FC<TeamBudgetsSectionProps> = ({
  teams,
  selectedTeamFilter,
  onSelectTeamFilter,
}) => {
  return (
    <section
      aria-label="Engineering Team Budgets and Unit Economics"
      className="bg-[#141417] border border-[#262522] rounded-xl p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#F5F3EF] tracking-tight">
            Engineering Team Budgets & Unit Economics
          </h2>
          <p className="text-xs text-[#9E9A90] mt-1">
            Monthly budget burn rate vs. forecasted spend · Click a team to filter optimization opportunities
          </p>
        </div>

        {selectedTeamFilter && (
          <button
            type="button"
            onClick={() => onSelectTeamFilter(null)}
            className="px-3 py-1.5 text-xs font-medium text-[#E5B869] bg-[#221F18] border border-[#423926] rounded-lg hover:bg-[#2B271E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Filtered by: {selectedTeamFilter} (Clear)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((item) => {
          const utilization = Math.round(
            (item.currentSpend / item.monthlyBudget) * 100
          );
          const isOverBudget = item.currentSpend > item.monthlyBudget;
          const isSelected = selectedTeamFilter === item.team;

          return (
            <button
              key={item.team}
              type="button"
              onClick={() =>
                onSelectTeamFilter(isSelected ? null : item.team)
              }
              className={`text-left p-4 rounded-xl border transition-colors flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#22201B] border-[#E5B869]/70'
                  : 'bg-[#0C0C0E]/75 border-[#262522] hover:border-[#3A3832]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#9E9A90] font-mono tabular-nums">
                  <span>{item.primaryCloud}</span>
                  <span aria-hidden="true">·</span>
                  <span>Lead: {item.lead}</span>
                </div>

                <h3 className="text-sm font-semibold text-[#F5F3EF] mt-1.5">
                  {item.team}
                </h3>

                <div className="mt-3 flex items-baseline justify-between font-mono tabular-nums">
                  <span className="text-lg font-bold text-[#F5F3EF]">
                    ${item.currentSpend.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#9E9A90]">
                    / ${item.monthlyBudget.toLocaleString()} ({utilization}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[#1C1C20] rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${
                      isOverBudget ? 'bg-[#E07A5F]' : 'bg-[#52B788]'
                    }`}
                    style={{ width: `${Math.min(100, utilization)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#22211E] space-y-1 text-[11px] font-mono tabular-nums">
                <div className="flex items-center justify-between text-[#9E9A90]">
                  <span>{item.unitMetricLabel}</span>
                  <span className="text-[#E8E4DC]">{item.unitCostValue}</span>
                </div>
                <div className="flex items-center justify-between text-[#9E9A90]">
                  <span>Idle Savings Available</span>
                  <span className="text-[#52B788] font-semibold">
                    -${item.openSavings.toLocaleString()}/mo
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

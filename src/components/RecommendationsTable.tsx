import React from 'react';
import {
  Search,
  Check,
  Loader2,
  RotateCcw,
  SlidersHorizontal,
  Zap,
  Terminal,
} from 'lucide-react';
import {
  CloudProvider,
  OptimizationRecommendation,
  ServiceCategory,
} from '../data/mockFinOpsData';

interface RecommendationsTableProps {
  recommendations: OptimizationRecommendation[];
  selectedProvider: 'ALL' | CloudProvider;
  onSelectProvider: (provider: 'ALL' | CloudProvider) => void;
  selectedServiceFilter: 'ALL' | ServiceCategory;
  onSelectServiceFilter: (service: 'ALL' | ServiceCategory) => void;
  selectedTeamFilter?: string | null;
  onSelectTeamFilter?: (team: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: 'ALL' | 'Open' | 'Remediated';
  onStatusFilterChange: (status: 'ALL' | 'Open' | 'Remediated') => void;
  highlightedResourceId: string | null;
  onAutoRemediate: (id: string) => void;
  onAutoRemediateAll: () => void;
  onResetRemediations: () => void;
  onInspectResource?: (rec: OptimizationRecommendation) => void;
}

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
  recommendations,
  selectedProvider,
  onSelectProvider,
  selectedServiceFilter,
  onSelectServiceFilter,
  selectedTeamFilter,
  onSelectTeamFilter,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  highlightedResourceId,
  onAutoRemediate,
  onAutoRemediateAll,
  onResetRemediations,
  onInspectResource,
}) => {
  const filteredList = recommendations.filter((rec) => {
    const matchesProvider =
      selectedProvider === 'ALL' || rec.provider === selectedProvider;
    const matchesService =
      selectedServiceFilter === 'ALL' || rec.service === selectedServiceFilter;
    const matchesTeam =
      !selectedTeamFilter || rec.ownerTeam === selectedTeamFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Open' && rec.status !== 'Remediated') ||
      (statusFilter === 'Remediated' && rec.status === 'Remediated');
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      rec.resourceId.toLowerCase().includes(q) ||
      rec.resourceName.toLowerCase().includes(q) ||
      rec.wasteReason.toLowerCase().includes(q) ||
      rec.ownerTeam.toLowerCase().includes(q) ||
      rec.provider.toLowerCase().includes(q) ||
      rec.region.toLowerCase().includes(q);

    return (
      matchesProvider &&
      matchesService &&
      matchesTeam &&
      matchesStatus &&
      matchesQuery
    );
  });

  const openFilteredSavings = filteredList
    .filter((r) => r.status === 'Open')
    .reduce((sum, r) => sum + r.monthlySavings, 0);

  const hasRemediatedAny = recommendations.some(
    (r) => r.status === 'Remediated'
  );
  const openCount = recommendations.filter((r) => r.status === 'Open').length;

  return (
    <section
      id="optimization-recommendations"
      aria-label="Cost Optimization Recommendations Table"
      className="bg-[#141417] border border-[#262522] rounded-xl overflow-hidden"
    >
      {/* Top Toolbar */}
      <div className="p-6 border-b border-[#262522] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#F5F3EF] tracking-tight">
              Cost Optimization Recommendations
            </h2>
            <p className="text-xs text-[#9E9A90] mt-1">
              Idle & overprovisioned cloud resources · Click any Resource ID to inspect CLI runbook ·{' '}
              <span className="font-mono tabular-nums text-[#E5B869]">
                ${openFilteredSavings.toLocaleString()}/mo
              </span>{' '}
              open in current view
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {hasRemediatedAny && (
              <button
                type="button"
                onClick={onResetRemediations}
                className="px-3.5 py-2 text-xs font-medium text-[#D6D2C8] hover:text-[#F5F3EF] bg-[#1C1C20] hover:bg-[#262522] border border-[#32302B] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Demo State</span>
              </button>
            )}
            <button
              type="button"
              onClick={onAutoRemediateAll}
              disabled={openCount === 0}
              className="px-4 py-2 text-xs font-semibold text-[#0C0C0E] bg-[#E5B869] hover:bg-[#F0CA86] disabled:bg-[#1C1C20] disabled:text-[#6E6A61] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                {openCount > 0
                  ? `Auto-Remediate All Open (${openCount})`
                  : 'All Resources Remediated'}
              </span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Interactive Cloud Provider Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-[#0C0C0E] border border-[#262522] rounded-lg">
              {(['ALL', 'AWS', 'GCP', 'Azure'] as const).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => onSelectProvider(prov)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedProvider === prov
                      ? 'bg-[#262522] text-[#F5F3EF]'
                      : 'text-[#9E9A90] hover:text-[#F5F3EF]'
                  }`}
                >
                  {prov === 'ALL' ? 'All Clouds' : prov}
                </button>
              ))}
            </div>

            {/* Status Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-[#0C0C0E] border border-[#262522] rounded-lg">
              {(['ALL', 'Open', 'Remediated'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusFilterChange(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#262522] text-[#F5F3EF]'
                      : 'text-[#9E9A90] hover:text-[#F5F3EF]'
                  }`}
                >
                  {st === 'ALL' ? 'All Status' : st}
                </button>
              ))}
            </div>

            {selectedServiceFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => onSelectServiceFilter('ALL')}
                className="px-3 py-1.5 text-xs font-medium text-[#E5B869] bg-[#221F18] border border-[#423926] rounded-lg hover:bg-[#2B271E] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Service: {selectedServiceFilter} (Clear)</span>
              </button>
            )}

            {selectedTeamFilter && onSelectTeamFilter && (
              <button
                type="button"
                onClick={() => onSelectTeamFilter(null)}
                className="px-3 py-1.5 text-xs font-medium text-[#E5B869] bg-[#221F18] border border-[#423926] rounded-lg hover:bg-[#2B271E] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Team: {selectedTeamFilter} (Clear)</span>
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#78746B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by ID, team, region, or reason..."
              aria-label="Filter optimization recommendations"
              className="w-full bg-[#0C0C0E] border border-[#262522] focus:border-[#E5B869] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F5F3EF] placeholder:text-[#78746B] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#262522] bg-[#0C0C0E]/70 text-[11px] font-semibold text-[#9E9A90]">
              <th className="py-3.5 pl-6 pr-4 whitespace-nowrap">Resource ID</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Cloud Provider</th>
              <th className="py-3.5 px-4">Waste Reason & Telemetry</th>
              <th className="py-3.5 px-4 text-right whitespace-nowrap">
                Estimated Monthly Savings
              </th>
              <th className="py-3.5 pl-4 pr-6 text-right whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22211E] text-xs">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 px-6 text-center">
                  <p className="text-sm font-medium text-[#D6D2C8]">
                    No matching idle resource recommendations
                  </p>
                  <p className="text-xs text-[#78746B] mt-1">
                    Adjust your provider, service, team, or status filters to inspect other cloud resources.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProvider('ALL');
                      onSelectServiceFilter('ALL');
                      if (onSelectTeamFilter) onSelectTeamFilter(null);
                      onStatusFilterChange('ALL');
                      onSearchChange('');
                    }}
                    className="mt-4 px-4 py-2 text-xs font-medium text-[#F5F3EF] bg-[#262522] hover:bg-[#32302B] rounded-lg transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredList.map((rec) => {
                const isHighlighted = highlightedResourceId === rec.resourceId;
                const isRemediated = rec.status === 'Remediated';
                const isRemediating = rec.status === 'Remediating';

                return (
                  <tr
                    key={rec.id}
                    className={`transition-colors ${
                      isHighlighted
                        ? 'bg-[#E5B869]/12'
                        : isRemediated
                        ? 'bg-[#0C0C0E]/40 text-[#6E6A61]'
                        : 'hover:bg-[#1A1A1E]'
                    }`}
                  >
                    {/* Column 1: Resource ID */}
                    <td className="py-4 pl-6 pr-4 align-top whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onInspectResource && onInspectResource(rec)}
                        className="text-left group cursor-pointer"
                      >
                        <div className="font-mono tabular-nums font-medium text-[#F5F3EF] group-hover:text-[#E5B869] underline decoration-[#3A3832] group-hover:decoration-[#E5B869] underline-offset-2 transition-colors">
                          {rec.resourceId}
                        </div>
                        <div className="text-[11px] text-[#9E9A90] mt-0.5 font-mono">
                          {rec.resourceName} · {rec.ownerTeam}
                        </div>
                      </button>
                    </td>

                    {/* Column 2: Cloud Provider (Clean unboxed text with separators, Zero-Pill compliance) */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="font-medium text-[#E8E4DC]">
                        {rec.provider}
                      </div>
                      <div className="text-[11px] text-[#9E9A90] font-mono tabular-nums mt-0.5">
                        {rec.region} · {rec.service}
                      </div>
                    </td>

                    {/* Column 3: Waste Reason */}
                    <td className="py-4 px-4 align-top max-w-md">
                      <div
                        className={`font-medium ${
                          isRemediated ? 'line-through text-[#6E6A61]' : 'text-[#E8E4DC]'
                        }`}
                      >
                        {rec.wasteReason}
                      </div>
                      <div className="text-[11px] text-[#9E9A90] mt-0.5">
                        {rec.telemetryDetail} ·{' '}
                        <span className="text-[#D6D2C8]">
                          Plan: {rec.remediationAction}
                        </span>
                      </div>
                    </td>

                    {/* Column 4: Estimated Monthly Savings */}
                    <td className="py-4 px-4 align-top text-right whitespace-nowrap font-mono tabular-nums">
                      <div
                        className={`text-sm font-semibold ${
                          isRemediated ? 'text-[#6E6A61]' : 'text-[#52B788]'
                        }`}
                      >
                        ${rec.monthlySavings.toLocaleString()}/mo
                      </div>
                      <div className="text-[11px] text-[#9E9A90] mt-0.5">
                        ${(rec.monthlySavings * 12).toLocaleString()}/yr · {rec.confidence} conf.
                      </div>
                    </td>

                    {/* Column 5: Auto-Remediate & CLI Inspect Buttons */}
                    <td className="py-4 pl-4 pr-6 align-top text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        {onInspectResource && (
                          <button
                            type="button"
                            onClick={() => onInspectResource(rec)}
                            title="Inspect CLI Runbook & Telemetry"
                            className="px-2.5 py-2 text-xs font-medium text-[#D6D2C8] hover:text-[#F5F3EF] bg-[#1C1C20] hover:bg-[#262522] border border-[#32302B] rounded-lg transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Terminal className="w-3.5 h-3.5 text-[#E5B869]" />
                            <span>CLI</span>
                          </button>
                        )}

                        {isRemediated ? (
                          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52B788] font-mono tabular-nums py-1.5 px-2.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>Remediated · {rec.remediatedAt}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={isRemediating}
                            onClick={() => onAutoRemediate(rec.id)}
                            className="px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E5B869]/40 bg-[#E5B869]/10 hover:bg-[#E5B869] hover:text-[#0C0C0E] text-[#E5B869] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                          >
                            {isRemediating ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Applying API...</span>
                              </>
                            ) : (
                              <span>Auto-Remediate</span>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

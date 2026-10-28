import React from 'react';
import { ShieldCheck, AlertTriangle, Check } from 'lucide-react';
import {
  CloudAnomaly,
  TagGovernanceRule,
  CloudProvider,
} from '../data/mockFinOpsData';

interface GovernanceAndAnomaliesSectionProps {
  anomalies: CloudAnomaly[];
  tagRules: TagGovernanceRule[];
  selectedProvider: 'ALL' | CloudProvider;
  tagPolicyEnforced: boolean;
  onToggleTagPolicy: () => void;
  onResolveAnomaly: (id: string) => void;
}

export const GovernanceAndAnomaliesSection: React.FC<
  GovernanceAndAnomaliesSectionProps
> = ({
  anomalies,
  tagRules,
  selectedProvider,
  tagPolicyEnforced,
  onToggleTagPolicy,
  onResolveAnomaly,
}) => {
  const visibleAnomalies = anomalies.filter(
    (a) => selectedProvider === 'ALL' || a.provider === selectedProvider
  );

  return (
    <section
      id="governance-and-anomalies"
      aria-label="Cloud Anomalies and Tag Compliance Governance"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      {/* Active Cloud Anomalies Panel (7 cols) */}
      <div
        id="cloud-anomalies-panel"
        className="lg:col-span-7 bg-[#141417] border border-[#262522] rounded-xl p-6 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#F5F3EF] tracking-tight">
                Real-Time Spend Anomaly Detection
              </h2>
              <p className="text-xs text-[#9E9A90] mt-1">
                Cost spikes exceeding 3-sigma 30-day rolling baseline across accounts
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-[#E07A5F]">
              {anomalies.filter((a) => a.status === 'Active').length} Active ·{' '}
              ${anomalies
                .filter((a) => a.status === 'Active')
                .reduce((acc, a) => acc + a.costImpact, 0)
                .toLocaleString()}{' '}
              impact
            </span>
          </div>

          <div className="divide-y divide-[#22211E]">
            {visibleAnomalies.map((anom) => {
              const isResolved = anom.status === 'Resolved';
              return (
                <div
                  key={anom.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#9E9A90] font-mono tabular-nums">
                      <AlertTriangle
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isResolved ? 'text-[#6E6A61]' : 'text-[#E07A5F]'
                        }`}
                      />
                      <span>{anom.provider}</span>
                      <span aria-hidden="true">·</span>
                      <span>{anom.region}</span>
                      <span aria-hidden="true">·</span>
                      <span>{anom.service}</span>
                      <span aria-hidden="true">·</span>
                      <span>{anom.detectedAt}</span>
                    </div>
                    <h3
                      className={`text-sm font-medium mt-1 ${
                        isResolved
                          ? 'line-through text-[#6E6A61]'
                          : 'text-[#F5F3EF]'
                      }`}
                    >
                      {anom.title}
                    </h3>
                    <p className="text-xs text-[#9E9A90] mt-0.5">
                      {anom.rootCause}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-right font-mono tabular-nums">
                      <div
                        className={`text-sm font-semibold ${
                          isResolved ? 'text-[#6E6A61]' : 'text-[#E07A5F]'
                        }`}
                      >
                        +${anom.costImpact.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-[#78746B]">
                        ${anom.baselineSpend}/d → ${anom.spikeSpend}/d
                      </div>
                    </div>

                    {isResolved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-[#52B788]">
                        <Check className="w-3.5 h-3.5" />
                        <span>Mitigated</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onResolveAnomaly(anom.id)}
                        className="px-3 py-1.5 text-xs font-medium text-[#E8E4DC] hover:text-[#F5F3EF] bg-[#1C1C20] hover:bg-[#262522] border border-[#32302B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Acknowledge & Suppress
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tag Compliance Governance Panel (5 cols) */}
      <div
        id="tag-governance-panel"
        className="lg:col-span-5 bg-[#141417] border border-[#262522] rounded-xl p-6 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#F5F3EF] tracking-tight">
                Tag Compliance Governance
              </h2>
              <p className="text-xs text-[#9E9A90] mt-1">
                Required FinOps cost allocation keys across 1,380 resources
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleTagPolicy}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                tagPolicyEnforced
                  ? 'bg-[#52B788]/15 border-[#52B788]/40 text-[#74C69D]'
                  : 'bg-[#1C1C20] hover:bg-[#262522] border-[#32302B] text-[#E8E4DC]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {tagPolicyEnforced
                  ? 'SCP Guardrail Active (91%)'
                  : 'Simulate Auto-Tag SCP'}
              </span>
            </button>
          </div>

          <div className="space-y-4">
            {tagRules.map((rule) => {
              const rate = tagPolicyEnforced
                ? Math.min(98.5, Number((rule.complianceRate + 9.0).toFixed(1)))
                : rule.complianceRate;
              const untaggedSpend = tagPolicyEnforced
                ? Math.round(rule.untaggedMonthlySpend * 0.32)
                : rule.untaggedMonthlySpend;

              return (
                <div key={rule.tagKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-mono text-[#E8E4DC]">
                      tag:{rule.tagKey}{' '}
                      <span className="text-[#78746B] font-sans">
                        · Gap: {rule.primaryOffenderTeam}
                      </span>
                    </div>
                    <div className="font-mono tabular-nums text-[#D6D2C8]">
                      {rate}% ·{' '}
                      <span className="text-[#9E9A90]">
                        ${untaggedSpend.toLocaleString()} untagged
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[#0C0C0E] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        rate >= 88
                          ? 'bg-[#52B788]'
                          : rate >= 78
                          ? 'bg-[#E5B869]'
                          : 'bg-[#E07A5F]'
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#262522] flex items-center justify-between text-xs text-[#9E9A90] font-mono tabular-nums">
          <span>Tracked Resources: 1,380</span>
          <span aria-hidden="true">·</span>
          <span>
            Unallocated Spend:{' '}
            {tagPolicyEnforced ? '$2,980/mo' : '$9,420/mo'}
          </span>
        </div>
      </div>
    </section>
  );
};

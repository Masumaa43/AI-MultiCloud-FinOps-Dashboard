import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Zap } from 'lucide-react';
import { OptimizationRecommendation } from '../data/mockFinOpsData';

interface ResourceInspectorDrawerProps {
  resource: OptimizationRecommendation | null;
  onClose: () => void;
  onAutoRemediate: (id: string) => void;
}

export const ResourceInspectorDrawer: React.FC<
  ResourceInspectorDrawerProps
> = ({ resource, onClose, onAutoRemediate }) => {
  const [copied, setCopied] = useState(false);

  if (!resource) return null;

  const afterMonthlyCost = Math.max(
    0,
    resource.currentMonthlyCost - resource.monthlySavings
  );
  const savingsPct = Math.round(
    (resource.monthlySavings / resource.currentMonthlyCost) * 100
  );

  const handleCopyCli = () => {
    navigator.clipboard.writeText(resource.cliSnippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Resource Remediation Inspector for ${resource.resourceId}`}
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#141417] border-l border-[#262522] h-full p-6 flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#262522]">
            <div>
              <div className="text-xs text-[#9E9A90] font-mono tabular-nums">
                {resource.provider} · {resource.region} · {resource.service} · Owner: {resource.ownerTeam}
              </div>
              <h2 className="text-lg font-bold text-[#F5F3EF] font-mono mt-1">
                {resource.resourceId}
              </h2>
              <p className="text-xs text-[#9E9A90] font-mono">
                {resource.resourceName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close inspector"
              className="p-2 rounded-lg text-[#9E9A90] hover:text-[#F5F3EF] hover:bg-[#1C1C20] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Before / After Financial Impact */}
          <div className="grid grid-cols-3 gap-3 bg-[#0C0C0E] border border-[#262522] rounded-xl p-4 font-mono tabular-nums">
            <div>
              <div className="text-[11px] text-[#9E9A90]">Current Spend</div>
              <div className="text-base font-semibold text-[#F5F3EF] mt-1">
                ${resource.currentMonthlyCost.toLocaleString()}/mo
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#9E9A90]">Post-Remediation</div>
              <div className="text-base font-semibold text-[#E5B869] mt-1">
                ${afterMonthlyCost.toLocaleString()}/mo
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#9E9A90]">Net Savings ({savingsPct}%)</div>
              <div className="text-base font-semibold text-[#52B788] mt-1">
                -${resource.monthlySavings.toLocaleString()}/mo
              </div>
            </div>
          </div>

          {/* Telemetry & Root Cause */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#D6D2C8]">
              14-Day Utilization Telemetry & Waste Analysis
            </h3>
            <div className="p-4 rounded-xl bg-[#0C0C0E] border border-[#262522] space-y-2 text-xs">
              <div className="text-[#F5F3EF] font-medium">
                {resource.wasteReason}
              </div>
              <div className="text-[#9E9A90]">{resource.telemetryDetail}</div>
              <div className="pt-2 border-t border-[#22211E] text-[#E5B869]">
                Recommended Action: {resource.remediationAction}
              </div>
            </div>
          </div>

          {/* CLI / Automation Runbook Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#D6D2C8] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#E5B869]" />
                <span>Automated CLI / Runbook Command</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCli}
                className="px-2.5 py-1 text-xs font-mono text-[#D6D2C8] hover:text-[#F5F3EF] bg-[#1C1C20] border border-[#32302B] rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#52B788]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy CLI</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#0C0C0E] border border-[#262522] text-xs font-mono text-[#E8E4DC] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {resource.cliSnippet}
            </pre>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t border-[#262522] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium text-[#D6D2C8] hover:text-[#F5F3EF] bg-[#1C1C20] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>

          {resource.status === 'Remediated' ? (
            <div className="text-xs font-mono text-[#52B788] flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Remediated at {resource.remediatedAt}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onAutoRemediate(resource.id);
                onClose();
              }}
              className="px-5 py-2.5 text-xs font-semibold text-[#0C0C0E] bg-[#E5B869] hover:bg-[#F0CA86] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                Execute Auto-Remediation (-${resource.monthlySavings.toLocaleString()}/mo)
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

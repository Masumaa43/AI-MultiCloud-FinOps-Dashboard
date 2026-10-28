import React, { useState } from 'react';
import {
  Download,
  PanelRightClose,
  PanelRightOpen,
  ChevronRight,
} from 'lucide-react';
import {
  CloudProvider,
  ServiceCategory,
  WorkspaceTab,
  SIX_MONTH_SPEND_DATA,
  SERVICE_COST_DISTRIBUTION,
  INITIAL_RECOMMENDATIONS,
  INITIAL_ANOMALIES,
  TAG_GOVERNANCE_RULES,
  TEAM_BUDGET_ALLOCATIONS,
  OptimizationRecommendation,
  CloudAnomaly,
} from './data/mockFinOpsData';
import { MultiCloudCharts } from './components/MultiCloudCharts';
import { RecommendationsTable } from './components/RecommendationsTable';
import { FinOpsCopilotSidebar } from './components/FinOpsCopilotSidebar';
import { GovernanceAndAnomaliesSection } from './components/GovernanceAndAnomaliesSection';
import { TeamBudgetsSection } from './components/TeamBudgetsSection';
import { ResourceInspectorDrawer } from './components/ResourceInspectorDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | WorkspaceTab>('all');
  const [recommendations, setRecommendations] = useState<
    OptimizationRecommendation[]
  >(INITIAL_RECOMMENDATIONS);
  const [anomalies, setAnomalies] = useState<CloudAnomaly[]>(INITIAL_ANOMALIES);
  const [selectedProvider, setSelectedProvider] = useState<
    'ALL' | CloudProvider
  >('ALL');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<
    'ALL' | ServiceCategory
  >('ALL');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'Open' | 'Remediated'
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedResourceId, setHighlightedResourceId] = useState<
    string | null
  >(null);
  const [inspectedResource, setInspectedResource] =
    useState<OptimizationRecommendation | null>(null);
  const [tagPolicyEnforced, setTagPolicyEnforced] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Executive Summary Calculations
  const baseTotalMultiCloudSpend = 45230;
  const openRecommendations = recommendations.filter(
    (r) => r.status !== 'Remediated'
  );
  const remediatedRecommendations = recommendations.filter(
    (r) => r.status === 'Remediated'
  );

  const remainingMonthlySavings = openRecommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  const realizedMonthlySavings = remediatedRecommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );

  const activeAnomaliesCount = anomalies.filter(
    (a) => a.status === 'Active'
  ).length;
  const tagComplianceRate = tagPolicyEnforced ? 91 : 82;

  const showNotification = (msg: string) => {
    setToastBanner(msg);
    window.setTimeout(() => {
      setToastBanner((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Auto-Remediate single recommendation
  const handleAutoRemediate = (id: string) => {
    const target = recommendations.find((r) => r.id === id);
    if (!target || target.status !== 'Open') return;

    setRecommendations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Remediating' } : item
      )
    );

    window.setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(
        now.getUTCMinutes()
      ).padStart(2, '0')} UTC`;

      setRecommendations((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'Remediated', remediatedAt: timeStr }
            : item
        )
      );
      showNotification(
        `Remediated ${target.resourceId} (${target.provider}) · Saved $${target.monthlySavings.toLocaleString()}/mo`
      );
    }, 450);
  };

  // Auto-Remediate all open recommendations
  const handleAutoRemediateAll = () => {
    const openItems = recommendations.filter((r) => r.status === 'Open');
    if (openItems.length === 0) return;

    setRecommendations((prev) =>
      prev.map((item) =>
        item.status === 'Open' ? { ...item, status: 'Remediating' } : item
      )
    );

    window.setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(
        now.getUTCMinutes()
      ).padStart(2, '0')} UTC`;

      setRecommendations((prev) =>
        prev.map((item) =>
          item.status === 'Remediating'
            ? { ...item, status: 'Remediated', remediatedAt: timeStr }
            : item
        )
      );
      const totalBatchSaved = openItems.reduce(
        (acc, r) => acc + r.monthlySavings,
        0
      );
      showNotification(
        `Batch remediation completed across ${openItems.length} resources · $${totalBatchSaved.toLocaleString()}/mo saved`
      );
    }, 550);
  };

  const handleResetRemediations = () => {
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setAnomalies(INITIAL_ANOMALIES);
    setTagPolicyEnforced(false);
    setSelectedProvider('ALL');
    setSelectedServiceFilter('ALL');
    setSelectedTeamFilter(null);
    showNotification('Restored initial October multi-cloud telemetry dataset');
  };

  const handleResolveAnomaly = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a))
    );
    showNotification('Spend anomaly acknowledged and mitigation runbook logged');
  };

  const handleHighlightResource = (resourceId: string) => {
    setHighlightedResourceId(resourceId);
    setSelectedProvider('ALL');
    setSelectedServiceFilter('ALL');
    setSelectedTeamFilter(null);
    setStatusFilter('ALL');
    if (activeTab !== 'all' && activeTab !== 'optimization') {
      setActiveTab('optimization');
    }
    window.setTimeout(() => {
      const el = document.getElementById('optimization-recommendations');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    window.setTimeout(() => {
      setHighlightedResourceId((curr) =>
        curr === resourceId ? null : curr
      );
    }, 3000);
  };

  const handleExportCsv = () => {
    const headers = [
      'Resource ID',
      'Resource Name',
      'Owner Team',
      'Cloud Provider',
      'Region',
      'Service',
      'Waste Reason',
      'Estimated Monthly Savings USD',
      'Status',
    ];
    const rows = recommendations.map((r) => [
      r.resourceId,
      r.resourceName,
      r.ownerTeam,
      r.provider,
      r.region,
      r.service,
      `"${r.wasteReason.replace(/"/g, '""')}"`,
      r.monthlySavings,
      r.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'strata-finops-recommendations-oct2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported FinOps Optimization Report (CSV)');
  };

  const navItems: { id: 'all' | WorkspaceTab; label: string }[] = [
    { id: 'all', label: 'Unified View' },
    { id: 'analytics', label: 'Cost & Budgets' },
    { id: 'optimization', label: 'Optimization' },
    { id: 'governance', label: 'Governance' },
  ];

  const activeTabLabel =
    navItems.find((n) => n.id === activeTab)?.label ?? 'Unified View';

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-[#F5F3EF] flex flex-col lg:flex-row">
      {/* Vertically Framed Navigation Rail */}
      <header className="sticky top-0 z-30 bg-[#101013]/95 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-[#262522] px-5 py-4 lg:py-6 lg:w-60 lg:h-screen shrink-0 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-6">
        <div className="flex items-center lg:flex-col lg:items-start gap-6 lg:gap-8 w-full">
          {/* Zone 1: Brand Wordmark */}
          <div className="lg:w-full lg:pb-5 lg:border-b lg:border-[#262522]">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="text-lg font-bold tracking-tight text-[#F5F3EF] font-display whitespace-nowrap shrink-0 cursor-pointer block"
            >
              StrataFinOps
            </button>
            <p className="hidden lg:block text-[11px] text-[#9E9A90] font-mono mt-1">
              Multi-Cloud FinOps Suite
            </p>
          </div>

          {/* Zone 2: Vertical Navigation Links */}
          <nav
            aria-label="Primary Workspace Navigation"
            className="hidden md:flex lg:flex-col items-center lg:items-stretch gap-2 lg:w-full text-sm font-medium"
          >
            {navItems.map((item) => {
              const isCurrent = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`text-left px-3.5 py-2.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-[#22201B] text-[#E5B869] border border-[#E5B869]/40 font-semibold'
                      : 'text-[#9E9A90] hover:text-[#F5F3EF] hover:bg-[#18181C] border border-transparent'
                  }`}
                >
                  <span>{item.label}</span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] hidden lg:inline-block" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Zone 3: Primary Action & Monthly Cycle Summary at Bottom of Vertical Rail */}
        <div className="flex lg:flex-col items-center lg:items-stretch gap-3 shrink-0 lg:w-full lg:pt-5 lg:border-t lg:border-[#262522]">
          <div className="hidden lg:block px-3 py-2.5 rounded-lg bg-[#0C0C0E] border border-[#262522] text-[11px] font-mono tabular-nums text-[#9E9A90] space-y-1">
            <div className="flex items-center justify-between">
              <span>Oct Spend</span>
              <span className="text-[#F5F3EF] font-semibold">
                ${baseTotalMultiCloudSpend.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Open Savings</span>
              <span className="text-[#52B788] font-semibold">
                ${remainingMonthlySavings.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="w-full px-4 py-2.5 text-xs font-semibold text-[#0C0C0E] bg-[#E5B869] hover:bg-[#F0CA86] rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export FinOps CSV</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Viewport */}
      <main className="flex-1 min-w-0 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {toastBanner && (
          <div
            role="status"
            className="mb-5 px-4 py-2.5 rounded-lg bg-[#141417] border border-[#E5B869]/40 text-xs text-[#E5B869] font-mono tabular-nums flex items-center justify-between gap-4"
          >
            <span>{toastBanner}</span>
            <button
              type="button"
              onClick={() => setToastBanner(null)}
              className="text-[#9E9A90] hover:text-[#F5F3EF] text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col xl:flex-row items-start gap-6">
          {/* Left Primary Dashboard Column */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            {/* Contextual Breadcrumb & Workspace Mode Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#262522]">
              <div>
                {/* Contextual Breadcrumb Trail */}
                <div className="flex items-center gap-1.5 text-xs text-[#9E9A90] font-mono tabular-nums">
                  <span>Production Org</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#6E6A61]" />
                  <span>Oct 2026 Cycle</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#6E6A61]" />
                  <span className="text-[#E5B869]">{activeTabLabel}</span>
                  {selectedProvider !== 'ALL' && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-[#6E6A61]" />
                      <span className="text-[#F5F3EF]">{selectedProvider}</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#F5F3EF] mt-1">
                  Multi-Cloud FinOps & Cost Optimization
                </h1>
              </div>

              {/* Global Cloud Provider Filter + Copilot Drawer Toggle */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Mobile/Tablet View Switcher */}
                <div className="flex md:hidden items-center gap-1 p-1 bg-[#141417] border border-[#262522] rounded-lg">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeTab === item.id
                          ? 'bg-[#262522] text-[#E5B869]'
                          : 'text-[#9E9A90]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Global Cloud Provider Filter */}
                <div className="flex items-center gap-1 p-1 bg-[#141417] border border-[#262522] rounded-lg">
                  {(['ALL', 'AWS', 'GCP', 'Azure'] as const).map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => setSelectedProvider(provider)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedProvider === provider
                          ? 'bg-[#E5B869] text-[#0C0C0E] font-semibold'
                          : 'text-[#9E9A90] hover:text-[#F5F3EF]'
                      }`}
                    >
                      {provider === 'ALL' ? 'All Providers' : provider}
                    </button>
                  ))}
                </div>

                {/* Copilot Sidebar Dock Toggle */}
                <button
                  type="button"
                  onClick={() => setCopilotOpen((prev) => !prev)}
                  className="px-3 py-2 text-xs font-medium text-[#D6D2C8] hover:text-[#F5F3EF] bg-[#141417] hover:bg-[#1C1C20] border border-[#262522] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copilotOpen ? (
                    <>
                      <PanelRightClose className="w-3.5 h-3.5 text-[#E5B869]" />
                      <span>Hide Copilot</span>
                    </>
                  ) : (
                    <>
                      <PanelRightOpen className="w-3.5 h-3.5 text-[#E5B869]" />
                      <span>Open Copilot</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 1. Interactive Executive Summary Cards (Always visible as top anchor, clicking navigates to focused section) */}
            <section
              aria-label="Executive Summary Cards"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* Card 1: Total Multi-Cloud Spend ($45,230) */}
              <div
                onClick={() => setActiveTab('analytics')}
                className="bg-[#141417] hover:bg-[#18181C] border border-[#262522] rounded-xl p-5 flex flex-col justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#9E9A90]">
                    <span>Total Multi-Cloud Spend</span>
                    <span className="font-mono text-[11px] text-[#78746B]">
                      Analytics →
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#F5F3EF] font-mono tabular-nums mt-2">
                    ${baseTotalMultiCloudSpend.toLocaleString()}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#22211E] text-xs text-[#9E9A90] font-mono tabular-nums">
                  {realizedMonthlySavings > 0 ? (
                    <span className="text-[#52B788]">
                      Net Run-Rate: $
                      {(
                        baseTotalMultiCloudSpend - realizedMonthlySavings
                      ).toLocaleString()}
                      /mo
                    </span>
                  ) : (
                    <span>AWS $24.1k · GCP $12.8k · Azure $8.3k</span>
                  )}
                </div>
              </div>

              {/* Card 2: Potential Monthly Savings ($8,450) */}
              <div
                onClick={() => setActiveTab('optimization')}
                className="bg-[#141417] hover:bg-[#18181C] border border-[#262522] rounded-xl p-5 flex flex-col justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#9E9A90]">
                    <span>Potential Monthly Savings</span>
                    <span className="font-mono text-[11px] text-[#78746B]">
                      Remediate →
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#52B788] font-mono tabular-nums mt-2">
                    ${remainingMonthlySavings.toLocaleString()}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#22211E] text-xs text-[#9E9A90] font-mono tabular-nums flex items-center justify-between">
                  <span>
                    {realizedMonthlySavings > 0
                      ? `Realized: $${realizedMonthlySavings.toLocaleString()}/mo`
                      : '18.7% of monthly spend'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{openRecommendations.length} Open</span>
                </div>
              </div>

              {/* Card 3: Tag Compliance Rate (82%) */}
              <div
                onClick={() => setActiveTab('governance')}
                className="bg-[#141417] hover:bg-[#18181C] border border-[#262522] rounded-xl p-5 flex flex-col justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#9E9A90]">
                    <span>Tag Compliance Rate</span>
                    <span className="font-mono text-[11px] text-[#78746B]">
                      Policies →
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#E5B869] font-mono tabular-nums mt-2">
                    {tagComplianceRate}%
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#22211E] text-xs text-[#9E9A90] font-mono tabular-nums flex items-center justify-between">
                  <span>1,380 Resources</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#E5B869]">Target: 95%</span>
                </div>
              </div>

              {/* Card 4: Active Cloud Anomalies (3) */}
              <div
                onClick={() => setActiveTab('governance')}
                className="bg-[#141417] hover:bg-[#18181C] border border-[#262522] rounded-xl p-5 flex flex-col justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#9E9A90]">
                    <span>Active Cloud Anomalies</span>
                    <span className="font-mono text-[11px] text-[#78746B]">
                      Incidents →
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#E07A5F] font-mono tabular-nums mt-2">
                    {activeAnomaliesCount}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#22211E] text-xs text-[#9E9A90] font-mono tabular-nums flex items-center justify-between">
                  <span>+$2,680 Weekly Spike</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#E07A5F]">Inspect</span>
                </div>
              </div>
            </section>

            {/* 2. Interactive Recharts Section + Team Budgets (Visible in 'all' or 'analytics') */}
            {(activeTab === 'all' || activeTab === 'analytics') && (
              <>
                <MultiCloudCharts
                  monthlyData={SIX_MONTH_SPEND_DATA}
                  serviceData={SERVICE_COST_DISTRIBUTION}
                  selectedProvider={selectedProvider}
                  selectedServiceFilter={selectedServiceFilter}
                  onSelectServiceFilter={setSelectedServiceFilter}
                />

                <TeamBudgetsSection
                  teams={TEAM_BUDGET_ALLOCATIONS}
                  selectedTeamFilter={selectedTeamFilter}
                  onSelectTeamFilter={(team) => {
                    setSelectedTeamFilter(team);
                    if (team && activeTab === 'analytics') {
                      setActiveTab('all');
                    }
                  }}
                />
              </>
            )}

            {/* 3. Cost Optimization Recommendations Table (Visible in 'all' or 'optimization') */}
            {(activeTab === 'all' || activeTab === 'optimization') && (
              <RecommendationsTable
                recommendations={recommendations}
                selectedProvider={selectedProvider}
                onSelectProvider={setSelectedProvider}
                selectedServiceFilter={selectedServiceFilter}
                onSelectServiceFilter={setSelectedServiceFilter}
                selectedTeamFilter={selectedTeamFilter}
                onSelectTeamFilter={setSelectedTeamFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                highlightedResourceId={highlightedResourceId}
                onAutoRemediate={handleAutoRemediate}
                onAutoRemediateAll={handleAutoRemediateAll}
                onResetRemediations={handleResetRemediations}
                onInspectResource={setInspectedResource}
              />
            )}

            {/* 4. Real-Time Cloud Anomalies & Tag Compliance Governance (Visible in 'all' or 'governance') */}
            {(activeTab === 'all' || activeTab === 'governance') && (
              <GovernanceAndAnomaliesSection
                anomalies={anomalies}
                tagRules={TAG_GOVERNANCE_RULES}
                selectedProvider={selectedProvider}
                tagPolicyEnforced={tagPolicyEnforced}
                onToggleTagPolicy={() => {
                  setTagPolicyEnforced((prev) => !prev);
                  showNotification(
                    !tagPolicyEnforced
                      ? 'Simulated AWS SCP & GCP Organization Tag Enforcement (Compliance: 82% → 91%)'
                      : 'Reverted Tag Governance Simulation to baseline (82%)'
                  );
                }}
                onResolveAnomaly={handleResolveAnomaly}
              />
            )}
          </div>

          {/* 5. Right Sidebar: AI FinOps Copilot (Dockable) */}
          {copilotOpen && (
            <FinOpsCopilotSidebar
              totalSpend={baseTotalMultiCloudSpend}
              remainingSavings={remainingMonthlySavings}
              remediatedSavings={realizedMonthlySavings}
              openRecsCount={openRecommendations.length}
              activeAnomaliesCount={activeAnomaliesCount}
              tagCompliance={tagComplianceRate}
              onHighlightResource={handleHighlightResource}
            />
          )}
        </div>
      </main>

      {/* Slide-Over Resource Remediation & CLI Inspector Drawer */}
      <ResourceInspectorDrawer
        resource={inspectedResource}
        onClose={() => setInspectedResource(null)}
        onAutoRemediate={handleAutoRemediate}
      />
    </div>
  );
}

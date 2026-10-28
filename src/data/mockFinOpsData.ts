export type CloudProvider = 'AWS' | 'GCP' | 'Azure';
export type ServiceCategory = 'Compute' | 'Storage' | 'Database' | 'Networking';
export type WorkspaceTab = 'overview' | 'analytics' | 'optimization' | 'governance';

export interface MonthlySpendPoint {
  month: string;
  AWS: number;
  GCP: number;
  Azure: number;
  total: number;
  budget: number;
}

export interface ServiceDistributionItem {
  service: ServiceCategory;
  total: number;
  AWS: number;
  GCP: number;
  Azure: number;
  percentage: number;
  momChange: string;
  color: string;
}

export interface OptimizationRecommendation {
  id: string;
  resourceId: string;
  resourceName: string;
  provider: CloudProvider;
  region: string;
  service: ServiceCategory;
  ownerTeam: string;
  wasteReason: string;
  telemetryDetail: string;
  remediationAction: string;
  cliSnippet: string;
  monthlySavings: number;
  currentMonthlyCost: number;
  confidence: 'High' | 'Medium';
  status: 'Open' | 'Remediating' | 'Remediated';
  remediatedAt?: string;
}

export interface CloudAnomaly {
  id: string;
  title: string;
  provider: CloudProvider;
  region: string;
  service: ServiceCategory;
  detectedAt: string;
  costImpact: number;
  baselineSpend: number;
  spikeSpend: number;
  rootCause: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
}

export interface TagGovernanceRule {
  tagKey: string;
  compliantResources: number;
  totalResources: number;
  complianceRate: number;
  untaggedMonthlySpend: number;
  primaryOffenderTeam: string;
}

export interface TeamBudgetAllocation {
  team: string;
  lead: string;
  monthlyBudget: number;
  currentSpend: number;
  forecastSpend: number;
  primaryCloud: CloudProvider;
  openSavings: number;
  unitMetricLabel: string;
  unitCostValue: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  metricsReferenced?: string[];
}

export const SIX_MONTH_SPEND_DATA: MonthlySpendPoint[] = [
  {
    month: 'May',
    AWS: 21400,
    GCP: 10850,
    Azure: 7420,
    total: 39670,
    budget: 41000,
  },
  {
    month: 'Jun',
    AWS: 22150,
    GCP: 11200,
    Azure: 7680,
    total: 41030,
    budget: 41500,
  },
  {
    month: 'Jul',
    AWS: 21890,
    GCP: 11640,
    Azure: 7910,
    total: 41440,
    budget: 42000,
  },
  {
    month: 'Aug',
    AWS: 22940,
    GCP: 11980,
    Azure: 8050,
    total: 42970,
    budget: 42500,
  },
  {
    month: 'Sep',
    AWS: 23180,
    GCP: 12190,
    Azure: 8110,
    total: 43480,
    budget: 43000,
  },
  {
    month: 'Oct',
    AWS: 24120,
    GCP: 12840,
    Azure: 8270,
    total: 45230,
    budget: 43500,
  },
];

export const SERVICE_COST_DISTRIBUTION: ServiceDistributionItem[] = [
  {
    service: 'Compute',
    total: 20810,
    AWS: 11420,
    GCP: 5890,
    Azure: 3500,
    percentage: 46.0,
    momChange: '+4.8%',
    color: '#E07A5F', // Warm Terracotta
  },
  {
    service: 'Database',
    total: 10855,
    AWS: 5640,
    GCP: 2895,
    Azure: 2320,
    percentage: 24.0,
    momChange: '+2.1%',
    color: '#E5B869', // Champagne Gold
  },
  {
    service: 'Storage',
    total: 8140,
    AWS: 4390,
    GCP: 2350,
    Azure: 1400,
    percentage: 18.0,
    momChange: '+6.4%',
    color: '#52B788', // Botanical Sage Jade
  },
  {
    service: 'Networking',
    total: 5425,
    AWS: 2670,
    GCP: 1705,
    Azure: 1050,
    percentage: 12.0,
    momChange: '+9.2%',
    color: '#7EA8BE', // Dusty Slate Blue
  },
];

// Initial sum of monthlySavings = 2120 + 1840 + 1420 + 1150 + 780 + 650 + 490 = $8,450
export const INITIAL_RECOMMENDATIONS: OptimizationRecommendation[] = [
  {
    id: 'rec-01',
    resourceId: 'gke-ml-train-pool-88f',
    resourceName: 'vertex-feature-gpu-worker-pool',
    provider: 'GCP',
    region: 'us-central1',
    service: 'Compute',
    ownerTeam: 'ML Research',
    wasteReason: 'Idle Cloud GPU Node Pool (0% tensor core activity for 11 days)',
    telemetryDetail: '2x a2-highgpu-1g nodes left running after experiment #409',
    remediationAction: 'Scale node pool min-nodes to 0 & enable cluster autoscaler',
    cliSnippet:
      'gcloud container clusters update ml-prod-us-central1 --enable-autoscaling --node-pool=gke-ml-train-pool-88f --min-nodes=0 --max-nodes=4 --region=us-central1',
    monthlySavings: 2120,
    currentMonthlyCost: 2480,
    confidence: 'High',
    status: 'Open',
  },
  {
    id: 'rec-02',
    resourceId: 'i-0a9f82c41e7b30912',
    resourceName: 'prod-ingest-worker-asg-04',
    provider: 'AWS',
    region: 'us-east-1',
    service: 'Compute',
    ownerTeam: 'Data Platform',
    wasteReason: 'Underutilized EC2 c6i.4xlarge instance (3.8% avg CPU over 14d)',
    telemetryDetail: 'Peak memory 18.2%, network I/O < 45 Mbps continuous',
    remediationAction: 'Rightsize instance family to c6g.xlarge (Graviton3)',
    cliSnippet:
      'aws ec2 modify-instance-attribute --instance-id i-0a9f82c41e7b30912 --instance-type "{\\"Value\\": \\"c6g.xlarge\\"}" --region us-east-1',
    monthlySavings: 1840,
    currentMonthlyCost: 2310,
    confidence: 'High',
    status: 'Open',
  },
  {
    id: 'rec-03',
    resourceId: 'sql-prod-replica-03',
    resourceName: 'az-sql-analytics-eastus2-ro',
    provider: 'Azure',
    region: 'eastus2',
    service: 'Database',
    ownerTeam: 'Analytics Eng',
    wasteReason: 'Overprovisioned Azure SQL Business Critical 16-vCore Read Replica',
    telemetryDetail: 'Zero read queries routed in 21 days following BI migration',
    remediationAction: 'Decommission orphaned read replica & snapshot final state',
    cliSnippet:
      'az sql db replica delete-link --name az-sql-analytics-eastus2-ro --resource-group rg-analytics-prod --server sql-prod-replica-03 --yes',
    monthlySavings: 1420,
    currentMonthlyCost: 1420,
    confidence: 'High',
    status: 'Open',
  },
  {
    id: 'rec-04',
    resourceId: 'vol-04f891b23c67d104a',
    resourceName: 'ebs-kafka-broker-retired-data',
    provider: 'AWS',
    region: 'us-west-2',
    service: 'Storage',
    ownerTeam: 'Data Platform',
    wasteReason: 'Unattached EBS gp3 Volume (12 TB detached 38 days ago)',
    telemetryDetail: '16,000 IOPS provisioned on detached volume after EKS rotation',
    remediationAction: 'Create compressed S3 Glacier snapshot & delete EBS volume',
    cliSnippet:
      'aws ec2 create-snapshot --volume-id vol-04f891b23c67d104a --description "pre-decommission-archive" && aws ec2 delete-volume --volume-id vol-04f891b23c67d104a',
    monthlySavings: 1150,
    currentMonthlyCost: 1195,
    confidence: 'High',
    status: 'Open',
  },
  {
    id: 'rec-05',
    resourceId: 'rds-staging-pg15-cluster',
    resourceName: 'staging-checkout-aurora-pg',
    provider: 'AWS',
    region: 'eu-west-1',
    service: 'Database',
    ownerTeam: 'Core Checkout',
    wasteReason: 'Non-production Multi-AZ RDS cluster active 100% outside work hours',
    telemetryDetail: 'Zero connections detected between 20:00–07:00 UTC & weekends',
    remediationAction: 'Convert staging to Single-AZ & attach EventBridge stop schedule',
    cliSnippet:
      'aws rds modify-db-instance --db-instance-identifier rds-staging-pg15-cluster --no-multi-az --apply-immediately',
    monthlySavings: 780,
    currentMonthlyCost: 1290,
    confidence: 'High',
    status: 'Open',
  },
  {
    id: 'rec-06',
    resourceId: 'bq-events-raw-archive',
    resourceName: 'analytics_prod.telemetry_events_v2',
    provider: 'GCP',
    region: 'us-multi',
    service: 'Storage',
    ownerTeam: 'Analytics Eng',
    wasteReason: 'Unpartitioned BigQuery hot storage & full-table scheduled queries',
    telemetryDetail: '18.4 TB active storage with 94% rows older than 90 days',
    remediationAction: 'Apply ingestion-time partitioning & 90d coldline lifecycle',
    cliSnippet:
      'bq update --time_partitioning_type=DAY --time_partitioning_expiration=7776000 analytics_prod.telemetry_events_v2',
    monthlySavings: 650,
    currentMonthlyCost: 980,
    confidence: 'Medium',
    status: 'Open',
  },
  {
    id: 'rec-07',
    resourceId: 'nat-092c188f7e6d51209',
    resourceName: 'vpc-prod-east-nat-gw-02',
    provider: 'AWS',
    region: 'us-east-1',
    service: 'Networking',
    ownerTeam: 'Data Platform',
    wasteReason: 'High NAT Gateway data processing charges for S3 & DynamoDB traffic',
    telemetryDetail: '10.8 TB/mo internal S3 bucket sync traversing managed NAT',
    remediationAction: 'Provision Gateway VPC Endpoints for S3 and DynamoDB routes',
    cliSnippet:
      'aws ec2 create-vpc-endpoint --vpc-id vpc-0a1b2c3d --service-name com.amazonaws.us-east-1.s3 --route-table-ids rtb-0123456789abcdef0',
    monthlySavings: 490,
    currentMonthlyCost: 610,
    confidence: 'High',
    status: 'Open',
  },
];

export const INITIAL_ANOMALIES: CloudAnomaly[] = [
  {
    id: 'anom-101',
    title: 'Cross-Region Egress Spike on us-east-1 NAT Gateway',
    provider: 'AWS',
    region: 'us-east-1',
    service: 'Networking',
    detectedAt: '4 hours ago',
    costImpact: 1240,
    baselineSpend: 85,
    spikeSpend: 495,
    rootCause: 'Spark backfill job pulling S3 parquet files across AZs without Gateway VPC Endpoint.',
    status: 'Active',
  },
  {
    id: 'anom-102',
    title: 'Unbounded GKE GPU Node Pool Scale-Out',
    provider: 'GCP',
    region: 'us-central1',
    service: 'Compute',
    detectedAt: '14 hours ago',
    costImpact: 980,
    baselineSpend: 140,
    spikeSpend: 630,
    rootCause: 'Orphaned Vertex AI hyperparameter sweep left 2x a2-highgpu-1g instances allocated.',
    status: 'Active',
  },
  {
    id: 'anom-103',
    title: 'Azure Blob Hot-Tier Snapshot Proliferation',
    provider: 'Azure',
    region: 'eastus2',
    service: 'Storage',
    detectedAt: '1 day ago',
    costImpact: 460,
    baselineSpend: 110,
    spikeSpend: 340,
    rootCause: 'Automated backup retention rule failed to prune hourly blob snapshots after v2.4 deploy.',
    status: 'Active',
  },
];

export const TAG_GOVERNANCE_RULES: TagGovernanceRule[] = [
  {
    tagKey: 'cost-center',
    compliantResources: 1194,
    totalResources: 1380,
    complianceRate: 86.5,
    untaggedMonthlySpend: 3420,
    primaryOffenderTeam: 'Data Platform',
  },
  {
    tagKey: 'environment',
    compliantResources: 1242,
    totalResources: 1380,
    complianceRate: 90.0,
    untaggedMonthlySpend: 2190,
    primaryOffenderTeam: 'ML Research',
  },
  {
    tagKey: 'owner-team',
    compliantResources: 1090,
    totalResources: 1380,
    complianceRate: 79.0,
    untaggedMonthlySpend: 5840,
    primaryOffenderTeam: 'Core Checkout',
  },
  {
    tagKey: 'data-lifecycle',
    compliantResources: 1001,
    totalResources: 1380,
    complianceRate: 72.5,
    untaggedMonthlySpend: 7110,
    primaryOffenderTeam: 'Analytics Eng',
  },
];

export const TEAM_BUDGET_ALLOCATIONS: TeamBudgetAllocation[] = [
  {
    team: 'Data Platform',
    lead: 'A. Rostova',
    monthlyBudget: 16500,
    currentSpend: 17420,
    forecastSpend: 18100,
    primaryCloud: 'AWS',
    openSavings: 3480,
    unitMetricLabel: 'Cost per TB Ingested',
    unitCostValue: '$14.20',
  },
  {
    team: 'ML Research',
    lead: 'D. Chen',
    monthlyBudget: 11000,
    currentSpend: 11680,
    forecastSpend: 12350,
    primaryCloud: 'GCP',
    openSavings: 2120,
    unitMetricLabel: 'Cost per 1k Inference Runs',
    unitCostValue: '$0.84',
  },
  {
    team: 'Core Checkout',
    lead: 'M. Vance',
    monthlyBudget: 9500,
    currentSpend: 8910,
    forecastSpend: 9120,
    primaryCloud: 'AWS',
    openSavings: 780,
    unitMetricLabel: 'Cost per 10k Orders',
    unitCostValue: '$3.12',
  },
  {
    team: 'Analytics Eng',
    lead: 'S. Kulkarni',
    monthlyBudget: 6500,
    currentSpend: 7220,
    forecastSpend: 7540,
    primaryCloud: 'Azure',
    openSavings: 2070,
    unitMetricLabel: 'Cost per Active BI Dashboard',
    unitCostValue: '$48.10',
  },
];

export const SUGGESTED_COPILOT_PROMPTS = [
  'Why did our bill spike last week?',
  'How can I reduce S3 storage costs?',
  'Which idle resources have the highest ROI?',
  'Why is Tag Compliance at 82%?',
];

export const INITIAL_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    timestamp: '09:14 UTC',
    content:
      'FinOps telemetry synced across AWS, GCP, and Azure. October multi-cloud spend is $45,230 (+4.0% MoM), with $8,450/mo in verified idle resource savings ready for one-click remediation. Ask me about last week’s spend spike, S3 storage optimization, or tag compliance gaps.',
    metricsReferenced: ['$45,230 Total Spend', '$8,450 Potential Savings', '3 Active Anomalies'],
  },
];

export function generateCopilotResponse(
  query: string,
  stats: {
    totalSpend: number;
    remainingSavings: number;
    remediatedSavings: number;
    openRecsCount: number;
    activeAnomaliesCount: number;
    tagCompliance: number;
  }
): { content: string; metricsReferenced: string[] } {
  const q = query.toLowerCase();

  if (q.includes('spike') || q.includes('last week') || q.includes('bill') || q.includes('anomal')) {
    return {
      content: `Last week's multi-cloud bill increased by $2,680 above baseline due to 3 primary anomalies:\n\n1. AWS us-east-1 NAT Gateway Egress (+$1,240): A Spark backfill job pulled 10.8 TB of S3 parquet files through nat-092c188f7e6d51209 instead of a free Gateway VPC Endpoint.\n2. GCP us-central1 GPU Node Pool (+$980): Pool gke-ml-train-pool-88f kept 2x a2-highgpu-1g nodes running at 0% utilization after experiment #409 finished.\n3. Azure eastus2 Blob Snapshots (+$460): Hourly hot-tier snapshots failed to prune after the v2.4 release.\n\nRemediating gke-ml-train-pool-88f and provisioning the S3 VPC Endpoint will eliminate 83% of this spike immediately.`,
      metricsReferenced: ['+$2,680 Weekly Spike', 'nat-092c188f7e6d51209', 'gke-ml-train-pool-88f'],
    };
  }

  if (q.includes('s3') || q.includes('storage') || q.includes('ebs') || q.includes('bucket')) {
    return {
      content: `Total multi-cloud Storage spend is $8,140/mo (AWS: $4,390 · GCP: $2,350 · Azure: $1,400). You can reduce AWS S3 & storage costs by $2,290/mo across three concrete actions:\n\n1. Snapshot & Delete Detached EBS Volume vol-04f891b23c67d104a ($1,150/mo): 12 TB gp3 volume detached 38 days ago in us-west-2. Moving to an S3 Glacier Deep Archive snapshot drops cost by 96%.\n2. Enable S3 Intelligent-Tiering on raw logs ($650/mo): 34 TB of standard S3 objects in prod-telemetry-archive have zero reads after 30 days.\n3. Attach S3 Gateway VPC Endpoint ($490/mo): Eliminates NAT Gateway per-GB processing fees on nat-092c188f7e6d51209.`,
      metricsReferenced: ['$8,140 Storage Spend', 'vol-04f891b23c67d104a (-$1,150/mo)', 'S3 VPC Endpoint (-$490/mo)'],
    };
  }

  if (q.includes('tag') || q.includes('compliance') || q.includes('82%') || q.includes('untagged')) {
    return {
      content: `Current Tag Compliance stands at ${stats.tagCompliance}% across 1,380 tracked cloud resources, leaving $9,420/mo in unallocated spend.\n\n• Lowest compliance key: data-lifecycle (72.5% compliant, $7,110/mo untagged, primarily in Analytics Eng).\n• Second gap: owner-team (79.0% compliant, $5,840/mo untagged in Core Checkout).\n\nEnabling our Service Control Policy (SCP) tag-enforcement guardrail on non-production AWS Organization OUs and GCP folders will raise compliance from ${stats.tagCompliance}% to an estimated 94% within 48 hours.`,
      metricsReferenced: [`${stats.tagCompliance}% Tag Compliance`, '$9,420/mo Unallocated', 'data-lifecycle: 72.5%'],
    };
  }

  if (q.includes('roi') || q.includes('idle') || q.includes('recommend') || q.includes('saving')) {
    return {
      content: `You currently have ${stats.openRecsCount} open optimization opportunities totaling $${stats.remainingSavings.toLocaleString()}/mo in potential savings${
        stats.remediatedSavings > 0
          ? ` (plus $${stats.remediatedSavings.toLocaleString()}/mo already auto-remediated this session)`
          : ''
      }.\n\nTop 3 highest-ROI actions right now:\n1. GCP gke-ml-train-pool-88f ($2,120/mo) — Scale idle A100 GPU node pool to zero.\n2. AWS i-0a9f82c41e7b30912 ($1,840/mo) — Rightsize c6i.4xlarge (3.8% CPU) to Graviton3 c6g.xlarge.\n3. Azure sql-prod-replica-03 ($1,420/mo) — Decommission unused 16-vCore Business Critical read replica.`,
      metricsReferenced: [
        `$${stats.remainingSavings.toLocaleString()}/mo Open Savings`,
        `${stats.openRecsCount} Idle Resources`,
      ],
    };
  }

  return {
    content: `Based on live October telemetry ($${stats.totalSpend.toLocaleString()} total spend across AWS $24,120, GCP $12,840, and Azure $8,270):\n\n• Compute accounts for 46% ($20,810/mo) of spend, where rightsizing i-0a9f82c41e7b30912 and scaling down gke-ml-train-pool-88f saves $3,960/mo immediately.\n• ${stats.openRecsCount} idle resource recommendations remain open worth $${stats.remainingSavings.toLocaleString()}/mo.\n• Use the "Auto-Remediate" buttons in the recommendations table to execute Terraform/API state changes and track realized monthly savings in real time.`,
    metricsReferenced: [`$${stats.totalSpend.toLocaleString()} Multi-Cloud Spend`, `$${stats.remainingSavings.toLocaleString()} Available Savings`],
  };
}

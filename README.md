# StrataFinOps — Multi-Cloud FinOps & Cost Optimization Platform

## 1. Project Overview
- **Project Title:** StrataFinOps — Multi-Cloud FinOps and Cost Optimization Dashboard
- **Team Members:**
  - Member 1: Masuma Akhtar — Roll No: 24a12res364
  - Member 2: Neehit Kumar — Roll No: 24a12res988
  - Member 3: Arjeet Kumar — Roll No: 24a12res132
  - Member 4: MD. Akbar Ali — Roll No: 24a12res377
- **Technology Stack:** React 19, TypeScript, Tailwind CSS v4, Recharts, Lucide Icons, Vite
- **Project Guide/Mentor:** CDA 311
- **Project Objective:** To design and implement a centralized multi-cloud financial operations (FinOps) platform that aggregates cloud billing telemetry across AWS, Google Cloud Platform (GCP), and Microsoft Azure, detects real-time cost anomalies, enforces resource tag governance, and automates idle resource remediation.

---

## 2. Problem Statement
Modern enterprises operate workloads across multiple cloud providers (AWS, GCP, and Azure). Engineering teams frequently provision compute instances, Kubernetes GPU node pools, unattached storage volumes, and database read replicas without centralized visibility into utilization or cost allocation tags. This leads to:
1. **Cloud Waste (20%–35% of monthly spend):** Underutilized EC2 instances, orphaned EBS volumes, and idle GKE GPU clusters continue billing 24/7.
2. **Delayed Bill Shock:** Cross-AZ NAT Gateway egress spikes and unpruned storage snapshots go unnoticed until the end-of-month invoice arrives.
3. **Unallocated Spend:** Missing `cost-center`, `owner-team`, and `data-lifecycle` tags prevent finance teams from attributing cloud costs to specific engineering units.

**StrataFinOps** solves this by providing a unified, real-time executive dashboard with interactive service cost breakdowns, automated CLI/API remediation workflows, tag compliance simulation, and an AI FinOps Copilot.

---

## 3. Features
- **Executive Summary KPI Cards:** Live tracking of Total Multi-Cloud Spend (`$45,230/mo`), Potential Monthly Savings (`$8,450/mo`), Tag Compliance Rate (`82%`), and Active Cloud Anomalies (`3`), with dynamic net run-rate recalculation as optimizations are applied.
- **Interactive Multi-Cloud Cost Analytics (Recharts):**
  - 6-Month Amortized Spend Trend comparing AWS vs. GCP vs. Azure with Stacked Bar and Area Velocity modes.
  - Interactive Service Cost Distribution (Compute, Database, Storage, Networking) with click-to-filter drill-down.
- **Engineering Team Budgets & Unit Economics:** Tracks monthly budget burn rate and unit cost metrics (*Cost per TB Ingested*, *Cost per 1k Inference Runs*, *Cost per 10k Orders*) across engineering teams.
- **Cost Optimization Recommendations & Auto-Remediation Engine:**
  - High-density data grid listing idle resources (`Resource ID`, `Cloud Provider`, `Waste Reason & Telemetry`, `Estimated Monthly Savings`) with single-click and batch **Auto-Remediate** execution.
  - **Slide-Over CLI Runbook Inspector:** Displays 14-day utilization telemetry, before/after spend impact, and copyable AWS CLI, `gcloud`, and Azure CLI commands.
- **Real-Time Anomaly Detection & Tag Governance Simulator:** Identifies 3-sigma spend spikes and simulates AWS Service Control Policy (SCP) tag enforcement (`82% → 91%` compliance).
- **AI FinOps Copilot Sidebar:** Context-aware interactive assistant answering natural-language queries on bill spikes, S3 storage tiering, idle ROI, and tag compliance gaps.
- **One-Click CSV Report Export:** Generates downloadable FinOps audit reports directly from the current state.

---

## 4. Technology Stack
- **Programming Languages:** TypeScript 5.x, HTML5, CSS3
- **Frontend Framework:** React 19 (Functional Components, Custom State Hooks)
- **Styling & Design System:** Tailwind CSS v4 (Obsidian, Alabaster Ivory, Champagne Gold, Botanical Sage & Terracotta dark-mode palette), Google Fonts (`Plus Jakarta Sans`, `DM Sans`, `JetBrains Mono`)
- **Data Visualization:** Recharts (`BarChart`, `AreaChart`, `PieChart`, `ResponsiveContainer`)
- **Icons:** Lucide React (`lucide-react`)
- **Build & Tooling:** Vite 8, ESBuild, Node.js

---

## 5. Project Structure
```text
/
├── index.html                                    # HTML entry point & Google Fonts configuration
├── metadata.json                                 # Application metadata & capabilities manifest
├── package.json                                  # Project dependencies & build scripts
├── tsconfig.json                                 # TypeScript compiler configuration
├── vite.config.ts                                # Vite bundler & Tailwind v4 plugin config
├── README.md                                     # Complete 12-section project documentation
└── src/
    ├── main.tsx                                  # React DOM root mount
    ├── index.css                                 # Tailwind CSS v4 theme & tabular numeral utilities
    ├── App.tsx                                   # Main layout, vertical nav rail & state orchestration
    ├── data/
    │   └── mockFinOpsData.ts                     # Multi-cloud telemetry dataset & Copilot engine
    └── components/
        ├── MultiCloudCharts.tsx                  # Recharts 6-month trend & service donut charts
        ├── TeamBudgetsSection.tsx                # Engineering team budget burn-rate & unit economics
        ├── RecommendationsTable.tsx              # Filterable idle resource table & auto-remediation
        ├── ResourceInspectorDrawer.tsx           # Slide-over CLI runbook & telemetry inspector
        ├── GovernanceAndAnomaliesSection.tsx     # 3-sigma spend anomalies & SCP tag simulator
        └── FinOpsCopilotSidebar.tsx              # Interactive AI FinOps chat assistant
```

---

## 6. Installation and Execution
Follow these step-by-step instructions to run the project locally:

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd strata-finops-dashboard
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 7. Screenshots / Output
- **Unified Executive View:** Displays the 4 KPI summary cards (`$45,230` Total Spend, `$8,450` Potential Monthly Savings, `82%` Tag Compliance, `3` Active Anomalies), 6-month multi-cloud stacked bar/area chart, service cost donut chart, and dockable AI FinOps Copilot.
- **Optimization & CLI Runbook Inspector:** Demonstrates real-time filtering by Cloud Provider (`AWS`, `GCP`, `Azure`), one-click `Auto-Remediate` state transitions, and the slide-over CLI command drawer.
- **Governance & Anomaly Response:** Shows live mitigation of cross-region NAT Gateway spikes and SCP tag-compliance simulation (`82% → 91%`).

---

## 8. DSA Concepts Used
The following Data Structures and Algorithms (DSA) concepts are implemented in this project:

- **Arrays and Dynamic Linear Reductions (`Array.prototype.reduce`, `map`, `filter`):**
  - Used to compute real-time aggregations across multi-cloud spend vectors (`SIX_MONTH_SPEND_DATA`), dynamically summing remaining open savings vs. realized monthly savings as resources transition from `Open` to `Remediated`.
- **String Searching and Case-Insensitive Substring Matching:**
  - Implemented in the live recommendations search bar (`RecommendationsTable.tsx`) and the AI FinOps Copilot intent parser (`generateCopilotResponse` in `mockFinOpsData.ts`) using normalized lowercase substring matching (`toLowerCase().includes(q)`) across Resource IDs, regions, owner teams, and waste telemetry descriptions.
- **Multi-Predicate Filtering & Set Intersection:**
  - Combines four orthogonal filter predicates (`CloudProvider`, `ServiceCategory`, `OwnerTeam`, and `RemediationStatus`) with free-text search in a single linear pass over the recommendations collection.
- **Hashing & Key-Value Lookup Maps:**
  - Used for constant-time $O(1)$ property lookups when projecting provider-specific service spend (`item[selectedProvider]`) and mapping unique `resourceId` / `id` keys during state updates.
- **Queue / Append-Only Message Stream:**
  - The AI FinOps Copilot conversation log operates as an ordered FIFO message sequence where user queries and synthesized telemetry responses are appended chronologically with automatic viewport scrolling.
- **Time and Space Complexity:**
  - **Filtering & Spend Aggregation:** $O(N)$ time complexity per render/filter cycle and $O(K)$ auxiliary space (where $N$ is the number of cloud resources and $K \le N$ is the filtered subset).
  - **Provider Cost Projection:** $O(S)$ time complexity where $S = 4$ service categories (`Compute`, `Database`, `Storage`, `Networking`), using $O(1)$ hash-key access per provider.
  - **Single-Resource Auto-Remediation Update:** $O(N)$ immutable array update by ID match with $O(1)$ state delta calculation.

---

## 9. Learning Outcomes
- Designing high-density enterprise FinOps interfaces with strict typographic hierarchy and tabular numeral alignment (`tabular-nums`) for financial precision.
- Managing derived reactive state in React 19 TypeScript applications so that actions in one module (auto-remediating an idle resource or enforcing an SCP tag policy) immediately propagate to executive KPI cards, net run-rate projections, and AI Copilot responses.
- Building responsive, interactive multi-series charts with Recharts (`BarChart`, `AreaChart`, `PieChart`) that act as bi-directional filter controls.
- Translating real-world cloud infrastructure optimization patterns (AWS EC2 Graviton rightsizing, S3 Gateway VPC Endpoints, GKE GPU autoscaling, and BigQuery partitioning) into actionable developer workflows.

---

## 10. Future Scope
- **Live Cloud Billing API Connectors:** Integrate AWS Cost Explorer / CUR (Cost and Usage Report), GCP BigQuery Billing Export, and Azure Cost Management REST APIs.
- **Automated Terraform Pull Request Generation:** Trigger GitHub/GitLab Pull Requests modifying `.tf` infrastructure-as-code files directly when a user clicks **Auto-Remediate**.
- **Kubernetes Pod-Level Cost Allocation:** Integrate OpenCost / Kubecost metrics to break down shared GKE and EKS cluster spend by namespace and deployment label.
- **Reserved Instance (RI) & Savings Plans Optimizer:** Recommend 1-year and 3-year commitment coverage based on 90-day historical compute baselines.

---

## 11. References
1. FinOps Foundation — *FinOps Framework & Cloud Cost Management Specification* (https://www.finops.org)
2. AWS Architecture Blog — *Optimizing AWS NAT Gateway & S3 Data Transfer Costs*
3. Google Cloud Documentation — *GKE Cluster Autoscaler & BigQuery Partitioned Tables*
4. React 19 & TypeScript Documentation (https://react.dev)
5. Recharts Composable Charting Library Documentation (https://recharts.org)
6. Tailwind CSS v4 Documentation (https://tailwindcss.com)

---

## 12. License
Licensed under the **Apache License 2.0**. See project metadata for details.

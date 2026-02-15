import { ComponentType, NodeData, StatMetric, LinkData, InteractionFlow } from './types';

// Palette mapping
export const COLORS = {
  cyan: 'cyan',
  green: 'emerald',
  magenta: 'fuchsia',
  blue: 'blue',
  slate: 'slate',
  amber: 'amber',
  violet: 'violet',
  orange: 'orange',
  rose: 'rose'
};

export const NODES: NodeData[] = [
  // --- Tier 1: Main Agent ---
  {
    id: 'main-agent',
    label: 'Cursor Main Agent',
    type: ComponentType.MAIN_AGENT,
    description: 'Orchestrator: Delegates to sub-agents and uses core tools. Click to run scenarios.',
    color: COLORS.violet,
    iconName: 'Bot',
    contextFile: 'sys_orchestrator.md',
    radius: 65,
    skills: [
      {
        id: 'context-manager',
        label: 'Context Manager',
        description: 'Manages user session and request history.',
        iconName: 'Box'
      }
    ]
  },

  // --- Tier 2: Squad Agents (Direct Reports, Strategic) ---
  {
    id: 'product-manager',
    label: 'Product Manager',
    type: ComponentType.SQUAD_AGENT,
    description: 'Lead PM: Defines product vision, requirements, and user stories.',
    color: COLORS.blue,
    iconName: 'NotebookPen',
    contextFile: 'pm_strategy.md',
    details: { mission: 'Product Strategy & Backlog Management' },
    radius: 60,
    skills: [
      {
        id: 'notion-backlog',
        label: 'Notion Backlog',
        description: 'Manage backlog via Notion MCP.',
        iconName: 'RefreshCw',
        relatedMcpId: 'mcp-notion'
      },
      {
        id: 'foundry-persona',
        label: 'User Personas',
        description: 'Simulate user interviews.',
        iconName: 'Users',
        relatedMcpId: 'mcp-azure'
      }
    ]
  },
  {
    id: 'tech-lead',
    label: 'Technical Lead',
    type: ComponentType.SQUAD_AGENT,
    description: 'Lead Dev: Architect, Code Review, DevOps Strategy.',
    color: COLORS.cyan,
    iconName: 'Cpu',
    contextFile: 'tech_arch.md',
    details: { mission: 'Technical Direction & QA' },
    radius: 60,
    skills: [
      {
        id: 'azure-cli-wrapper',
        label: 'Azure CLI',
        description: 'Inspect infrastructure.',
        iconName: 'Terminal',
        relatedMcpId: 'mcp-azure'
      }
    ]
  },
  {
    id: 'ops-manager',
    label: 'Ops Manager',
    type: ComponentType.SQUAD_AGENT,
    description: 'Manage team, communications, and process.',
    color: COLORS.rose,
    iconName: 'Users',
    contextFile: 'ops_handbook.md',
    details: { mission: 'Team Ops' },
    radius: 60,
    skills: [
      {
        id: 'team-directory',
        label: 'Directory',
        description: 'Manage contact list.',
        iconName: 'Book',
        relatedMcpId: 'mcp-github'
      }
    ]
  },

  // --- Tier 3: Sub Agents (Execution, Tactical) ---
  {
    id: 'frontend-dev', // formerly streamlit-designer
    label: 'Frontend Dev',
    type: ComponentType.SUB_AGENT,
    description: 'Implement UI components and pages.',
    color: COLORS.green,
    iconName: 'Palette',
    contextFile: 'ui_implementation.md',
    details: { mission: 'Build UI' },
    radius: 55,
    skills: [
      {
        id: 'component-library',
        label: 'Component Lib',
        description: 'Access UI Design System.',
        iconName: 'Layout'
      }
    ]
  },
  {
    id: 'qa-tester',
    label: 'QA Engineer',
    type: ComponentType.SUB_AGENT,
    description: 'Run automated tests and validate features.',
    color: COLORS.green,
    iconName: 'CheckCircle',
    contextFile: 'qa_testing.md',
    details: { mission: 'Quality Assurance' },
    radius: 55,
    skills: [
      {
        id: 'playwright-runner',
        label: 'E2E Runner',
        description: 'Run Playwright tests.',
        iconName: 'Play'
      }
    ]
  },
  {
    id: 'security-audit',
    label: 'Security Bot',
    type: ComponentType.SUB_AGENT,
    description: 'Scan code and dependencies for vulnerabilities.',
    color: COLORS.green,
    iconName: 'Shield', // Mapping might need update in SystemMap if Shield not imported
    contextFile: 'sec_audit.md',
    details: { mission: 'Security Scan' },
    radius: 55,
    skills: [
      {
        id: 'trivy-scanner',
        label: 'Vuln Scanner',
        description: 'Container security scan.',
        iconName: 'Search'
      }
    ]
  },
  {
    id: 'devops-runner', // formerly devops-agent
    label: 'CI/CD Runner',
    type: ComponentType.SUB_AGENT,
    description: 'Execute deployment pipelines.',
    color: COLORS.green,
    iconName: 'Container',
    contextFile: 'pipeline_runner.md',
    details: { mission: 'Pipeline Execution' },
    radius: 55
  },
  {
    id: 'secretary-bot', // formerly secretaire
    label: 'Comms Bot',
    type: ComponentType.SUB_AGENT,
    description: 'Send notifications and emails.',
    color: COLORS.green,
    iconName: 'Mail',
    contextFile: 'mailer.md',
    details: { mission: 'Send Communications' },
    radius: 55,
    skills: [
      {
        id: 'email-sender',
        label: 'Email Sender',
        description: 'SMTP/API Emailer.',
        iconName: 'Send'
      }
    ]
  },

  // --- Tier 4: MCPs (Unified Color: Amber) ---
  { id: 'mcp-azure', label: 'Azure MCP', type: ComponentType.MCP, description: 'Full Cloud Control', color: COLORS.amber, iconName: 'Cloud', radius: 50 },
  { id: 'mcp-notion', label: 'Notion MCP', type: ComponentType.MCP, description: 'Knowledge Base API', color: COLORS.amber, iconName: 'Book', radius: 50 },
  { id: 'mcp-github', label: 'GitHub MCP', type: ComponentType.MCP, description: 'Code Repository', color: COLORS.amber, iconName: 'Github', radius: 50 },
  { id: 'mcp-gemini', label: 'Gemini MCP', type: ComponentType.MCP, description: 'LLM Intelligence', color: COLORS.amber, iconName: 'Sparkles', radius: 50 },
  { id: 'mcp-browser', label: 'Browser MCP', type: ComponentType.MCP, description: 'Web Access', color: COLORS.amber, iconName: 'Globe', radius: 50 },
];

export const LINKS: LinkData[] = [
  // Tier 1 -> Tier 2 (Main -> Squad)
  { source: 'main-agent', target: 'product-manager' },
  { source: 'main-agent', target: 'tech-lead' },
  { source: 'main-agent', target: 'ops-manager' },

  // Tier 2 -> Tier 3 (Squad -> Sub)
  { source: 'product-manager', target: 'frontend-dev' },
  { source: 'tech-lead', target: 'qa-tester' },
  { source: 'tech-lead', target: 'security-audit' },
  { source: 'tech-lead', target: 'devops-runner' },
  { source: 'ops-manager', target: 'secretary-bot' },

  // Helper connections (Cross-functional)
  { source: 'product-manager', target: 'ops-manager' },

  // Tier 3 -> MCPs (Sub -> MCP)
  { source: 'qa-tester', target: 'mcp-github' },
  { source: 'security-audit', target: 'mcp-github' },
  { source: 'devops-runner', target: 'mcp-azure' },
  { source: 'secretary-bot', target: 'mcp-notion' },

  // Tier 2 -> MCPs (Squad -> MCP direct usage)
  { source: 'product-manager', target: 'mcp-notion' },
  { source: 'product-manager', target: 'mcp-azure' },
  { source: 'tech-lead', target: 'mcp-azure' },
  { source: 'ops-manager', target: 'mcp-github' },

  // Main -> Core MCPs
  { source: 'main-agent', target: 'mcp-gemini' },
  { source: 'main-agent', target: 'mcp-github' },
];

export const STATS: StatMetric[] = [
  { name: 'Squad Leads', value: 3, fill: '#3b82f6' }, // Blue
  { name: 'Sub Agents', value: 5, fill: '#10b981' }, // Emerald
  { name: 'MCPs', value: 5, fill: '#f59e0b' }, // Amber
];

export const SCENARIOS: InteractionFlow[] = [
  {
    id: 'feature-spec',
    title: 'Create Feature Spec',
    description: 'Chain: Main -> PM -> Notion.',
    steps: [
      { label: 'Delegation', from: 'main-agent', to: 'product-manager', description: 'Main Agent delegates requirement analysis to PM.' },
      { label: 'Research', from: 'product-manager', to: 'mcp-azure', description: 'PM verifies user persona assumptions.' },
      { label: 'Drafting', from: 'product-manager', to: 'mcp-notion', description: 'PM creates feature spec in Notion.' },
      { label: 'Review', from: 'mcp-notion', to: 'product-manager', description: 'Notion confirms page created.' },
      { label: 'Handoff', from: 'product-manager', to: 'frontend-dev', description: 'PM notifies Frontend Dev of new spec.' }
    ]
  },
  {
    id: 'deploy-hotfix',
    title: 'Deploy Hotfix',
    description: 'Chain: Main -> Tech Lead -> DevOps -> Azure.',
    steps: [
      { label: 'Alert', from: 'main-agent', to: 'tech-lead', description: 'Main Agent reports critical issue.' },
      { label: 'Diagnose', from: 'tech-lead', to: 'mcp-azure', description: 'Tech Lead checks Azure logs.' },
      { label: 'Strategy', from: 'tech-lead', to: 'devops-runner', description: 'Tech Lead instructs Runner to deploy fix.' },
      { label: 'Deploy', from: 'devops-runner', to: 'mcp-azure', description: 'Runner executes deployment command.' },
      { label: 'Confirm', from: 'mcp-azure', to: 'devops-runner', description: 'Azure confirms deployment success.' },
      { label: 'Report', from: 'devops-runner', to: 'tech-lead', description: 'Runner reports success.' },
      { label: 'Final', from: 'tech-lead', to: 'main-agent', description: 'Issue resolved.' }
    ]
  },
  {
    id: 'qa-audit',
    title: 'Code Quality Audit',
    description: 'Tech Lead -> QA/Security -> GitHub.',
    steps: [
      { label: 'Request', from: 'main-agent', to: 'tech-lead', description: 'Routine quality check requested.' },
      { label: 'Scan', from: 'tech-lead', to: 'security-audit', description: 'Security scan initiated.' },
      { label: 'Analyze', from: 'security-audit', to: 'mcp-github', description: 'Scanner checks repo for vulnerabilities.' },
      { label: 'Test', from: 'tech-lead', to: 'qa-tester', description: 'QA tests initiated.' },
      { label: 'Execute', from: 'qa-tester', to: 'mcp-github', description: 'E2E tests run against latest commit.' },
      { label: 'Report', from: 'tech-lead', to: 'main-agent', description: 'Audit complete, all green.' }
    ]
  }
];
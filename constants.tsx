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
    radius: 65
  },

  // --- Tier 2: Sub Agents (Unified Color: Blue) ---
  {
    id: 'cosmos-dba',
    label: 'CosmosDB DBA',
    type: ComponentType.SUB_AGENT,
    description: 'Manage CosmosDB structure and data operations safely.',
    color: COLORS.blue,
    iconName: 'Database',
    contextFile: 'dba_guidelines.md',
    details: { mission: 'Safe DB Operations', special: 'Requires Human Validation' },
    radius: 60
  },
  {
    id: 'devops-agent',
    label: 'DevOps Agent',
    type: ComponentType.SUB_AGENT,
    description: 'CI/CD, Infrastructure, Testing.',
    color: COLORS.blue,
    iconName: 'Container',
    contextFile: 'cicd_pipelines.md',
    details: { mission: 'Infrastructure & Deployment' },
    radius: 60
  },
  {
    id: 'product-manager',
    label: 'Recipe PM',
    type: ComponentType.SUB_AGENT,
    description: 'Analyze Use Cases, write specs, manage backlog.',
    color: COLORS.blue,
    iconName: 'NotebookPen',
    contextFile: 'product_specs.md',
    details: { mission: 'Product Specs & Backlog' },
    radius: 60
  },
  {
    id: 'secretaire',
    label: 'Secretary',
    type: ComponentType.SUB_AGENT,
    description: 'Team communication and administration.',
    color: COLORS.blue,
    iconName: 'Mail',
    contextFile: 'comms_policy.md',
    details: { mission: 'Comms & Admin' },
    radius: 60
  },
  {
    id: 'streamlit-designer',
    label: 'Streamlit Designer',
    type: ComponentType.SUB_AGENT,
    description: 'Create interfaces, design UI/UX.',
    color: COLORS.blue,
    iconName: 'Palette',
    contextFile: 'ui_design_system.md',
    details: { mission: 'Frontend Implementation' },
    radius: 60
  },

  // --- Tier 3: Skills (Unified Color: Green/Emerald) ---
  
  // Cosmos DBA Skills
  { 
    id: 'cosmosdb-cli-wrapper', 
    label: 'Cosmos CLI Wrapper', 
    type: ComponentType.SKILL, 
    description: 'Encapsule les commandes Azure CLI pour explorer la structure CosmosDB : comptes, bases SQL, conteneurs. Pour diagnostiquer la configuration, lister les bases et conteneurs, et consulter la métadonnée. Préconfiguré pour le projet (azneco1rec001, recipes-db).', 
    color: COLORS.green, 
    iconName: 'Terminal', 
    radius: 45 
  },
  { 
    id: 'cosmosdb-data-ops', 
    label: 'CosmosDB Data Ops', 
    type: ComponentType.SKILL, 
    description: 'Gère les opérations CRUD sur les items CosmosDB via le SDK Python azure-cosmos : lecture, création, mise à jour, suppression. Utilise DefaultAzureCredential. Toute modification doit être validée par un humain avant exécution.', 
    color: COLORS.green, 
    iconName: 'Activity', 
    radius: 45 
  },
  { 
    id: 'data-export', 
    label: 'Data Export', 
    type: ComponentType.SKILL, 
    description: 'Exporte des données en CSV ou Excel avec pandas et openpyxl. Crée des fichiers dans orusRecipies/exports/ à partir de listes de dictionnaires ou de DataFrames. Utilisable pour rapports, extractions et partage de données.', 
    color: COLORS.green, 
    iconName: 'FileText', 
    radius: 45 
  },
  
  // DevOps Skills
  { 
    id: 'azure-cli-wrapper', 
    label: 'Azure CLI Wrapper', 
    type: ComponentType.SKILL, 
    description: 'Encapsule les commandes Azure CLI (az) pour interroger l’infrastructure Azure : listes de Container Apps, images ACR, statut de déploiement, logs. Utilisation pour des requêtes sur l’état des ressources (Container Apps, registres, groupes de ressources). Nécessite az login et un fichier .env configuré.', 
    color: COLORS.green, 
    iconName: 'Terminal', 
    radius: 45 
  },

  // PM Skills
  { 
    id: 'notion-backlog', 
    label: 'Notion Backlog', 
    type: ComponentType.SKILL, 
    description: 'Centralise les opérations sur le backlog produit Notion (features, use cases) via le MCP Notion. Permet de lister, créer, modifier et lire les entrées. Toute modification doit être validée par un humain.', 
    color: COLORS.green, 
    iconName: 'RefreshCw', 
    radius: 45 
  },
  { 
    id: 'foundry-persona', 
    label: 'Foundry Persona', 
    type: ComponentType.SKILL, 
    description: 'Consulte des personas synthétiques via Azure AI Foundry pour valider des hypothèses produit ou tester des specs. Personas : Chef Culinaire, Nutritionniste, Manager de Site, Responsable Qualité. Pour valider des cas d’usage du domaine culinaire Sodexo.', 
    color: COLORS.green, 
    iconName: 'Users', 
    radius: 45 
  },

  // Secretary Skills
  { 
    id: 'email-sender', 
    label: 'Email Sender', 
    type: ComponentType.SKILL, 
    description: 'Envoie des emails via l’API Power Automate (HTTP trigger). Utilise un corps HTML. Doit être utilisé uniquement après validation du contenu par l’utilisateur. Indiquée pour envoi de messages déjà relus et validés.', 
    color: COLORS.green, 
    iconName: 'Send', 
    radius: 45 
  },
  { 
    id: 'team-directory', 
    label: 'Team Directory', 
    type: ComponentType.SKILL, 
    description: 'Gère l’annuaire d’équipe (docs/team-directory.md) : consultation et modification des contacts (nom, email, rôle, équipe, style de communication). Toute modification doit être validée par un humain avant écriture.', 
    color: COLORS.green, 
    iconName: 'Book', 
    radius: 45 
  },

  // --- Tier 4: MCPs (Unified Color: Amber) ---
  { id: 'mcp-azure', label: 'Azure MCP', type: ComponentType.MCP, description: 'Full Cloud Control', color: COLORS.amber, iconName: 'Cloud', radius: 55 },
  { id: 'mcp-notion', label: 'Notion MCP', type: ComponentType.MCP, description: 'Knowledge Base API', color: COLORS.amber, iconName: 'Book', radius: 55 },
  { id: 'mcp-github', label: 'GitHub MCP', type: ComponentType.MCP, description: 'Code Repository', color: COLORS.amber, iconName: 'Github', radius: 55 },
  { id: 'mcp-gemini', label: 'Gemini MCP', type: ComponentType.MCP, description: 'LLM Intelligence', color: COLORS.amber, iconName: 'Sparkles', radius: 55 },
  { id: 'mcp-browser', label: 'Browser MCP', type: ComponentType.MCP, description: 'Web Access', color: COLORS.amber, iconName: 'Globe', radius: 55 },
];

export const LINKS: LinkData[] = [
  // Main to Sub Agents
  { source: 'main-agent', target: 'cosmos-dba' },
  { source: 'main-agent', target: 'devops-agent' },
  { source: 'main-agent', target: 'product-manager' },
  { source: 'main-agent', target: 'secretaire' },
  { source: 'main-agent', target: 'streamlit-designer' },

  // Main to Core MCPs
  { source: 'main-agent', target: 'mcp-github' },
  { source: 'main-agent', target: 'mcp-gemini' },

  // Sub Agents -> Skills
  { source: 'cosmos-dba', target: 'cosmosdb-cli-wrapper' },
  { source: 'cosmos-dba', target: 'cosmosdb-data-ops' },
  { source: 'cosmos-dba', target: 'data-export' },
  
  { source: 'devops-agent', target: 'azure-cli-wrapper' },

  { source: 'product-manager', target: 'notion-backlog' },
  { source: 'product-manager', target: 'foundry-persona' },

  { source: 'secretaire', target: 'email-sender' },
  { source: 'secretaire', target: 'team-directory' },

  // Skills -> MCPs (The "Physical" connection)
  { source: 'cosmosdb-cli-wrapper', target: 'mcp-azure' },
  { source: 'cosmosdb-data-ops', target: 'mcp-azure' },
  { source: 'azure-cli-wrapper', target: 'mcp-azure' },
  { source: 'foundry-persona', target: 'mcp-azure' },
  
  { source: 'notion-backlog', target: 'mcp-notion' },
  
  { source: 'team-directory', target: 'mcp-github' }, // Directory stored in docs/ (git)
  { source: 'data-export', target: 'mcp-github' }, // Exports saved to repo folder
];

export const STATS: StatMetric[] = [
  { name: 'Orchestrator', value: 1, fill: '#8b5cf6' }, // Violet
  { name: 'Sub Agents', value: 5, fill: '#3b82f6' }, // Blue
  { name: 'Skills', value: 8, fill: '#10b981' }, // Emerald (Updated count)
  { name: 'MCPs', value: 5, fill: '#f59e0b' }, // Amber
];

export const SCENARIOS: InteractionFlow[] = [
  {
    id: 'feature-spec',
    title: 'Create Feature Spec',
    description: 'Round-trip: From Main Agent to Notion creation and back.',
    steps: [
      { label: 'Delegation', from: 'main-agent', to: 'product-manager', description: 'Main Agent processes user request and delegates to PM Agent.' },
      { label: 'Skill Call', from: 'product-manager', to: 'notion-backlog', description: 'PM invokes Notion Backlog skill.' },
      { label: 'API Req', from: 'notion-backlog', to: 'mcp-notion', description: 'Skill calls Notion API via MCP to create page.' },
      { label: 'API Res', from: 'mcp-notion', to: 'notion-backlog', description: 'Notion API confirms page creation.' },
      { label: 'Skill Return', from: 'notion-backlog', to: 'product-manager', description: 'Skill returns new page URL to PM.' },
      { label: 'Report', from: 'product-manager', to: 'main-agent', description: 'PM confirms task completion to Main Agent.' }
    ]
  },
  {
    id: 'check-deployment',
    title: 'Check Deployment Status',
    description: 'DevOps Agent inspects Azure resources via CLI.',
    steps: [
      { label: 'Delegation', from: 'main-agent', to: 'devops-agent', description: 'Main Agent requests infrastructure status report.' },
      { label: 'CLI Call', from: 'devops-agent', to: 'azure-cli-wrapper', description: 'DevOps invokes Azure CLI Wrapper.' },
      { label: 'Execute', from: 'azure-cli-wrapper', to: 'mcp-azure', description: 'Wrapper executes "az container app list".' },
      { label: 'Data', from: 'mcp-azure', to: 'azure-cli-wrapper', description: 'Azure returns JSON status of containers.' },
      { label: 'Analysis', from: 'azure-cli-wrapper', to: 'devops-agent', description: 'Skill parses JSON and reports health.' },
      { label: 'Report', from: 'devops-agent', to: 'main-agent', description: 'DevOps confirms environment is healthy.' }
    ]
  },
  {
    id: 'db-maintenance',
    title: 'Secure DB Maintenance',
    description: 'Multi-skill: DBA Agent checks metrics then runs optimization.',
    steps: [
      { label: 'Request', from: 'main-agent', to: 'cosmos-dba', description: 'Main Agent requests database optimization.' },
      { label: 'Check', from: 'cosmos-dba', to: 'cosmosdb-cli-wrapper', description: 'DBA checks current health via CLI skill.' },
      { label: 'Fetch', from: 'cosmosdb-cli-wrapper', to: 'mcp-azure', description: 'CLI requests metrics from Azure MCP.' },
      { label: 'Data', from: 'mcp-azure', to: 'cosmosdb-cli-wrapper', description: 'Azure returns high latency metrics.' },
      { label: 'Report', from: 'cosmosdb-cli-wrapper', to: 'cosmos-dba', description: 'CLI reports health issues to DBA.' },
      { label: 'Action', from: 'cosmos-dba', to: 'cosmosdb-data-ops', description: 'DBA triggers optimization routine.' },
      { label: 'Execute', from: 'cosmosdb-data-ops', to: 'mcp-azure', description: 'Data Ops runs scaling command on Azure.' },
      { label: 'Confirm', from: 'mcp-azure', to: 'cosmosdb-data-ops', description: 'Azure confirms scaling complete.' },
      { label: 'Done', from: 'cosmosdb-data-ops', to: 'cosmos-dba', description: 'Optimization finished.' },
      { label: 'Final', from: 'cosmos-dba', to: 'main-agent', description: 'Maintenance complete, system healthy.' }
    ]
  }
];
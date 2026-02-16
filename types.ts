export enum ComponentType {
  MAIN_AGENT = 'MAIN_AGENT',
  TEAM_SQUAD = 'TEAM_SQUAD',
  SUB_AGENT = 'SUB_AGENT',
  SKILL = 'SKILL',
  MCP = 'MCP'
}

export interface SkillData {
  id: string;
  label: string;
  description: string;
  iconName: string;
  relatedMcpId?: string;
}

export interface NodeData {
  id: string;
  label: string;
  type: ComponentType;
  description: string;
  color: string; // Tailwind class prefix or hex
  iconName: string;
  contextFile?: string; // Linked context document (.md)
  contextFiles?: string[]; // List of context files
  skills?: string[]; // List of skill IDs (referencing other nodes)
  details?: {
    mission?: string;
    skillsUsed?: string[];
    mcpUsed?: string[];
    special?: string;
  };
  radius?: number; // For visualization sizing
}

export interface LinkData {
  source: string;
  target: string;
}

export interface StatMetric {
  name: string;
  value: number;
  fill: string;
}

export interface FlowStep {
  label: string;
  from: string;
  to: string;
  description: string;
}

export interface InteractionFlow {
  id: string;
  title: string;
  description: string;
  steps: FlowStep[];
}
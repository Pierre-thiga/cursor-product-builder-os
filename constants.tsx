import { ComponentType, NodeData, StatMetric, LinkData, InteractionFlow } from './types';
import archData from './data/recipe-arch.json';

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

// Transform and validate data
export const NODES: NodeData[] = archData.NODES.map((node: any) => ({
  ...node,
  type: node.type as ComponentType,
  // Add visualization specific properties if needed
  radius: node.type === 'MAIN_AGENT' ? 65 :
    node.type === 'TEAM_SQUAD' ? 60 :
      node.type === 'SUB_AGENT' ? 55 :
        node.type === 'MCP' ? 50 : 45
}));

export const LINKS: LinkData[] = archData.LINKS;

export const SCENARIOS: InteractionFlow[] = archData.SCENARIOS;

// Calculate stats dynamically
const squadCount = NODES.filter(n => n.type === ComponentType.TEAM_SQUAD).length;
const subAgentCount = NODES.filter(n => n.type === ComponentType.SUB_AGENT).length;
const mcpCount = NODES.filter(n => n.type === ComponentType.MCP).length;
const skillCount = NODES.filter(n => n.type === ComponentType.SKILL).length;

export const STATS: StatMetric[] = [
  { name: 'Squads', value: squadCount, fill: '#3b82f6' }, // Blue
  { name: 'Sub Agents', value: subAgentCount, fill: '#10b981' }, // Emerald
  { name: 'MCPs', value: mcpCount, fill: '#f59e0b' }, // Amber
  { name: 'Skills', value: skillCount, fill: '#f97316' }, // Orange
];
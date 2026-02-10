import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Bot, Database, Container, NotebookPen, 
  Mail, Palette, Cloud, Book, Github, Sparkles, 
  FileText, Activity, Terminal, Box, CheckCircle,
  RefreshCw, Users, Send, Layout, Globe, Play
} from 'lucide-react';
import { NodeData, ComponentType, LinkData, FlowStep } from '../types';
import { LINKS } from '../constants';

// --- Icon Mapping ---
const Icons: Record<string, React.ElementType> = {
  User, Bot, Database, Container, NotebookPen, 
  Mail, Palette, Cloud, Book, Github, Sparkles, 
  FileText, Terminal, Box, CheckCircle, RefreshCw, 
  Users, Send, Layout, Globe
};

// --- Props ---
interface SystemMapProps {
  nodes: NodeData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeFlowStep: FlowStep | null; // Currently executing step
}

// --- Layout Configuration ---
// Adjusted to fit 220px wide nodes within the viewport
const COLUMN_CONFIG = {
  [ComponentType.MAIN_AGENT]: 0.15,  
  [ComponentType.SUB_AGENT]: 0.38,   
  [ComponentType.SKILL]: 0.62,       
  [ComponentType.MCP]: 0.85          
};

const COLUMN_LABELS = [
  { label: 'ORCHESTRATOR', x: '15%' },
  { label: 'AGENTS SQUAD', x: '38%' },
  { label: 'SKILLS', x: '62%' },
  { label: 'MCP SERVERS', x: '85%' },
];

// --- Force Simulation Helper ---
const useForceSimulation = (nodes: NodeData[], links: LinkData[], width: number, height: number) => {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  
  useEffect(() => {
    if (width === 0 || height === 0) return;

    // Initial positioning setup
    const currentPos: Record<string, { x: number; y: number; vy: number }> = {};
    
    const nodesByCol: Record<number, NodeData[]> = {};
    nodes.forEach(n => {
       const pct = COLUMN_CONFIG[n.type] || 0.5;
       if (!nodesByCol[pct]) nodesByCol[pct] = [];
       nodesByCol[pct].push(n);
    });

    Object.entries(nodesByCol).forEach(([pctStr, colNodes]) => {
        const pct = parseFloat(pctStr);
        const fixedX = width * pct;
        const totalHeight = height * 0.8; 
        const startY = height * 0.1;
        const gap = totalHeight / (colNodes.length + 1);

        colNodes.forEach((node, idx) => {
            currentPos[node.id] = {
                x: fixedX,
                y: startY + gap * (idx + 1) + (Math.random() * 20 - 10), 
                vy: 0
            };
        });
    });

    // Physics constants
    const kSpring = 0.08; 
    const kCenter = 0.03; // Slightly stronger centering
    const minSpacing = 80; // slightly increased spacing
    const ids = Object.keys(currentPos);

    // Physics Step Logic
    const runPhysicsStep = () => {
       // Spring forces
       links.forEach(link => {
        const u = currentPos[link.source];
        const v = currentPos[link.target];
        if (u && v) {
          const dy = v.y - u.y;
          const fy = dy * kSpring;
          u.vy += fy;
          v.vy -= fy;
        }
      });

      // Centering and Dampening
      ids.forEach(id => {
         const p = currentPos[id];
         p.vy += (height / 2 - p.y) * kCenter;
         p.vy *= 0.55; // Increased friction (was 0.6) for faster settling
         p.y += p.vy;
         
         const node = nodes.find(n => n.id === id);
         const targetPct = COLUMN_CONFIG[node?.type || ComponentType.SKILL];
         p.x = width * targetPct;
      });

      // Collision / Spacing
      const cols: Record<string, string[]> = {};
      ids.forEach(id => {
         const p = currentPos[id];
         const key = p.x.toFixed(0);
         if (!cols[key]) cols[key] = [];
         cols[key].push(id);
      });

      Object.values(cols).forEach(colNodes => {
          colNodes.sort((a, b) => currentPos[a].y - currentPos[b].y);
          
          for (let iter = 0; iter < 2; iter++) {
            for (let i = 0; i < colNodes.length - 1; i++) {
                const idA = colNodes[i];
                const idB = colNodes[i+1];
                const pA = currentPos[idA];
                const pB = currentPos[idB];
                
                const diff = pB.y - pA.y;
                if (diff < minSpacing) {
                    const overlap = minSpacing - diff;
                    const move = overlap / 2;
                    pA.y -= move;
                    pB.y += move;
                    pA.vy = 0;
                    pB.vy = 0;
                }
            }
            // Boundary constraints
            const topNode = currentPos[colNodes[0]];
            const bottomNode = currentPos[colNodes[colNodes.length - 1]];
            if (topNode.y < 60) topNode.y = 60;
            if (bottomNode.y > height - 60) bottomNode.y = height - 60;
          }
      });
    };

    // --- PRE-WARM SIMULATION ---
    // Run 100 iterations instantly before rendering to "skip" the messy adjustment phase
    for (let i = 0; i < 100; i++) {
        runPhysicsStep();
    }

    // Set initial settled positions
    setPositions(prev => {
        const next: Record<string, {x:number, y:number}> = {};
        ids.forEach(id => { next[id] = { x: currentPos[id].x, y: currentPos[id].y }; });
        return next;
    });

    let animationFrameId: number;
    let iterations = 0;
    
    // Continue fine-tuning with visual loop (short duration)
    const runSimulationLoop = () => {
      if (iterations > 60) return; // Reduced iterations since we pre-warmed
      iterations++;

      runPhysicsStep();

      setPositions(prev => {
        const next = { ...prev };
        ids.forEach(id => {
          next[id] = { x: currentPos[id].x, y: currentPos[id].y };
        });
        return next;
      });

      animationFrameId = requestAnimationFrame(runSimulationLoop);
    };

    runSimulationLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [width, height, nodes, links]);

  return positions;
};

// --- Main Component ---
export const SystemMap: React.FC<SystemMapProps> = ({ nodes, selectedId, onSelect, activeFlowStep }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const positions = useForceSimulation(nodes, LINKS, dimensions.width, dimensions.height);

  // Adjacency for highlighting
  const { downstream, upstream } = useMemo(() => {
    const d: Record<string, string[]> = {};
    const u: Record<string, string[]> = {};
    LINKS.forEach(l => {
      if (!d[l.source]) d[l.source] = [];
      d[l.source].push(l.target);
      if (!u[l.target]) u[l.target] = [];
      u[l.target].push(l.source);
    });
    return { downstream: d, upstream: u };
  }, []);

  const highlightedElements = useMemo(() => {
    const targetId = hoveredNodeId || selectedId;
    if (!targetId) return { nodes: new Set<string>(), links: new Set<string>() };

    const nodesSet = new Set<string>([targetId]);
    const linksSet = new Set<string>();
    
    // Downstream BFS
    const qDown = [targetId];
    const visitedDown = new Set<string>([targetId]);
    while (qDown.length) {
        const curr = qDown.shift()!;
        const targets = downstream[curr] || [];
        targets.forEach(t => {
            linksSet.add(`${curr}-${t}`);
            if (!visitedDown.has(t)) {
                visitedDown.add(t);
                nodesSet.add(t);
                qDown.push(t);
            }
        });
    }

    // Upstream BFS
    const qUp = [targetId];
    const visitedUp = new Set<string>([targetId]);
    while (qUp.length) {
        const curr = qUp.shift()!;
        const sources = upstream[curr] || [];
        sources.forEach(s => {
            linksSet.add(`${s}-${curr}`);
            if (!visitedUp.has(s)) {
                visitedUp.add(s);
                nodesSet.add(s);
                qUp.push(s);
            }
        });
    }

    return { nodes: nodesSet, links: linksSet };
  }, [hoveredNodeId, selectedId, downstream, upstream]);

  const isHighlighted = (nodeId: string) => {
    if ((hoveredNodeId || selectedId) && highlightedElements.nodes.has(nodeId)) return true;
    return false;
  };

  const isDimmed = (nodeId: string) => {
    // If a flow is running, dim everything not involved in the current step
    if (activeFlowStep) {
        return nodeId !== activeFlowStep.from && nodeId !== activeFlowStep.to;
    }
    // Normal interaction logic
    if (!hoveredNodeId && !selectedId) return false;
    return !isHighlighted(nodeId);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-slate-50 overflow-hidden"
    >
      {/* Visual Columns Background */}
      <div className="absolute inset-0 flex pointer-events-none">
          {COLUMN_LABELS.map((col, idx) => (
              <div 
                key={col.label} 
                className="absolute top-0 bottom-0 flex justify-center pt-6" 
                style={{ left: col.x, transform: 'translateX(-50%)', width: '20%' }}
              >
                 <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm">
                      {col.label}
                    </span>
                    <div className="w-px h-full bg-gradient-to-b from-slate-300 to-transparent opacity-50" />
                 </div>
              </div>
          ))}
      </div>

      {/* SVG Layer for Links */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {LINKS.map((link, i) => {
          const start = positions[link.source];
          const end = positions[link.target];
          if (!start || !end) return null;

          const isPathHighlighted = highlightedElements.links.has(`${link.source}-${link.target}`);
          
          // Check if this link is involved in the active step
          const isForward = activeFlowStep?.from === link.source && activeFlowStep?.to === link.target;
          const isReverse = activeFlowStep?.from === link.target && activeFlowStep?.to === link.source;
          const isFlowActive = isForward || isReverse;

          // Light mode: Darker strokes for visibility
          let stroke = '#cbd5e1'; // slate-300
          let width = 1;
          let opacity = 0.6; // Slightly more opacity on light bg

          if (isFlowActive) {
             stroke = '#6366f1'; // Indigo 500
             width = 3;
             opacity = 1;
          } else if (isPathHighlighted) {
             stroke = '#94a3b8'; // slate-400
             width = 2; 
             opacity = 1;
          } else if ((hoveredNodeId || selectedId) || activeFlowStep) {
             opacity = 0.1;
          }

          const dist = Math.abs(end.x - start.x);
          const cp1x = start.x + dist * 0.5;
          const cp2x = end.x - dist * 0.5;
          const pathD = `M ${start.x} ${start.y} C ${cp1x} ${start.y}, ${cp2x} ${end.y}, ${end.x} ${end.y}`;

          return (
            <React.Fragment key={`${link.source}-${link.target}`}>
                <motion.path
                d={pathD}
                stroke={stroke}
                strokeWidth={width}
                fill="none"
                initial={false}
                animate={{ 
                    d: pathD,
                    stroke, strokeWidth: width, opacity 
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
                
                {/* Flow Animation Particle */}
                <AnimatePresence>
                    {isFlowActive && (
                        <motion.circle
                            r={6}
                            fill="#6366f1" // Indigo 500
                            stroke="#ffffff" // White border for contrast
                            strokeWidth={2}
                            initial={{ offsetDistance: isReverse ? "100%" : "0%" }}
                            animate={{ offsetDistance: isReverse ? "0%" : "100%" }}
                            transition={{ 
                                duration: 1.5, 
                                ease: "easeInOut",
                                repeat: Infinity
                            }}
                            style={{ 
                                offsetPath: `path('${pathD}')`,
                            }}
                        />
                    )}
                </AnimatePresence>
            </React.Fragment>
          );
        })}
      </svg>

      {/* HTML Layer for Nodes (Solid White Pills) */}
      {nodes.map(node => {
        const pos = positions[node.id];
        if (!pos) return null;

        const Icon = Icons[node.iconName] || Activity;
        const highlighted = isHighlighted(node.id);
        const dimmed = isDimmed(node.id);
        const isMainAgent = node.type === ComponentType.MAIN_AGENT;
        
        // Active in flow logic
        const activeSource = activeFlowStep?.from === node.id;
        const activeTarget = activeFlowStep?.to === node.id;
        const isActiveInFlow = activeSource || activeTarget;

        // Solid White Background logic
        let bgColor = '#ffffff'; 
        let borderColor = highlighted || isActiveInFlow ? `var(--color-${node.color}-500)` : '#e2e8f0'; // slate-200 default
        let shadow = isActiveInFlow ? '0 0 20px rgba(99, 102, 241, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'; // shadow-md default

        if (highlighted) {
             borderColor = `rgba(var(--color-${node.color}-500), 1)`;
             shadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        }

        // Specifically override border for flow interaction to Indigo
        if (isActiveInFlow) {
          borderColor = '#6366f1'; 
        }

        return (
          <motion.div
            key={node.id}
            className={`
              absolute flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer
              ${(highlighted || isActiveInFlow) ? 'z-20' : 'z-10'}
              group
            `}
            // Explicitly force transforms in animate
            animate={{ 
              left: pos.x, 
              top: pos.y,
              translateX: "-50%", 
              translateY: "-50%",
              scale: isActiveInFlow ? 1.15 : 1,
              opacity: dimmed ? 0.3 : 1,
              backgroundColor: bgColor,
              borderColor: borderColor,
              boxShadow: shadow
            }}
            style={{ minWidth: '220px' }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
          >
            {/* Icon Container - colored background */}
            <div className={`p-1.5 rounded bg-${node.color}-100 text-${node.color}-600 shrink-0`}>
                <Icon size={18} className={isActiveInFlow ? 'animate-pulse' : ''} />
            </div>
            
            <div className="flex flex-col min-w-0 justify-center text-left">
                <span className={`text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-slate-900`}>
                  {node.label}
                </span>
                
                {node.contextFile && (
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500 font-mono">
                     <FileText size={10} />
                     <span className="truncate max-w-[140px]">{node.contextFile}</span>
                  </div>
                )}

                {/* Main Agent Action Button */}
                {isMainAgent && (
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold group-hover:bg-indigo-100 transition-colors">
                      <Play size={10} className="fill-current" />
                      RUN SCENARIOS
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
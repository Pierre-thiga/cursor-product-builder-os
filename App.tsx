import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { NODES, SCENARIOS, STATS } from './constants';
import { SystemMap } from './components/SystemMap';
import { InfoPanel } from './components/InfoPanel';
import { ScenarioSelector } from './components/ScenarioSelector';
import { TerminalPanel } from './components/TerminalPanel';
import { Terminal } from 'lucide-react';
import { ComponentType, InteractionFlow } from './types';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [activeFlow, setActiveFlow] = useState<InteractionFlow | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // Auto-play Scenario Logic
  useEffect(() => {
    let interval: number;

    if (activeFlow) {
      // Start flow if not started
      if (currentStepIndex === -1) {
        setCurrentStepIndex(0);
      } else if (currentStepIndex < activeFlow.steps.length) {
        // Advance step every 2.5 seconds
        interval = window.setInterval(() => {
          setCurrentStepIndex(prev => {
             const next = prev + 1;
             return next; 
          });
        }, 2500);
      }
    }

    return () => clearInterval(interval);
  }, [activeFlow, currentStepIndex]);

  // Handler for Node Selection
  const handleNodeSelect = (id: string) => {
    const node = NODES.find(n => n.id === id);
    if (!node) return;

    if (node.type === ComponentType.MAIN_AGENT) {
       // Special behavior for Main Agent node: Show Scenarios
       setShowScenarioSelector(true);
       setSelectedId(null); // Don't show standard info panel
    } else {
       setSelectedId(id);
       setShowScenarioSelector(false);
    }
  };

  const handleStartScenario = (flowId: string) => {
    const flow = SCENARIOS.find(s => s.id === flowId);
    if (flow) {
      setActiveFlow(flow);
      setCurrentStepIndex(-1); // Will trigger effect to start at 0
      setShowScenarioSelector(false);
      setSelectedId(null);
    }
  };

  const handleCloseTerminal = () => {
    setActiveFlow(null);
    setCurrentStepIndex(-1);
  };

  const selectedNode = selectedId ? NODES.find(n => n.id === selectedId) || null : null;
  const activeStep = activeFlow && currentStepIndex >= 0 && currentStepIndex < activeFlow.steps.length 
    ? activeFlow.steps[currentStepIndex] 
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-40 relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Terminal size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Cursor Operating Model</h1>
              <p className="text-xs text-slate-500">Full-Stack Product Builder OS</p>
            </div>
          </div>

          {/* Stats Section in Header */}
          <div className="hidden md:flex items-center gap-6 ml-6 pl-6 border-l border-slate-200 h-8">
            {STATS.map((stat) => (
              <div key={stat.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.fill }} />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.name}</span>
                <span className="text-sm font-bold text-slate-800">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 shadow-sm">
             <div className={`w-2 h-2 rounded-full ${activeFlow ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
             <span className="text-xs text-slate-600 font-medium">
               {activeFlow ? 'Simulation Running' : 'System Idle'}
             </span>
           </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left: Architecture Map (Full Graph) */}
        <main className="flex-1 bg-slate-50 relative">
          <SystemMap 
            nodes={NODES} 
            selectedId={selectedId} 
            onSelect={handleNodeSelect}
            activeFlowStep={activeStep}
          />
        </main>

        {/* Slide-over Detail Panel */}
        <AnimatePresence>
          {selectedId && (
            <InfoPanel 
              node={selectedNode} 
              onClose={() => setSelectedId(null)} 
            />
          )}
        </AnimatePresence>

        {/* Scenario Selector Modal */}
        <AnimatePresence>
          {showScenarioSelector && (
            <ScenarioSelector 
              scenarios={SCENARIOS}
              onSelect={handleStartScenario}
              onClose={() => setShowScenarioSelector(false)}
            />
          )}
        </AnimatePresence>

        {/* Bottom Terminal Panel */}
        <AnimatePresence>
          {activeFlow && (
            <TerminalPanel 
              flow={activeFlow}
              currentStepIndex={currentStepIndex}
              onClose={handleCloseTerminal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
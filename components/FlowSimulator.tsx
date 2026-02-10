import React from 'react';
import { Play, RotateCw } from 'lucide-react';
import { InteractionFlow } from '../types';

interface FlowSimulatorProps {
  flows: InteractionFlow[];
  activeFlowId: string | null;
  onStartFlow: (id: string) => void;
  onStopFlow: () => void;
  currentStepIndex: number;
}

export const FlowSimulator: React.FC<FlowSimulatorProps> = ({ 
  flows, 
  activeFlowId, 
  onStartFlow, 
  onStopFlow,
  currentStepIndex 
}) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Simulate Workflows</h3>
      <div className="space-y-3">
        {flows.map((flow) => {
          const isRunning = activeFlowId === flow.id;
          
          return (
            <div 
              key={flow.id} 
              className={`
                group rounded-lg p-4 border transition-all duration-300
                ${isRunning 
                  ? 'bg-indigo-900/30 border-indigo-500 ring-1 ring-indigo-500' 
                  : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'}
              `}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${isRunning ? 'text-indigo-300' : 'text-slate-200'}`}>
                  {flow.title}
                </span>
                <button
                  onClick={() => isRunning ? onStopFlow() : onStartFlow(flow.id)}
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full transition-colors
                    ${isRunning 
                      ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' 
                      : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}
                  `}
                >
                  {isRunning ? <RotateCw size={14} className="animate-spin" /> : <Play size={14} />}
                </button>
              </div>
              
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {flow.description}
              </p>

              {isRunning && (
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStepIndex + 1) / flow.steps.length) * 100}%` }}
                  />
                </div>
              )}
              
              {isRunning && (
                 <div className="mt-2 text-xs font-mono text-indigo-300 animate-pulse">
                   Step {currentStepIndex + 1}: {flow.steps[currentStepIndex]?.label}
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
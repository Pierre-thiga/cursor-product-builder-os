import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Activity, Square, Terminal as TerminalIcon } from 'lucide-react';
import { InteractionFlow } from '../types';

interface TerminalPanelProps {
  flow: InteractionFlow;
  currentStepIndex: number;
  onClose: () => void;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({ flow, currentStepIndex, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentStepIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-6 w-[420px] max-h-[450px] z-30 flex flex-col font-mono bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
    >
      {/* Header of the Terminal Card */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 rounded text-indigo-600">
               <TerminalIcon size={12} />
            </div>
            <div>
               <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Live Execution</span>
               <span className="text-[10px] text-slate-500 block">Orchestrator Logs</span>
            </div>
        </div>
        <button 
            onClick={onClose}
            className="text-[10px] font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded transition-colors flex items-center gap-1.5"
        >
            <Square size={8} className="fill-current" />
            ABORT
        </button>
      </div>

      {/* Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-white scroll-smooth">
          {/* Simulation Start Marker */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold border-b border-slate-100 pb-3 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SCENARIO RUNNING: <span className="text-indigo-600 uppercase tracking-widest">{flow.title}</span>
          </div>

          <AnimatePresence mode='popLayout'>
            {flow.steps.map((step, idx) => {
              if (idx > currentStepIndex) return null;
              
              const isCurrent = idx === currentStepIndex;

              return (
                <motion.div 
                  key={idx}
                  layout 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`relative flex gap-3 text-xs leading-relaxed group ${isCurrent ? 'opacity-100' : 'opacity-60 grayscale'}`}
                >
                   {/* Connector Line */}
                   {idx < flow.steps.length - 1 && (
                     <div className="absolute left-[5px] top-4 bottom-[-16px] w-px bg-slate-200 group-last:hidden" />
                   )}
                   
                   <span className="relative z-10 shrink-0 pt-1">
                     {isCurrent ? (
                       <Activity size={12} className="text-indigo-600 animate-pulse" />
                     ) : (
                       <div className="w-3 h-3 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <ChevronRight size={8} className="text-slate-400" />
                       </div>
                     )}
                   </span>
                   
                   <div className="flex-1 bg-slate-50/50 rounded p-2 border border-slate-100/50">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-bold uppercase tracking-tight ${isCurrent ? 'text-indigo-700' : 'text-slate-600'}`}>
                           {step.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono text-slate-400">
                           <span className="bg-white border border-slate-200 px-1 rounded">{step.from}</span>
                           <span>→</span>
                           <span className="bg-white border border-slate-200 px-1 rounded">{step.to}</span>
                      </div>
                      <p className="text-slate-700">
                        {step.description}
                      </p>
                   </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
           {/* Completion Message */}
           {currentStepIndex >= flow.steps.length && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center shadow-sm"
            >
                <div className="flex flex-col items-center gap-1">
                    <div className="p-1 bg-emerald-100 rounded-full text-emerald-600 mb-1">
                        <CheckmarkIcon />
                    </div>
                    <span className="text-emerald-800 text-[10px] font-bold tracking-widest uppercase">
                        Process Completed Successfully
                    </span>
                </div>
            </motion.div>
          )}
      </div>
    </motion.div>
  );
};

const CheckmarkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
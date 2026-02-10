import React from 'react';
import { motion } from 'framer-motion';
import { X, PlayCircle, Layers } from 'lucide-react';
import { InteractionFlow } from '../types';

interface ScenarioSelectorProps {
  scenarios: InteractionFlow[];
  onSelect: (flowId: string) => void;
  onClose: () => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ scenarios, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
                <Layers className="text-indigo-600" size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-900">Select Scenario</h2>
                <p className="text-sm text-slate-500">Choose a workflow to simulate</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-3 bg-white">
          {scenarios.map((flow) => (
            <button
              key={flow.id}
              onClick={() => onSelect(flow.id)}
              className="w-full text-left group relative flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 shadow-sm hover:shadow"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <PlayCircle size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">
                  {flow.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {flow.description}
                </p>
              </div>
              <div className="ml-auto text-xs font-mono text-slate-400 group-hover:text-indigo-600">
                {flow.steps.length} steps
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
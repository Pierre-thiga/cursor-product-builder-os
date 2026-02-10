import React from 'react';
import { motion } from 'framer-motion';
import { X, Cpu, Shield, ExternalLink, Wrench } from 'lucide-react';
import { NodeData, ComponentType } from '../types';

interface InfoPanelProps {
  node: NodeData | null;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white/95 border-l border-slate-200 backdrop-blur-xl shadow-2xl z-50 p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
           <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${node.color}-100 text-${node.color}-700 border border-${node.color}-200 mb-2`}>
             {node.type}
           </div>
           <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{node.label}</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-slate-700 leading-relaxed">
            {node.description}
          </p>
        </section>

        {node.details && (
          <>
             {node.details.mission && (
              <section className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-indigo-600">
                  <Cpu size={16} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Mission</h3>
                </div>
                <p className="text-sm text-slate-700">
                  {node.details.mission}
                </p>
              </section>
            )}

            {node.details.skillsUsed && node.details.skillsUsed.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 text-emerald-600">
                  <Wrench size={16} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {node.details.skillsUsed.map(skill => (
                    <span key={skill} className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-mono text-emerald-700 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {node.details.mcpUsed && node.details.mcpUsed.length > 0 && (
              <section>
                 <div className="flex items-center gap-2 mb-3 text-amber-600">
                  <ExternalLink size={16} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">MCP Servers</h3>
                </div>
                 <div className="flex flex-wrap gap-2">
                  {node.details.mcpUsed.map(mcp => (
                    <span key={mcp} className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-mono text-amber-700 shadow-sm">
                      {mcp}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {node.details.special && (
              <section className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                <div className="flex items-center gap-2 mb-2 text-rose-600">
                  <Shield size={16} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Safety & Constraints</h3>
                </div>
                <p className="text-sm text-rose-700 italic">
                  {node.details.special}
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { X, Cpu, Shield, ExternalLink, Wrench, FileText } from 'lucide-react';
import { NodeData, ComponentType } from '../types';
import { NODES } from '../constants';

interface InfoPanelProps {
  node: NodeData | null;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ node, onClose }) => {
  if (!node) return null;

  // Resolve skills from IDs if they exist
  const resolvedSkills = node.skills?.map(skillId =>
    NODES.find(n => n.id === skillId)
  ).filter(Boolean);

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

        {/* Context Files Section */}
        {node.contextFiles && node.contextFiles.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-600">
              <FileText size={16} />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Context Files</h3>
            </div>
            <ul className="space-y-2">
              {node.contextFiles.map((file, idx) => (
                <li key={idx} className="bg-slate-50 px-3 py-2 rounded border border-slate-200 text-xs font-mono text-slate-600 break-all">
                  {file}
                </li>
              ))}
            </ul>
          </section>
        )}

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

        {/* Skills Section */}
        {resolvedSkills && resolvedSkills.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-emerald-600">
              <Wrench size={16} />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Skills</h3>
            </div>
            <div className="flex flex-col gap-3">
              {resolvedSkills.map((skill: any) => (
                <div key={skill.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 text-sm">{skill.label}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono border border-emerald-200">
                      {skill.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};
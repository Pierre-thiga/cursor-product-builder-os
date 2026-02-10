import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STATS } from '../constants';

export const StatsDashboard: React.FC = () => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">System Composition</h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={STATS} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              width={80}
            />
            <Tooltip 
              cursor={{fill: '#334155', opacity: 0.4}}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {STATS.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {STATS.map((stat, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-700 pb-1">
             <span className="text-xs text-slate-400">{stat.name}</span>
             <span className="text-sm font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
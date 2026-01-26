
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface InvestmentCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  stats?: {
    label: string;
    value: string;
  }[];
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({ 
  title, 
  description, 
  icon: Icon,
  to,
  stats
}) => {
  return (
    <Link to={to} className="group block">
      <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
        
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90"></div>
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                    <Icon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{title}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-2 rounded-lg bg-slate-700/30 border border-slate-600/30 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ArrowUpRight className="h-4 w-4 text-blue-400" />
            </div>
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
                  <div className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hover indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
      </div>
    </Link>
  );
};

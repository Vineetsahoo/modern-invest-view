import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

// Sample data - replace with real data
const assetAllocation = [
  { name: 'Stocks', value: 45, color: '#3b82f6' },
  { name: 'Mutual Funds', value: 25, color: '#10b981' },
  { name: 'Bonds', value: 15, color: '#f59e0b' },
  { name: 'Real Estate', value: 10, color: '#8b5cf6' },
  { name: 'Cash', value: 5, color: '#6b7280' },
];

const performanceData = [
  { month: 'Jan', value: 100000, benchmark: 100000 },
  { month: 'Feb', value: 105000, benchmark: 102000 },
  { month: 'Mar', value: 108000, benchmark: 104000 },
  { month: 'Apr', value: 112000, benchmark: 106000 },
  { month: 'May', value: 115000, benchmark: 108000 },
  { month: 'Jun', value: 120000, benchmark: 110000 },
];

export const PortfolioAnalytics: React.FC = () => {
  const totalValue = 120000;
  const totalGain = 20000;
  const gainPercent = ((totalGain / (totalValue - totalGain)) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6 backdrop-blur-sm">
            <div className="mb-4">
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total Portfolio Value</p>
            </div>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl bg-white/10 mr-3">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white">${totalValue.toLocaleString()}</h3>
            </div>
            <div className="flex items-center text-blue-50">
              <div className="p-1.5 rounded-lg bg-white/10 mr-2">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">+12.5% this month</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6 backdrop-blur-sm">
            <div className="mb-4">
              <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Total Gain/Loss</p>
            </div>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl bg-white/10 mr-3">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white">${totalGain.toLocaleString()}</h3>
            </div>
            <div className="flex items-center text-green-50">
              <div className="p-1.5 rounded-lg bg-white/10 mr-2">
                <Percent className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">+{gainPercent}% return</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6 backdrop-blur-sm">
            <div className="mb-4">
              <p className="text-purple-100 text-sm font-medium uppercase tracking-wider">Daily Change</p>
            </div>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl bg-white/10 mr-3">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white">+$1,250</h3>
            </div>
            <div className="flex items-center text-purple-50">
              <div className="p-1.5 rounded-lg bg-white/10 mr-2">
                <Percent className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">+1.04% today</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Asset Allocation</h3>
            <p className="text-gray-400 text-sm mt-1">Portfolio diversification across asset classes</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Performance Trend</h3>
            <p className="text-gray-400 text-sm mt-1">Portfolio value vs benchmark over time</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" name="Portfolio" />
                <Area type="monotone" dataKey="benchmark" stroke="#6b7280" strokeWidth={2} fillOpacity={1} fill="url(#colorBenchmark)" name="Benchmark" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

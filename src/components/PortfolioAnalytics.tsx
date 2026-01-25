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
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-100">Total Portfolio Value</CardDescription>
            <CardTitle className="text-3xl text-white flex items-center">
              <DollarSign className="h-8 w-8 mr-2" />
              ${totalValue.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-blue-100">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+12.5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-100">Total Gain/Loss</CardDescription>
            <CardTitle className="text-3xl text-white flex items-center">
              <TrendingUp className="h-8 w-8 mr-2" />
              ${totalGain.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-green-100">
              <Percent className="h-4 w-4 mr-1" />
              <span className="text-sm">+{gainPercent}% return</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-100">Daily Change</CardDescription>
            <CardTitle className="text-3xl text-white flex items-center">
              <TrendingUp className="h-8 w-8 mr-2" />
              +$1,250
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-purple-100">
              <Percent className="h-4 w-4 mr-1" />
              <span className="text-sm">+1.04% today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Portfolio diversification across asset classes</CardDescription>
          </CardHeader>
          <CardContent>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Portfolio value vs benchmark over time</CardDescription>
          </CardHeader>
          <CardContent>
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" name="Portfolio" />
                  <Area type="monotone" dataKey="benchmark" stroke="#6b7280" fillOpacity={1} fill="url(#colorBenchmark)" name="Benchmark" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

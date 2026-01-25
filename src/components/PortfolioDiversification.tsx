import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const sectorData = [
  { name: 'Technology', value: 35, color: '#3b82f6' },
  { name: 'Healthcare', value: 20, color: '#10b981' },
  { name: 'Finance', value: 18, color: '#f59e0b' },
  { name: 'Consumer', value: 15, color: '#8b5cf6' },
  { name: 'Energy', value: 12, color: '#ef4444' },
];

const riskData = [
  { name: 'Low Risk', value: 30, color: '#10b981' },
  { name: 'Medium Risk', value: 50, color: '#f59e0b' },
  { name: 'High Risk', value: 20, color: '#ef4444' },
];

const assetTypeData = [
  { type: 'Stocks', allocation: 45, target: 50 },
  { type: 'Bonds', allocation: 20, target: 25 },
  { type: 'Real Estate', allocation: 15, target: 15 },
  { type: 'Cash', allocation: 10, target: 5 },
  { type: 'Commodities', allocation: 10, target: 5 },
];

export const PortfolioDiversification: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Diversification Overview</CardTitle>
          <CardDescription>Analysis of your investment distribution across sectors, risk levels, and asset types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sector Allocation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {sectorData.map((sector) => (
                  <div key={sector.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                      <span className="text-sm">{sector.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{sector.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Risk Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {riskData.map((risk) => (
                  <div key={risk.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: risk.color }} />
                      <span className="text-sm">{risk.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{risk.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Type Allocation vs Target</CardTitle>
          <CardDescription>How your current allocation compares to your target portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocation" fill="#3b82f6" name="Current Allocation %" />
                  <Bar dataKey="target" fill="#10b981" name="Target Allocation %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {assetTypeData.map((asset) => {
                const difference = asset.allocation - asset.target;
                const isOverAllocated = difference > 0;
                return (
                  <div key={asset.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{asset.type}</span>
                      <span className="text-sm text-muted-foreground">
                        {asset.allocation}% / {asset.target}% target
                        {difference !== 0 && (
                          <span className={`ml-2 ${isOverAllocated ? 'text-orange-500' : 'text-blue-500'}`}>
                            ({isOverAllocated ? '+' : ''}{difference}%)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Progress value={asset.allocation} className="flex-1" />
                      <Progress value={asset.target} className="flex-1 opacity-50" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

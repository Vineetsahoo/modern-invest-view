import React from 'react';
import { Navbar } from '@/components/Navbar';
import { InvestmentStats } from '@/components/InvestmentStats';
import { Watchlist } from '@/components/Watchlist';
import { TransactionsHistory } from '@/components/TransactionsHistory';
import { AddInvestment } from '@/components/AddInvestment';
import { AlertsPanel } from '@/components/AlertsPanel';
import { useInvestmentData } from '@/hooks/useInvestmentData';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { AssetAllocation } from '@/components/dashboard/AssetAllocation';
import { PositionsTable } from '@/components/dashboard/PositionsTable';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';

const Dashboard = () => {
  const { loading, investmentStats, portfolioId, portfolioStats, refresh, refreshToken } = useInvestmentData();

  const handleInvestmentAdded = () => {
    refresh();
  };

  const allocationData = Object.entries(portfolioStats?.byAssetType || {}).map(([key, bucket]: [string, any], i) => ({
    name: key,
    value: bucket.currentValue,
    percentage: portfolioStats?.totals?.currentValue ? (bucket.currentValue / portfolioStats.totals.currentValue) * 100 : 0,
    color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316'][i % 8],
    change: bucket.invested ? ((bucket.currentValue - bucket.invested) / bucket.invested) * 100 : 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Portfolio Overview</p>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {portfolioStats?.portfolio?.name || 'My Portfolio'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">Base currency: {portfolioStats?.portfolio?.baseCurrency || 'INR'}</p>
          </div>
          <AddInvestment onSuccess={handleInvestmentAdded} portfolioId={portfolioId} />
        </div>

        <SummaryCards totals={{
          invested: portfolioStats?.totals?.invested,
          currentValue: portfolioStats?.totals?.currentValue,
          unrealizedPnl: portfolioStats?.totals?.unrealizedPnl,
          realizedPnl: portfolioStats?.totals?.realizedPnl,
          income: portfolioStats?.totals?.income,
          fees: portfolioStats?.totals?.fees,
          cashBalance: portfolioStats?.portfolio?.cashBalance
        }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DonutChart 
            data={allocationData} 
            centerValue={`₹${((portfolioStats?.totals?.currentValue || 0) / 100000).toFixed(1)}L`}
            centerLabel="Total Value"
          />
          <PerformanceChart portfolioId={portfolioId} title="6-Month Performance" />
        </div>

        <InvestmentStats stats={investmentStats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PositionsTable positions={portfolioStats?.positions || []} />
            <TransactionsHistory portfolioId={portfolioId} refreshToken={refreshToken} />
          </div>
          <div className="space-y-6">
            <AssetAllocation byAssetType={portfolioStats?.byAssetType || {}} totalValue={portfolioStats?.totals?.currentValue || 0} />
            <AlertsPanel />
            <Watchlist />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

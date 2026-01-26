
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { InvestmentStats } from '@/components/InvestmentStats';
import { Watchlist } from '@/components/Watchlist';
import { TransactionsHistory } from '@/components/TransactionsHistory';
import { AddInvestment } from '@/components/AddInvestment';
import { useInvestmentData } from '@/hooks/useInvestmentData';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { AssetAllocation } from '@/components/dashboard/AssetAllocation';
import { PositionsTable } from '@/components/dashboard/PositionsTable';

const Dashboard = () => {
  const { loading, investmentStats, portfolioId, portfolioStats, refresh, refreshToken } = useInvestmentData();

  const handleInvestmentAdded = () => {
    refresh();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Portfolio Overview</p>
            <h1 className="text-3xl font-semibold">{portfolioStats?.portfolio?.name || 'My Portfolio'}</h1>
            <p className="text-slate-400 text-sm">Base currency: {portfolioStats?.portfolio?.baseCurrency || 'INR'}</p>
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

        <InvestmentStats stats={investmentStats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PositionsTable positions={portfolioStats?.positions || []} />
            <TransactionsHistory portfolioId={portfolioId} refreshToken={refreshToken} />
          </div>
          <div className="space-y-6">
            <AssetAllocation byAssetType={portfolioStats?.byAssetType || {}} totalValue={portfolioStats?.totals?.currentValue || 0} />
            <Watchlist />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

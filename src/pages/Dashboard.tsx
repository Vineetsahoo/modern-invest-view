
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { InvestmentGrid } from '@/components/InvestmentGrid';
import { InvestmentStats } from '@/components/InvestmentStats';
import { InvestmentsByCustomer } from '@/components/InvestmentsByCustomer';
import { PortfolioAnalytics } from '@/components/PortfolioAnalytics';
import { PortfolioDiversification } from '@/components/PortfolioDiversification';
import { MarketOverview } from '@/components/MarketOverview';
import { Watchlist } from '@/components/Watchlist';
import { TransactionsHistory } from '@/components/TransactionsHistory';
import { useInvestmentData } from '@/hooks/useInvestmentData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { loading, investmentStats } = useInvestmentData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-banking-darkBg via-banking-darkGray to-banking-darkBg pb-20">
      <Navbar />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Investment Dashboard
          </h1>
          <p className="text-banking-silver">Comprehensive portfolio management and analytics</p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <InvestmentStats stats={investmentStats} loading={loading} />
            {!loading && <InvestmentGrid stats={investmentStats} />}
            <InvestmentsByCustomer />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <PortfolioAnalytics />
            <PortfolioDiversification />
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <MarketOverview />
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            <Watchlist />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

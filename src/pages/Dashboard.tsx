
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
import { AddInvestment } from '@/components/AddInvestment';
import { useInvestmentData } from '@/hooks/useInvestmentData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { loading, investmentStats } = useInvestmentData();
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleInvestmentAdded = () => {
    // Trigger a refresh of investment data
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-banking-darkBg via-banking-darkGray to-banking-darkBg pb-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <Navbar />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="mb-8 animate-slideIn">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Investment Dashboard
              </h1>
              <p className="text-gray-400 text-lg">Comprehensive portfolio management and analytics</p>
            </div>
            <AddInvestment onSuccess={handleInvestmentAdded} />
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-card grid w-full grid-cols-5 lg:w-auto lg:inline-grid p-1.5 gap-1">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="market"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              Market
            </TabsTrigger>
            <TabsTrigger 
              value="watchlist"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              Watchlist
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-slideIn">
            <InvestmentStats stats={investmentStats} loading={loading} />
            {!loading && <InvestmentGrid stats={investmentStats} />}
            <InvestmentsByCustomer />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-slideIn">
            <PortfolioAnalytics />
            <PortfolioDiversification />
          </TabsContent>

          <TabsContent value="market" className="space-y-6 animate-slideIn">
            <MarketOverview />
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6 animate-slideIn">
            <Watchlist />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6 animate-slideIn">
            <TransactionsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const marketIndices = [
  { name: 'S&P 500', value: '4,783.45', change: '+32.18', changePercent: '+0.68%', positive: true },
  { name: 'NASDAQ', value: '15,095.14', change: '+78.56', changePercent: '+0.52%', positive: true },
  { name: 'DOW JONES', value: '37,305.16', change: '-45.23', changePercent: '-0.12%', positive: false },
  { name: 'RUSSELL 2000', value: '2,027.07', change: '+12.34', changePercent: '+0.61%', positive: true },
];

const topMovers = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$185.92', change: '+3.45%', positive: true },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$378.91', change: '+2.18%', positive: true },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$141.80', change: '+1.92%', positive: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.42', change: '-2.34%', positive: false },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$495.22', change: '+4.67%', positive: true },
];

const newsItems = [
  {
    title: 'Fed Signals Potential Rate Cut in 2024',
    source: 'Financial Times',
    time: '2 hours ago',
  },
  {
    title: 'Tech Stocks Rally on Strong Earnings',
    source: 'Bloomberg',
    time: '4 hours ago',
  },
  {
    title: 'Oil Prices Surge on Supply Concerns',
    source: 'Reuters',
    time: '6 hours ago',
  },
];

export const MarketOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Market Indices
          </CardTitle>
          <CardDescription>Real-time major market index performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketIndices.map((index) => (
              <div key={index.name} className="p-4 rounded-lg border bg-card">
                <div className="text-sm text-muted-foreground mb-1">{index.name}</div>
                <div className="text-2xl font-bold mb-2">{index.value}</div>
                <div className={`flex items-center text-sm ${index.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {index.positive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  <span>{index.change} ({index.changePercent})</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Movers</CardTitle>
            <CardDescription>Stocks with significant movement today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{stock.price}</div>
                    <div className={`text-sm ${stock.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market News</CardTitle>
            <CardDescription>Latest financial news and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newsItems.map((news, index) => (
                <div key={index} className="p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="font-semibold mb-1">{news.title}</div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{news.source}</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

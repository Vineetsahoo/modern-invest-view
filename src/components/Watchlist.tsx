import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Star, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

const mockWatchlist: WatchlistItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 3.45, changePercent: 1.89, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 2.18, changePercent: 0.58, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 151.94, change: -1.23, changePercent: -0.80, sector: 'Consumer Cyclical' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 1.92, changePercent: 1.37, sector: 'Communication' },
];

export const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(mockWatchlist);
  const [searchSymbol, setSearchSymbol] = useState('');

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Watchlist
            </CardTitle>
            <CardDescription>Track stocks you're interested in</CardDescription>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter symbol..."
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="w-40"
            />
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {watchlist.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-semibold text-lg">{item.symbol}</div>
                    <div className="text-sm text-muted-foreground">{item.name}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">{item.sector}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold text-lg">${item.price.toFixed(2)}</div>
                  <div className={`flex items-center text-sm ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    <span>{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromWatchlist(item.symbol)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

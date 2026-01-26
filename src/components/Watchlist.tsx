import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Star, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { watchlistAPI, quotesAPI } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface WatchlistItem {
  _id?: string;
  symbol: string;
  note?: string;
  targetPrice?: number;
  stopPrice?: number;
  price?: number;
  change?: number;
  changePercent?: number;
  currency?: string;
}

export const Watchlist: React.FC = () => {
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [loading, setLoading] = useState(false);

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const items = await watchlistAPI.list();
      setWatchlist(items || []);

      if (items?.length) {
        const symbols = items.map((i: any) => i.symbol);
        const quotes = await quotesAPI.get(symbols);
        const quoteMap = quotes.reduce((acc: any, q: any) => {
          acc[q.symbol] = q;
          return acc;
        }, {});
        setWatchlist((prev) => prev.map((i) => ({
          ...i,
          price: quoteMap[i.symbol]?.price,
          change: 0,
          changePercent: 0
        })));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Could not load watchlist",
        description: error?.response?.data?.message || 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const addSymbol = async () => {
    if (!searchSymbol.trim()) return;
    try {
      const item = await watchlistAPI.add({ symbol: searchSymbol.trim().toUpperCase() });
      setWatchlist((prev) => {
        const filtered = prev.filter((p) => p.symbol !== item.symbol);
        return [item, ...filtered];
      });
      setSearchSymbol('');
      loadWatchlist();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Could not add symbol",
        description: error?.response?.data?.message || 'Please try again.'
      });
    }
  };

  const removeFromWatchlist = async (id?: string, symbol?: string) => {
    try {
      if (id) {
        await watchlistAPI.remove(id);
      }
      setWatchlist((prev) => prev.filter((item) => (id ? item._id !== id : item.symbol !== symbol)));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Could not remove symbol",
        description: error?.response?.data?.message || 'Please try again.'
      });
    }
  };

  return (
    <Card className="bg-slate-900/70 border border-slate-800/70">
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
            <Button size="sm" onClick={addSymbol} disabled={!searchSymbol.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(loading && !watchlist.length) && (
            <div className="text-sm text-muted-foreground">Loading watchlist…</div>
          )}
          {watchlist.map((item) => (
            <div
              key={item._id || item.symbol}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-semibold text-lg">{item.symbol}</div>
                    <div className="text-sm text-muted-foreground">{item.note || '—'}</div>
                  </div>
                  {item.targetPrice ? <Badge variant="secondary" className="text-xs">Target ₹{item.targetPrice}</Badge> : null}
                  {item.stopPrice ? <Badge variant="secondary" className="text-xs">Stop ₹{item.stopPrice}</Badge> : null}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold text-lg">{item.price ? `₹${item.price.toFixed(2)}` : '—'}</div>
                  {item.change !== undefined && item.changePercent !== undefined ? (
                    <div className={`flex items-center text-sm ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      <span>{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)</span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">Price TBD</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromWatchlist(item._id, item.symbol)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {!loading && watchlist.length === 0 && (
            <div className="text-sm text-muted-foreground">No symbols in watchlist yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

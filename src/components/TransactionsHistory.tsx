import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Calendar, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { portfolioAPI } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface Transaction {
  _id: string;
  tradeDate: string;
  type: string;
  symbol: string;
  qty: number;
  price: number;
  fees?: number;
}

export const TransactionsHistory: React.FC<{ portfolioId?: string | null; refreshToken?: number }> = ({ portfolioId, refreshToken }) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTxns = async () => {
      if (!portfolioId) return;
      setLoading(true);
      try {
        const data = await portfolioAPI.listTransactions(portfolioId);
        setTransactions(data || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Could not load transactions",
          description: error?.response?.data?.message || 'Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTxns();
  }, [portfolioId, refreshToken, toast]);

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         txn._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'sell': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'dividend': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const totalValue = (txn: Transaction) => (txn.qty || 0) * (txn.price || 0) - (txn.fees || 0);

  return (
    <Card className="bg-slate-900/70 border border-slate-800/70">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Complete record of all your portfolio transactions</CardDescription>
          </div>
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by symbol or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
              <SelectItem value="dividend">Dividend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent">
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn._id}>
                  <TableCell className="font-medium">{txn._id.slice(-6)}</TableCell>
                  <TableCell>{new Date(txn.tradeDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(txn.type.toLowerCase())}>
                      {txn.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{txn.symbol}</TableCell>
                  <TableCell className="text-right">{txn.qty || '-'}</TableCell>
                  <TableCell className="text-right">₹{(txn.price || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">₹{totalValue(txn).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {(filteredTransactions.length === 0 || loading) && (
          <div className="text-center py-8 text-muted-foreground">
            {loading ? 'Loading transactions…' : 'No transactions found'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

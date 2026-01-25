import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Calendar, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'dividend';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
}

const mockTransactions: Transaction[] = [
  { id: 'TXN001', date: '2026-01-24', type: 'buy', symbol: 'AAPL', quantity: 10, price: 185.92, total: 1859.20, status: 'completed' },
  { id: 'TXN002', date: '2026-01-23', type: 'sell', symbol: 'MSFT', quantity: 5, price: 378.91, total: 1894.55, status: 'completed' },
  { id: 'TXN003', date: '2026-01-22', type: 'dividend', symbol: 'GOOGL', quantity: 0, price: 0, total: 125.00, status: 'completed' },
  { id: 'TXN004', date: '2026-01-20', type: 'buy', symbol: 'TSLA', quantity: 8, price: 248.42, total: 1987.36, status: 'completed' },
  { id: 'TXN005', date: '2026-01-19', type: 'buy', symbol: 'NVDA', quantity: 3, price: 495.22, total: 1485.66, status: 'pending' },
  { id: 'TXN006', date: '2026-01-18', type: 'sell', symbol: 'AMZN', quantity: 12, price: 151.94, total: 1823.28, status: 'completed' },
];

export const TransactionsHistory: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'sell': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'dividend': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Complete record of all your portfolio transactions</CardDescription>
          </div>
          <Button variant="outline" size="sm">
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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.id}</TableCell>
                  <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(txn.type)}>
                      {txn.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{txn.symbol}</TableCell>
                  <TableCell className="text-right">{txn.quantity || '-'}</TableCell>
                  <TableCell className="text-right">${txn.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">${txn.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(txn.status)}>
                      {txn.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};

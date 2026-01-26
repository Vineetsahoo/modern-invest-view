import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp } from 'lucide-react';

interface Position {
  symbol: string;
  assetType: string;
  qty: number;
  avgCost: number;
  currentPrice?: number;
  currentValue?: number;
  unrealizedPnl?: number;
  realizedPnl?: number;
  income?: number;
}

const fmt = (n?: number) => `₹${(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export const PositionsTable: React.FC<{ positions: Position[] }> = ({ positions }) => {
  if (!positions?.length) return null;

  return (
    <Card className="bg-slate-900/70 border border-slate-800/70">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-slate-100">Open Positions</CardTitle>
          <p className="text-sm text-slate-400">Holdings with live P/L</p>
        </div>
        <TrendingUp className="h-6 w-6 text-slate-300" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-800/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Unrealized</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((p) => (
                <TableRow key={p.symbol}>
                  <TableCell className="font-semibold text-slate-100">{p.symbol}</TableCell>
                  <TableCell className="text-slate-300">{p.assetType}</TableCell>
                  <TableCell className="text-right text-slate-200">{p.qty}</TableCell>
                  <TableCell className="text-right text-slate-200">{fmt(p.avgCost)}</TableCell>
                  <TableCell className="text-right text-slate-200">{fmt(p.currentPrice)}</TableCell>
                  <TableCell className="text-right text-slate-200">{fmt(p.currentValue)}</TableCell>
                  <TableCell className={`text-right ${p.unrealizedPnl && p.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {fmt(p.unrealizedPnl)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

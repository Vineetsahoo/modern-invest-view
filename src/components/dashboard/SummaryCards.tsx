import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Wallet, LineChart, Banknote, PiggyBank } from 'lucide-react';

interface Totals {
  invested?: number;
  currentValue?: number;
  unrealizedPnl?: number;
  realizedPnl?: number;
  income?: number;
  fees?: number;
  cashBalance?: number;
}

const currency = (n: number | undefined) => `₹${(n || 0).toLocaleString()}`;

export const SummaryCards: React.FC<{ totals: Totals }> = ({ totals }) => {
  const cards = [
    {
      title: 'Current Value',
      value: currency(totals.currentValue),
      hint: `Invested ${currency(totals.invested)}`,
      icon: LineChart,
      tone: 'from-blue-500/80 to-cyan-500/80'
    },
    {
      title: 'Unrealized P/L',
      value: currency(totals.unrealizedPnl),
      hint: totals.unrealizedPnl && totals.unrealizedPnl >= 0 ? 'Gains' : 'Losses',
      icon: totals.unrealizedPnl && totals.unrealizedPnl >= 0 ? ArrowUpRight : ArrowDownRight,
      tone: totals.unrealizedPnl && totals.unrealizedPnl >= 0 ? 'from-emerald-500/80 to-green-500/80' : 'from-rose-500/80 to-red-500/80'
    },
    {
      title: 'Realized P/L',
      value: currency(totals.realizedPnl),
      hint: 'Booked',
      icon: Banknote,
      tone: 'from-indigo-500/80 to-purple-500/80'
    },
    {
      title: 'Income',
      value: currency(totals.income),
      hint: 'Dividends / Interest',
      icon: PiggyBank,
      tone: 'from-amber-500/80 to-orange-500/80'
    },
    {
      title: 'Fees',
      value: currency(totals.fees),
      hint: 'Brokerage / Charges',
      icon: Wallet,
      tone: 'from-slate-500/80 to-gray-500/80'
    },
    {
      title: 'Cash Balance',
      value: currency(totals.cashBalance),
      hint: 'Ready to deploy',
      icon: Wallet,
      tone: 'from-cyan-500/80 to-teal-500/80'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/70 hover:border-slate-700/90 transition-all hover:scale-[1.02] group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">{card.title}</CardTitle>
              <span className={`p-2.5 rounded-xl bg-gradient-to-br ${card.tone} shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="h-4 w-4 text-white" />
              </span>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/60 text-xs">
                {card.hint}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

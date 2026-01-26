
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ShieldCheck, Coins, PiggyBank, BriefcaseBusiness, Layers } from 'lucide-react';

export interface InvestmentStat {
  reit: { yield: string; holdings: string };
  nps: { value: string; return: string };
  fdrd: { value: string; interest: string };
  sgb: { quantity: string; value: string };
  demat: { holdings: string; value: string };
  mutualFunds: { value: string; funds: string };
}

interface InvestmentStatsProps {
  stats: InvestmentStat;
  loading: boolean;
}

const items = (stats: InvestmentStat) => ([
  { title: 'REIT', value: stats.reit.holdings, detail: `Yield ${stats.reit.yield}`, icon: Building2 },
  { title: 'NPS', value: stats.nps.value, detail: `Return ${stats.nps.return}`, icon: ShieldCheck },
  { title: 'FD / RD', value: stats.fdrd.value, detail: `Interest ${stats.fdrd.interest}`, icon: PiggyBank },
  { title: 'SGB', value: stats.sgb.value, detail: `Qty ${stats.sgb.quantity}`, icon: Coins },
  { title: 'Equity / DEMAT', value: stats.demat.value, detail: `Holdings ${stats.demat.holdings}`, icon: BriefcaseBusiness },
  { title: 'Mutual Funds', value: stats.mutualFunds.value, detail: `Funds ${stats.mutualFunds.funds}`, icon: Layers }
]);

export const InvestmentStats: React.FC<InvestmentStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-pulse text-white">Loading investment data...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items(stats).map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="bg-slate-900/70 border border-slate-800/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">{item.title}</CardTitle>
              <Icon className="h-5 w-5 text-slate-300" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xl font-semibold text-white">{item.value}</div>
              <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/60">{item.detail}</Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

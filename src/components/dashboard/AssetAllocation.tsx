import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AllocationBucket {
  count: number;
  invested: number;
  currentValue: number;
}

interface Props {
  byAssetType: Record<string, AllocationBucket>;
  totalValue: number;
}

const labels: Record<string, string> = {
  EQUITY: 'Equity',
  ETF: 'ETF',
  REIT: 'REIT',
  MF: 'Mutual Fund',
  FD: 'Fixed Deposit',
  SGB: 'Sovereign Gold Bond',
  NPS: 'NPS',
  CRYPTO: 'Crypto',
  DEMAT: 'Demat'
};

export const AssetAllocation: React.FC<Props> = ({ byAssetType, totalValue }) => {
  const entries = Object.entries(byAssetType || {});
  if (!entries.length) return null;

  return (
    <Card className="bg-slate-900/70 border border-slate-800/70">
      <CardHeader>
        <CardTitle className="text-slate-100">Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map(([key, bucket]) => {
          const pct = totalValue ? (bucket.currentValue / totalValue) * 100 : 0;
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{labels[key] || key}</span>
                <span>{pct.toFixed(1)}%</span>
              </div>
              <Progress value={Number(pct.toFixed(1))} className="h-2" />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Value: ₹{bucket.currentValue.toLocaleString()}</span>
                <span>Positions: {bucket.count}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

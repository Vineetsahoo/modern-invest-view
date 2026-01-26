import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { snapshotsAPI } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

interface DataPoint {
  label: string;
  value: number;
}

interface PerformanceChartProps {
  portfolioId?: string;
  data?: DataPoint[];
  title?: string;
  height?: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  portfolioId,
  data: externalData, 
  title = 'Performance Trend',
  height = 200 
}) => {
  const [data, setData] = useState<DataPoint[]>(externalData || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (portfolioId && !externalData) {
      fetchSnapshotData();
    }
  }, [portfolioId]);

  const fetchSnapshotData = async () => {
    if (!portfolioId) return;
    
    try {
      setLoading(true);
      const snapshots = await snapshotsAPI.getSnapshots(portfolioId, '6M');
      
      if (snapshots.length === 0) {
        // No snapshots yet, use mock data
        setData(generateMockData());
      } else {
        const chartData = snapshots.map((s: any) => ({
          label: new Date(s.snapshotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: s.totalValue
        }));
        setData(chartData);
      }
    } catch (error) {
      console.error('Error fetching snapshots:', error);
      // Fallback to mock data on error
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): DataPoint[] => {
    const now = new Date();
    const mockData: DataPoint[] = [];
    let value = 100000;
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      value = value * (1 + (Math.random() - 0.4) * 0.05);
      mockData.push({
        label: date.toLocaleDateString('en-US', { month: 'short' }),
        value: Math.round(value)
      });
    }
    
    return mockData;
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/70 border border-slate-800/70">
        <CardHeader>
          <CardTitle className="text-slate-100">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full bg-slate-800/50" />
        </CardContent>
      </Card>
    );
  }

  if (!data.length) return null;

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 100;
    return { x, y, ...d };
  });

  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const areaData = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <Card className="bg-slate-900/70 border border-slate-800/70">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-100">{title}</CardTitle>
          <TrendingUp className="h-5 w-5 text-emerald-400" />
        </div>
      </CardHeader>
      <CardContent>
        <svg 
          width="100%" 
          height={height} 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <path
            d={areaData}
            fill="url(#areaGradient)"
          />
          
          <path
            d={pathData}
            fill="none"
            stroke="rgb(16, 185, 129)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
          
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1"
              fill="rgb(16, 185, 129)"
              className="hover:r-2 transition-all cursor-pointer"
            />
          ))}
        </svg>
        
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <span>{data[0]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, Circle } from 'lucide-react';

interface AllocationItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
  change?: number;
}

interface DonutChartProps {
  data: AllocationItem[];
  centerValue?: string;
  centerLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, centerValue, centerLabel }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let currentAngle = 0;
  const radius = 80;
  const strokeWidth = 30;
  const center = 100;
  
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    const x1 = center + radius * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = center + radius * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = center + radius * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = center + radius * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return {
      path: `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      ...item,
      percentage
    };
  });

  return (
    <Card className="bg-slate-900/70 border border-slate-800/70">
      <CardHeader>
        <CardTitle className="text-slate-100">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {segments.map((segment, i) => (
                <path
                  key={i}
                  d={segment.path}
                  fill={segment.color}
                  className="transition-all hover:opacity-80 cursor-pointer"
                />
              ))}
              <circle
                cx={center}
                cy={center}
                r={radius - strokeWidth}
                fill="#0f172a"
              />
              {centerValue && (
                <>
                  <text
                    x={center}
                    y={center - 5}
                    textAnchor="middle"
                    className="text-2xl font-bold fill-white"
                  >
                    {centerValue}
                  </text>
                  <text
                    x={center}
                    y={center + 15}
                    textAnchor="middle"
                    className="text-xs fill-slate-400"
                  >
                    {centerLabel}
                  </text>
                </>
              )}
            </svg>
          </div>
          
          <div className="flex-1 space-y-3 w-full">
            {data.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3" fill={item.color} color={item.color} />
                    <span className="text-slate-200">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">₹{item.value.toLocaleString()}</span>
                    {item.change !== undefined && (
                      <span className={`flex items-center text-xs ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(item.change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

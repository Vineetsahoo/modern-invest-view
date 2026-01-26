
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2, MapPin, ShieldCheck, TrendingUp, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

interface ReitData {
  reit_id: number;
  value: number;
  country: string;
  regulation: string;
  dividend_yield: number;
}

// Mock data for demo
const mockReitData: ReitData[] = [
  {
    reit_id: 1,
    value: 250000,
    country: 'India',
    regulation: 'SEBI Regulated',
    dividend_yield: 7.5
  },
  {
    reit_id: 2,
    value: 350000,
    country: 'USA',
    regulation: 'SEC Regulated',
    dividend_yield: 6.8
  },
  {
    reit_id: 3,
    value: 180000,
    country: 'Singapore',
    regulation: 'MAS Regulated',
    dividend_yield: 7.2
  }
];

const ReitPage = () => {
  const [loading, setLoading] = useState(true);
  const [reitData, setReitData] = useState<ReitData[]>([]);

  useEffect(() => {
    async function fetchReitData() {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data
        setReitData(mockReitData);
      } catch (error) {
        console.error("Error in REIT data fetch:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReitData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-banking-darkBg pb-20">
        <Navbar />
        <div className="pt-24 px-6 max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" className="mr-2 text-banking-silver hover:text-banking-white p-0">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-banking-white">Real Estate Investment Trusts</h1>
          </div>
          
          <div className="grid gap-6">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="bg-banking-darkGray border-banking-purple/20">
                <CardHeader className="pb-2">
                  <Skeleton className="h-7 w-32 bg-banking-darkGray/50" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-20 mb-2 bg-banking-darkGray/50" />
                        <Skeleton className="h-6 w-32 bg-banking-darkGray/50" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20">
      <Navbar />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="mr-2 text-slate-300 hover:text-white p-0">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Real Estate Investment Trusts
            </h1>
            <p className="text-slate-400 text-sm mt-1">Diversified real estate holdings</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          {reitData.map((reit, index) => (
            <Card key={reit.reit_id} className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/70 hover:border-slate-700/90 transition-all hover:scale-[1.01] group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/80 to-cyan-500/80 shadow-lg group-hover:scale-110 transition-transform">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl">REIT #{reit.reit_id}</CardTitle>
                      <p className="text-slate-400 text-sm">Investment Property Portfolio</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {reit.dividend_yield}% Yield
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Building2 className="h-4 w-4" />
                      <span>REIT ID</span>
                    </div>
                    <div className="text-xl font-bold text-white">{reit.reit_id}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>Portfolio Value</span>
                    </div>
                    <div className="text-xl font-bold text-white">₹{formatCurrency(reit.value)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>Country</span>
                    </div>
                    <div className="text-xl font-bold text-white">{reit.country}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Regulation</span>
                    </div>
                    <div className="text-xl font-bold text-white">{reit.regulation}</div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="h-5 w-5 text-emerald-400" />
                      <span className="text-slate-300 font-medium">Annual Dividend Yield</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-400">{reit.dividend_yield}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReitPage;

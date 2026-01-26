
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, BarChart3, Shield, AlertCircle, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const MutualFundPage = () => {
  const fundData = [
    {
      id: "MF-001",
      category: "Large Cap Equity",
      riskLevel: "High",
      returns: "12.5%",
      nav: "₹145.50",
      aum: "₹2,500 Cr"
    },
    {
      id: "MF-002",
      category: "Mid Cap Equity",
      riskLevel: "High",
      returns: "15.2%",
      nav: "₹98.75",
      aum: "₹1,200 Cr"
    },
    {
      id: "MF-003",
      category: "Small Cap Equity",
      riskLevel: "Very High",
      returns: "18.7%",
      nav: "₹67.30",
      aum: "₹850 Cr"
    },
    {
      id: "MF-004",
      category: "Debt Fund",
      riskLevel: "Low",
      returns: "6.8%",
      nav: "₹25.40",
      aum: "₹3,800 Cr"
    },
    {
      id: "MF-005",
      category: "Balanced Advantage Fund",
      riskLevel: "Moderate",
      returns: "10.3%",
      nav: "₹112.20",
      aum: "₹1,650 Cr"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'from-green-500/80 to-emerald-500/80';
      case 'Moderate': return 'from-yellow-500/80 to-orange-500/80';
      case 'High': return 'from-orange-500/80 to-red-500/80';
      case 'Very High': return 'from-red-500/80 to-rose-500/80';
      default: return 'from-blue-500/80 to-cyan-500/80';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch(risk) {
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Very High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

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
              Mutual Funds
            </h1>
            <p className="text-slate-400 text-sm mt-1">Professionally managed investment portfolios</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          {fundData.map((fund) => (
            <Card key={fund.id} className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/70 hover:border-slate-700/90 transition-all hover:scale-[1.01] group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getRiskColor(fund.riskLevel)} shadow-lg group-hover:scale-110 transition-transform`}>
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl">{fund.category}</CardTitle>
                      <p className="text-slate-400 text-sm">{fund.id}</p>
                    </div>
                  </div>
                  <Badge className={getRiskBadge(fund.riskLevel)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {fund.riskLevel} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <BarChart3 className="h-4 w-4" />
                      <span>1Y Returns</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-400">{fund.returns}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>Current NAV</span>
                    </div>
                    <div className="text-xl font-bold text-white">{fund.nav}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Layers className="h-4 w-4" />
                      <span>AUM</span>
                    </div>
                    <div className="text-xl font-bold text-white">{fund.aum}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Shield className="h-4 w-4" />
                      <span>Risk Level</span>
                    </div>
                    <div className="text-xl font-bold text-white">{fund.riskLevel}</div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <AlertCircle className="h-4 w-4 text-purple-400" />
                    <span>Past performance is not indicative of future results. Please read scheme documents carefully.</span>
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

export default MutualFundPage;


import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';

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
          {reitData.map((reit) => (
            <Card key={reit.reit_id} className="bg-banking-darkGray border-banking-purple/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-banking-white text-xl">REIT ID: {reit.reit_id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <div className="text-sm text-banking-silver">REIT ID</div>
                    <div className="text-lg font-medium text-banking-white">{reit.reit_id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-banking-silver">Value</div>
                    <div className="text-lg font-medium text-banking-white">₹{formatCurrency(reit.value)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-banking-silver">Regulation</div>
                    <div className="text-lg font-medium text-banking-white">{reit.regulation}</div>
                  </div>
                  <div>
                    <div className="text-sm text-banking-silver">Country</div>
                    <div className="text-lg font-medium text-banking-white">{reit.country}</div>
                  </div>
                  <div>
                    <div className="text-sm text-banking-silver">Dividend Yield</div>
                    <div className="text-lg font-medium text-banking-white">{reit.dividend_yield}%</div>
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

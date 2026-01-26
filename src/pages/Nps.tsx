
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Mock data for demo
const mockNpsData = [
  {
    nps_id: 1,
    pran: 'NPS123456789',
    contribution: 50000,
    returns: 8.5,
    scheme_type: 'Tier I'
  },
  {
    nps_id: 2,
    pran: 'NPS987654321',
    contribution: 75000,
    returns: 9.2,
    scheme_type: 'Tier II'
  }
];

const NpsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [npsData, setNpsData] = useState([]);

  useEffect(() => {
    async function fetchNpsData() {
      setLoading(true);
      
      try {
        const customerId = sessionStorage.getItem('customer_id');
        
        if (!customerId) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Could not find customer information",
          });
          setLoading(false);
          return;
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data
        setNpsData(mockNpsData);
      } catch (error) {
        console.error("Error fetching NPS data:", error);
        toast({
          variant: "destructive",
          title: "Data Loading Error",
          description: "Failed to load NPS data from database",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchNpsData();
  }, [toast]);

  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

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
          <h1 className="text-3xl font-bold text-banking-white">National Pension System</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-banking-white">Loading NPS data...</div>
          </div>
        ) : npsData.length === 0 ? (
          <Card className="bg-banking-darkGray border-banking-purple/20">
            <CardContent className="pt-6">
              <p className="text-banking-white text-center">No NPS accounts found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {npsData.map((nps) => (
              <Card key={nps.nps_id} className="bg-banking-darkGray border-banking-purple/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-banking-white text-xl">NPS {nps.nps_id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <div className="text-sm text-banking-silver">NPS ID</div>
                      <div className="text-lg font-medium text-banking-white">{nps.nps_id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-banking-silver">Customer ID</div>
                      <div className="text-lg font-medium text-banking-white">{nps.customer_id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-banking-silver">Account ID</div>
                      <div className="text-lg font-medium text-banking-white">{nps.account_id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-banking-silver">Contribution</div>
                      <div className="text-lg font-medium text-banking-white">{formatCurrency(nps.contribution)}/month</div>
                    </div>
                    <div>
                      <div className="text-sm text-banking-silver">Maturity Age</div>
                      <div className="text-lg font-medium text-banking-white">{nps.maturity_age} years</div>
                    </div>
                    <div>
                      <div className="text-sm text-banking-silver">Fund Choice</div>
                      <div className="text-lg font-medium text-banking-white">{nps.fund_choice}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NpsPage;

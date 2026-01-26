
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface RegulatoryDetailsProps {
  regulatoryDetails: {
    regulatoryId: string;
    name: string;
    country: string;
    regulations: string;
  };
  loading: boolean;
  customerId?: string;
}

export const RegulatoryDetails: React.FC<RegulatoryDetailsProps> = ({ regulatoryDetails: defaultRegulatoryDetails, loading: initialLoading, customerId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(initialLoading);
  const [regulatoryDetails, setRegulatoryDetails] = useState(defaultRegulatoryDetails);

  useEffect(() => {
    async function fetchRegulatoryData() {
      if (!customerId) return;
      
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in production, fetch from your API
        setRegulatoryDetails(defaultRegulatoryDetails);
      } catch (error) {
        console.error("Error fetching regulatory data:", error);
        toast({
          variant: "destructive",
          title: "Data Loading Error",
          description: "Failed to load regulatory data from database",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchRegulatoryData();
  }, [customerId, toast]);

  if (loading) {
    return (
      <Card className="bg-banking-darkGray border-banking-purple/20">
        <CardHeader>
          <CardTitle className="text-banking-white">Regulatory Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <div className="text-sm text-banking-silver">Field {item}</div>
                <div className="h-5 bg-banking-purple/30 rounded w-24 mt-1"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-banking-darkGray border-banking-purple/20">
      <CardHeader>
        <CardTitle className="text-banking-white">Regulatory Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-banking-silver">Regulatory ID</div>
            <div className="text-lg font-medium text-banking-white">{regulatoryDetails.regulatoryId}</div>
          </div>
          <div>
            <div className="text-sm text-banking-silver">Name</div>
            <div className="text-lg font-medium text-banking-white">{regulatoryDetails.name}</div>
          </div>
          <div>
            <div className="text-sm text-banking-silver">Country</div>
            <div className="text-lg font-medium text-banking-white">{regulatoryDetails.country}</div>
          </div>
          <div>
            <div className="text-sm text-banking-silver">Regulations</div>
            <div className="text-lg font-medium text-banking-white">{regulatoryDetails.regulations}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface BranchDetailsProps {
  branchDetails: {
    branchId: string;
    name: string;
    ifscCode: string;
  };
  loading: boolean;
  customerId?: string;
}

export const BranchDetails: React.FC<BranchDetailsProps> = ({ branchDetails: defaultBranchDetails, loading: initialLoading, customerId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(initialLoading);
  const [branchDetails, setBranchDetails] = useState(defaultBranchDetails);

  useEffect(() => {
    async function fetchBranchData() {
      if (!customerId) return;
      
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in production, fetch from your API
        setBranchDetails(defaultBranchDetails);
      } catch (error) {
        console.error("Error fetching branch data:", error);
        toast({
          variant: "destructive",
          title: "Data Loading Error",
          description: "Failed to load branch data from database",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchBranchData();
  }, [customerId, toast]);

  if (loading) {
    return (
      <Card className="bg-banking-darkGray border-banking-purple/20">
        <CardHeader>
          <CardTitle className="text-banking-white">Branch Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
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
        <CardTitle className="text-banking-white">Branch Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-banking-silver">Branch ID</div>
            <div className="text-lg font-medium text-banking-white">{branchDetails.branchId}</div>
          </div>
          <div>
            <div className="text-sm text-banking-silver">Name</div>
            <div className="text-lg font-medium text-banking-white">{branchDetails.name}</div>
          </div>
          <div>
            <div className="text-sm text-banking-silver">IFSC Code</div>
            <div className="text-lg font-medium text-banking-white">{branchDetails.ifscCode}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

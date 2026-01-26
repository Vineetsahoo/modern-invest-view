
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { InvestmentStat } from '@/components/InvestmentStats';
import { investmentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useInvestmentData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [investmentStats, setInvestmentStats] = useState<InvestmentStat>({
    reit: { yield: "0%", holdings: "0" },
    nps: { value: "₹0", return: "0%" },
    fdrd: { value: "₹0", interest: "0%" },
    sgb: { quantity: "0g", value: "₹0" },
    demat: { holdings: "0", value: "₹0" },
    mutualFunds: { value: "₹0", funds: "0" }
  });

  useEffect(() => {
    async function fetchInvestmentData() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Fetch stats from backend
        const stats = await investmentAPI.getStats();
        
        // Transform backend stats to match the InvestmentStat interface
        const newStats: InvestmentStat = {
          reit: {
            yield: stats.byType?.REIT ? 
              `${((stats.byType.REIT.currentValue - stats.byType.REIT.totalInvestment) / stats.byType.REIT.totalInvestment * 100).toFixed(2)}%` : 
              "0%",
            holdings: stats.byType?.REIT ? `₹${stats.byType.REIT.currentValue.toLocaleString()}` : "₹0"
          },
          nps: {
            value: stats.byType?.NPS ? `₹${stats.byType.NPS.currentValue.toLocaleString()}` : "₹0",
            return: stats.byType?.NPS ? 
              `${((stats.byType.NPS.currentValue - stats.byType.NPS.totalInvestment) / stats.byType.NPS.totalInvestment * 100).toFixed(2)}%` : 
              "0%"
          },
          fdrd: {
            value: stats.byType?.FD ? `₹${stats.byType.FD.currentValue.toLocaleString()}` : "₹0",
            interest: stats.byType?.FD ? 
              `${((stats.byType.FD.currentValue - stats.byType.FD.totalInvestment) / stats.byType.FD.totalInvestment * 100).toFixed(2)}%` : 
              "0%"
          },
          sgb: {
            quantity: stats.byType?.SGB ? `${stats.byType.SGB.count}` : "0",
            value: stats.byType?.SGB ? `₹${stats.byType.SGB.currentValue.toLocaleString()}` : "₹0"
          },
          demat: {
            holdings: stats.byType?.DEMAT ? `${stats.byType.DEMAT.count}` : "0",
            value: stats.byType?.DEMAT ? `₹${stats.byType.DEMAT.currentValue.toLocaleString()}` : "₹0"
          },
          mutualFunds: {
            value: stats.byType?.MUTUAL_FUND ? `₹${stats.byType.MUTUAL_FUND.currentValue.toLocaleString()}` : "₹0",
            funds: stats.byType?.MUTUAL_FUND ? `${stats.byType.MUTUAL_FUND.count}` : "0"
          }
        };

        setInvestmentStats(newStats);
      } catch (error: any) {
        console.error('Error fetching investment data:', error);
        
        // If not authorized, use default values
        if (error.response?.status === 401) {
          console.log('User not authorized, using default values');
        } else {
          toast({
            variant: "destructive",
            title: "Error loading investments",
            description: error.response?.data?.message || "Failed to fetch investment data",
          });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchInvestmentData();
  }, [user, toast]);

  return {
    loading,
    investmentStats
  };
};

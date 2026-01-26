
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { InvestmentStat } from '@/components/InvestmentStats';
import { portfolioAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useInvestmentData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [portfolioStats, setPortfolioStats] = useState<any | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
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
        // Ensure a default portfolio exists
        const portfolios = await portfolioAPI.list();
        let chosen = portfolios[0];
        if (!chosen) {
          chosen = await portfolioAPI.create({ name: 'Main', baseCurrency: 'INR' });
        }
        setPortfolioId(chosen._id);

        // Fetch stats for the chosen portfolio
        const stats = await portfolioAPI.stats(chosen._id);
        setPortfolioStats(stats);

        const mapValue = (typeKey: string) => {
          const bucket = stats.byAssetType?.[typeKey];
          return bucket ? `₹${bucket.currentValue.toLocaleString()}` : '₹0';
        };

        const percent = (bucket: any) => {
          if (!bucket || !bucket.currentValue || !bucket.invested) return '0%';
          const base = bucket.invested || 1;
          return `${(((bucket.currentValue - bucket.invested) / base) * 100).toFixed(2)}%`;
        };

        const newStats: InvestmentStat = {
          reit: {
            yield: percent(stats.byAssetType?.REIT),
            holdings: mapValue('REIT')
          },
          nps: {
            value: mapValue('NPS'),
            return: percent(stats.byAssetType?.NPS)
          },
          fdrd: {
            value: mapValue('FD'),
            interest: percent(stats.byAssetType?.FD)
          },
          sgb: {
            quantity: stats.byAssetType?.SGB ? `${stats.byAssetType.SGB.count}` : '0',
            value: mapValue('SGB')
          },
          demat: {
            holdings: stats.byAssetType?.DEMAT ? `${stats.byAssetType.DEMAT.count}` : '0',
            value: mapValue('DEMAT')
          },
          mutualFunds: {
            value: mapValue('MF'),
            funds: stats.byAssetType?.MF ? `${stats.byAssetType.MF.count}` : '0'
          }
        };

        setInvestmentStats(newStats);
      } catch (error: any) {
        console.error('Error fetching investment data:', error);

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
  }, [user, toast, refreshToken]);

  return {
    loading,
    investmentStats,
    portfolioId,
    portfolioStats,
    refresh: () => setRefreshToken((v) => v + 1),
    refreshToken
  };
};

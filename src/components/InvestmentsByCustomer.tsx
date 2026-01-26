import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

type CustomerInvestment = {
  customerId: number;
  customerName: string;
  reit: string;
  nps: string;
  fd: string;
  sgb: string;
  stocks: string;
  mutualFunds: string;
};

// Mock data for demo
const mockCustomerInvestments: CustomerInvestment[] = [
  {
    customerId: 1,
    customerName: 'John Doe',
    reit: '₹2,50,000',
    nps: '₹5,00,000',
    fd: '₹3,00,000',
    sgb: '₹1,50,000',
    stocks: '₹8,00,000',
    mutualFunds: '₹6,00,000'
  },
  {
    customerId: 2,
    customerName: 'Jane Smith',
    reit: '₹3,50,000',
    nps: '₹4,50,000',
    fd: '₹2,50,000',
    sgb: '₹2,00,000',
    stocks: '₹10,00,000',
    mutualFunds: '₹7,50,000'
  },
  {
    customerId: 3,
    customerName: 'Robert Johnson',
    reit: '₹1,80,000',
    nps: '₹3,75,000',
    fd: '₹4,00,000',
    sgb: '₹1,25,000',
    stocks: '₹6,50,000',
    mutualFunds: '₹5,00,000'
  }
];

export const InvestmentsByCustomer = () => {
  const [loading, setLoading] = useState(true);
  const [customerInvestments, setCustomerInvestments] = useState<CustomerInvestment[]>([]);

  useEffect(() => {
    async function fetchAllInvestmentsData() {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data
        setCustomerInvestments(mockCustomerInvestments);
      } catch (error) {
        console.error("Error fetching investment data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAllInvestmentsData();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 mt-8 bg-banking-darkGray border-banking-purple/20">
        <div className="space-y-2">
          <Skeleton className="h-8 w-full bg-banking-darkGray/50" />
          <Skeleton className="h-8 w-full bg-banking-darkGray/50" />
          <Skeleton className="h-8 w-full bg-banking-darkGray/50" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-8 bg-banking-darkGray border-banking-purple/20">
      <h2 className="text-2xl font-bold text-banking-white mb-4">Customer Investments</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Investment portfolio for all customers</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-banking-white">Customer</TableHead>
              <TableHead className="text-banking-white">REIT</TableHead>
              <TableHead className="text-banking-white">NPS</TableHead>
              <TableHead className="text-banking-white">FD/RD</TableHead>
              <TableHead className="text-banking-white">SGB</TableHead>
              <TableHead className="text-banking-white">DEMAT</TableHead>
              <TableHead className="text-banking-white">Mutual Funds</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerInvestments.map((customer) => (
              <TableRow key={customer.customerId}>
                <TableCell className="font-medium text-banking-white">{customer.customerName}</TableCell>
                <TableCell className="text-banking-white">{customer.reit}</TableCell>
                <TableCell className="text-banking-white">{customer.nps}</TableCell>
                <TableCell className="text-banking-white">{customer.fd}</TableCell>
                <TableCell className="text-banking-white">{customer.sgb}</TableCell>
                <TableCell className="text-banking-white">{customer.stocks}</TableCell>
                <TableCell className="text-banking-white">{customer.mutualFunds}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

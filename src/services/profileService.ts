
import { useToast } from '@/components/ui/use-toast';

export type CustomerData = {
  name: string;
  accountId: string;
  phone: string;
}

export type BranchDetails = {
  branchId: string;
  name: string;
  ifscCode: string;
}

export type AMCDetails = {
  amcId: string;
  name: string;
  licenseId: string;
}

export type RegulatoryDetails = {
  regulatoryId: string;
  name: string;
  country: string;
  regulations: string;
}

// Mock data for demo
const mockCustomerData = {
  customer_id: 1,
  name: 'John Doe',
  pan: 'ABCDE1234F',
  account_id: 'ACC001',
  phone: '+91 9876543210'
};

const mockBranchData = {
  branch_id: 'BR001',
  name: 'Main Branch',
  ifsc_code: 'ABCD0001234'
};

const mockAmcData = {
  amc_id: 'AMC001',
  name: 'Premium Asset Management',
  license_id: 'LIC123456'
};

const mockRegulatoryData = {
  regulatory_id: 'REG001',
  name: 'SEBI',
  country: 'India',
  regulations: 'Securities and Exchange Board of India Regulations'
};

export async function fetchProfileData() {
  // Get customer ID from session storage
  const customerId = sessionStorage.getItem('customer_id');
  
  if (!customerId) {
    throw new Error("Could not find customer information");
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  const customerData = mockCustomerData;
  const branchData = mockBranchData;
  const amcData = mockAmcData;
  const regulatoryData = mockRegulatoryData;

  return {
    customerData: {
      name: customerData?.name || "",
      accountId: customerData?.account_id || 'No account found',
      phone: customerData?.phone || ''
    },
    branchData: {
      branchId: branchData.branch_id,
      name: branchData.name,
      ifscCode: branchData.ifsc_code
    },
    amcData: {
      amcId: amcData.amc_id,
      name: amcData.name,
      licenseId: amcData.license_id
    },
    regulatoryData: {
      regulatoryId: regulatoryData.regulatory_id,
      name: regulatoryData.name,
      country: regulatoryData.country,
      regulations: regulatoryData.regulations
    }
  };
}

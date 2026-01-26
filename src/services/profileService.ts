
import { authAPI } from './api';

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

export async function fetchProfileData() {
  try {
    // Fetch current user profile from backend; authAPI adds token header automatically
    const profile = await authAPI.getProfile();

    // Map backend profile to UI shape; use sensible fallbacks where data is optional
    const customerData: CustomerData = {
      name: profile.name || '',
      accountId: profile._id || 'N/A',
      phone: profile.phone || ''
    };

    // Placeholder data until branch/AMC/regulatory endpoints exist
    const branchData: BranchDetails = {
      branchId: profile.branchId || '—',
      name: profile.branchName || '—',
      ifscCode: profile.ifscCode || '—'
    };

    const amcData: AMCDetails = {
      amcId: profile.amcId || '—',
      name: profile.amcName || '—',
      licenseId: profile.licenseId || '—'
    };

    const regulatoryData: RegulatoryDetails = {
      regulatoryId: profile.regulatoryId || '—',
      name: profile.regulator || '—',
      country: profile.regulatorCountry || '—',
      regulations: profile.regulations || '—'
    };

    return { customerData, branchData, amcData, regulatoryData };
  } catch (error: any) {
    // Surface backend error message when available
    const message = error?.response?.data?.message || error?.message || 'Unable to load profile data';
    throw new Error(message);
  }
}

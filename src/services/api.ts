import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; pan: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string; password?: string }) => {
    const response = await api.put('/auth/profile', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
};

// Portfolio API
export const portfolioAPI = {
  list: async () => {
    const response = await api.get('/portfolios');
    return response.data;
  },
  create: async (data: { name: string; baseCurrency?: string; cashBalance?: number }) => {
    const response = await api.post('/portfolios', data);
    return response.data;
  },
  stats: async (portfolioId: string) => {
    const response = await api.get(`/portfolios/${portfolioId}/stats`);
    return response.data;
  },
  addTransaction: async (portfolioId: string, data: any) => {
    const response = await api.post(`/portfolios/${portfolioId}/transactions`, data);
    return response.data;
  },
  listTransactions: async (portfolioId: string) => {
    const response = await api.get(`/portfolios/${portfolioId}/transactions`);
    return response.data;
  }
};

// Watchlist API
export const watchlistAPI = {
  list: async () => {
    const response = await api.get('/watchlist');
    return response.data;
  },
  add: async (data: { symbol: string; note?: string; targetPrice?: number; stopPrice?: number; currency?: string }) => {
    const response = await api.post('/watchlist', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/watchlist/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/watchlist/${id}`);
    return response.data;
  }
};

// Quotes API (mockable)
export const quotesAPI = {
  get: async (symbols: string[]) => {
    const response = await api.get('/quotes', { params: { symbols: symbols.join(',') } });
    return response.data as Array<{ symbol: string; price: number; currency: string; asOf: string }>;
  }
};

// Historical Prices API
export const historicalPricesAPI = {
  getHistory: async (symbol: string, period: string = '6M') => {
    const response = await api.get(`/prices/${symbol}/history`, { params: { period } });
    return response.data;
  },
  updatePrices: async (symbols: string[]) => {
    const response = await api.post('/prices/update', { symbols });
    return response.data;
  }
};

// Portfolio Snapshots API
export const snapshotsAPI = {
  getSnapshots: async (portfolioId: string, period: string = '6M') => {
    const response = await api.get(`/portfolios/${portfolioId}/snapshots`, { params: { period } });
    return response.data;
  },
  createSnapshot: async (portfolioId: string, snapshotDate?: Date) => {
    const response = await api.post(`/portfolios/${portfolioId}/snapshots`, { snapshotDate });
    return response.data;
  },
  backfillSnapshots: async (portfolioId: string, days: number = 180) => {
    const response = await api.post(`/portfolios/${portfolioId}/snapshots/backfill`, { days });
    return response.data;
  }
};

// Price Alerts API
export const alertsAPI = {
  getAlerts: async (active?: boolean, triggered?: boolean) => {
    const response = await api.get('/alerts', { params: { active, triggered } });
    return response.data;
  },
  createAlert: async (data: {
    symbol: string;
    alertType: string;
    condition: string;
    targetPrice?: number;
    notificationMethod?: string;
    message?: string;
  }) => {
    const response = await api.post('/alerts', data);
    return response.data;
  },
  createFromWatchlist: async () => {
    const response = await api.post('/alerts/from-watchlist');
    return response.data;
  },
  updateAlert: async (id: string, data: any) => {
    const response = await api.put(`/alerts/${id}`, data);
    return response.data;
  },
  deleteAlert: async (id: string) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  },
  checkAlerts: async () => {
    const response = await api.post('/alerts/check');
    return response.data;
  }
};

// Investment API
export const investmentAPI = {
  getAll: async (type?: string) => {
    const response = await api.get('/investments', { params: { type } });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/investments/stats');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/investments', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/investments/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/investments/${id}`);
    return response.data;
  },
};

export default api;

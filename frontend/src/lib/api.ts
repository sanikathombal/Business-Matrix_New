const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  registerWithImage: async (formData: FormData) => {
    const url = `${API_BASE_URL}/auth/register`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type header for FormData
        mode: 'cors',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  businessLogin: async (credentials: {
    email: string;
    password: string;
  }) => {
    return apiRequest('/auth/business-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  businessRegister: async (formData: FormData) => {
    const url = `${API_BASE_URL}/auth/business-register`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type header for FormData
        mode: 'cors',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  getCurrentUser: async (token: string) => {
    return apiRequest('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Business API functions
export const businessAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    industry?: string;
    city?: string;
    search?: string;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/businesses${queryString}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/businesses/${id}`);
  },

  create: async (businessData: any) => {
    // Check if it's FormData (for file uploads)
    if (businessData instanceof FormData) {
      const url = `${API_BASE_URL}/businesses`;
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: businessData, // Don't set Content-Type header for FormData
          mode: 'cors',
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Business creation failed:', error);
        throw error;
      }
    } else {
      // Regular JSON request
      return apiRequest('/businesses', {
        method: 'POST',
        body: JSON.stringify(businessData),
      });
    }
  },

  update: async (id: string, businessData: any) => {
    return apiRequest(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(businessData),
    });
  },

  approve: async (id: string) => {
    return apiRequest(`/businesses/${id}/approve`, {
      method: 'PUT',
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/businesses/${id}`, {
      method: 'DELETE',
    });
  },

  getMyBusinesses: async (token: string) => {
    return apiRequest('/businesses/my/businesses', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

export const jobAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/jobs${queryString}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/jobs/${id}`);
  },

  create: async (jobData: any) => {
    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  update: async (id: string, jobData: any) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  approve: async (id: string) => {
    return apiRequest(`/jobs/${id}/approve`, {
      method: 'PUT',
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Category API functions
export const categoryAPI = {
  getAll: async () => {
    return apiRequest('/categories');
  },

  getById: async (id: string) => {
    return apiRequest(`/categories/${id}`);
  },

  getBusinessesByCategory: async (categoryName: string, params?: {
    page?: number;
    limit?: number;
    city?: string;
    state?: string;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/categories/${categoryName}/businesses${queryString}`);
  },
};

// Review API functions
export const reviewAPI = {
  getByBusiness: async (businessId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/reviews/business/${businessId}${queryString}`);
  },

  create: async (reviewData: any, token: string) => {
    return apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  getMyReviews: async (token: string) => {
    return apiRequest('/reviews/my/reviews', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Lead API functions
export const leadAPI = {
  create: async (leadData: any) => {
    return apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  getMyLeads: async (token: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/leads/my/leads${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Package API functions
export const packageAPI = {
  getAll: async () => {
    return apiRequest('/packages');
  },

  getById: async (id: string) => {
    return apiRequest(`/packages/${id}`);
  },
};

export default apiRequest;
